from fastapi import APIRouter, HTTPException, Depends
from database import db
from models import Gallery
from bson.objectid import ObjectId
from auth import get_current_user, require_admin

router = APIRouter()

@router.get("/galleries")
def get_galleries():
    galleries = list(db.galleries.find())
    for g in galleries:
        g["_id"] = str(g["_id"])

        preview_ids = [ObjectId(wid) for wid in g.get("work_ids", [])[:3] if ObjectId.is_valid(wid)]
        preview_works = list(db.works.find({"_id": {"$in": preview_ids}}, {"file_path": 1, "title": 1}))
        for w in preview_works:
            w["_id"] = str(w["_id"])

        g["preview_works"] = preview_works

    return {"galleries": galleries}

@router.get("/galleries/{gallery_id}")
def get_gallery(gallery_id: str):
    if not ObjectId.is_valid(gallery_id):
        raise HTTPException(status_code=400, detail="Invalid gallery ID")

    gallery = db.galleries.find_one({"_id": ObjectId(gallery_id)})
    if not gallery:
        raise HTTPException(status_code=404, detail="Gallery not found")

    gallery["_id"] = str(gallery["_id"])

    work_object_ids = [ObjectId(wid) for wid in gallery.get("work_ids", []) if ObjectId.is_valid(wid)]
    works = list(db.works.find({"_id": {"$in": work_object_ids}}))
    for w in works:
        w["_id"] = str(w["_id"])

    gallery["works"] = works
    return gallery

@router.post("/galleries")
def create_gallery(gallery: Gallery, admin=Depends(require_admin)):
    gallery_data = gallery.model_dump()
    result = db.galleries.insert_one(gallery_data)
    gallery_data["_id"] = str(result.inserted_id)
    return {"message": "Gallery created", "gallery": gallery_data}