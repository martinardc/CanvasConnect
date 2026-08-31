from fastapi import APIRouter, UploadFile, File, Depends, Form,  Query, status, HTTPException
from fastapi.responses import JSONResponse
import os, shutil
from auth import get_current_user, get_optional_user
from database import db
from models import UploadWorks
from datetime import datetime, timezone
from bson.objectid import ObjectId
import json

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)



@router.post("/upload-profile-pic")
async def upload_profile_pic(file: UploadFile = File(...), user=Depends(get_current_user)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    db.users.update_one(
        {"username": user["username"]},
        {"$set": {"profile_pic": file_path}}
    )
    return JSONResponse({"message": "Profile picture updated", "file_path": file_path})



@router.post("/upload-works")
async def upload_work(
    title: str = Form(...),
    category: str = Form(...),
    description: str = Form(None),
    price: float = Form(None),
    file: UploadFile = File(...),
    user=Depends(get_current_user)
):
    categories_list = json.loads(category)
    work_data = UploadWorks(title=title, category=categories_list, description=description, price=price)
    username = user["username"]

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    timestamp = datetime.now(timezone.utc).timestamp()
    file_path = os.path.join(UPLOAD_DIR, f"{timestamp}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    now = datetime.now(timezone.utc)
    work = {
        "username": username,
        **work_data.model_dump(),
        "file_path": file_path,
        "uploaded_at": now.isoformat(), 
    }

    db.works.insert_one(work)

    if '_id' in work:
        work['_id'] = str(work['_id'])
    return JSONResponse({"message": "Work uploaded successfully!", "work": work})


@router.get("/works")
async def get_works(
    category: str = Query(None),
    limit: int = Query(None),
    current_user=Depends(get_optional_user)
):
    query = {}

    if category:
        query["category"] = category

    username = current_user["username"] if current_user else None

    if limit and username:
        query["username"] = {"$ne": username}

    pipeline = [
        {"$match": query},
        {"$sample": {"size": limit or 8}}
    ]

    works_cursor = db.works.aggregate(pipeline)

    works = []

    for work in works_cursor:
        work["_id"] = str(work["_id"])
        work["likes_count"] = db.likes.count_documents({"work_id": work["_id"]})
        work["comments_count"] = db.comments.count_documents({"work_id": work["_id"]})
        works.append(work)

    return JSONResponse(content={"works": works})

@router.get("/works-by-user")
async def get_works_by_user(
    username: str = Query(...),
    current_user=Depends(get_optional_user)
):
    works_cursor = db.works.find({"username": username})
    works = []

    current_username = current_user["username"] if current_user else None

    for work in works_cursor:
        work["_id"] = str(work["_id"])

        work["likes_count"] = db.likes.count_documents({
            "work_id": work["_id"]
        })

        work["is_liked"] = False

        if current_username:
            work["is_liked"] = db.likes.find_one({
                "work_id": work["_id"],
                "username": current_username
            }) is not None

        work["comments_count"] = db.comments.count_documents({
            "work_id": work["_id"]
        })

        uploaded_at = work.get("uploaded_at")
        if uploaded_at and not isinstance(uploaded_at, str):
            work["uploaded_at"] = uploaded_at.isoformat()

        works.append(work)

    return JSONResponse({"works": works})

@router.delete("/works/{work_id}")
async def delete_work(work_id: str, user=Depends(get_current_user)):
    if not ObjectId.is_valid(work_id):
        raise HTTPException(status_code=400, detail="Invalid work ID")

    obj_id = ObjectId(work_id)
    
    work = db.works.find_one({"_id": obj_id})
    if not work:
        raise HTTPException(status_code=404, detail="Work not found")

    
    username = user["username"]
    if work["username"] != username:
        raise HTTPException(status_code=403, detail="Not authorized to delete this work")

    db.works.delete_one({"_id": obj_id})
    db.likes.delete_many({"work_id": work_id})
    db.comments.delete_many({"work_id": work_id})
    db.competition_entries.delete_many({"work_id": work_id})
    db.purchases.delete_many({"work_id": work_id})

    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content={"message": "Work deleted successfully"})

@router.get("/works/{work_id}")
async def get_work_by_id(work_id: str, current_user=Depends(get_optional_user)):
    if not ObjectId.is_valid(work_id):
        raise HTTPException(status_code=400, detail="Invalid work ID")

    oid = ObjectId(work_id)

    work = db.works.find_one({"_id": oid})
    if not work:
        raise HTTPException(status_code=404, detail="Work not found")

    work["_id"] = str(work["_id"])

    work["likes_count"] = db.likes.count_documents({
        "work_id": work["_id"]
    })

    work["is_liked"] = False

    if current_user:
        work["is_liked"] = db.likes.find_one({
            "work_id": work["_id"],
            "username": current_user["username"]
        }) is not None

    work["comments_count"] = db.comments.count_documents({
        "work_id": work["_id"]
    })

    uploaded_at = work.get("uploaded_at")
    if uploaded_at and not isinstance(uploaded_at, str):
        work["uploaded_at"] = uploaded_at.isoformat()

    return work

