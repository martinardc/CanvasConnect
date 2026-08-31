from fastapi import APIRouter, Depends, HTTPException, Form
from datetime import datetime, timezone
from database import db
from auth import get_current_user
from bson.objectid import ObjectId

router = APIRouter()

@router.post("/works/{work_id}/comment")
def comment_work(work_id: str, text: str = Form(...), user=Depends(get_current_user)):
    if not text.strip():
        raise HTTPException(status_code=400, detail="Comment can't be empty")

    comment = {
        "work_id": work_id,
        "username": user["username"],
        "text": text,
        "created_at": datetime.now(timezone.utc)
    }
    result = db.comments.insert_one(comment)
    comment["_id"] = str(result.inserted_id)
    comment["created_at"] = comment["created_at"].isoformat()

    return {"message": "commented", "comment": comment}


@router.get("/works/{work_id}/comments")
def get_comments_by_work_id(work_id: str):
    # dohvati sve komentare za ovaj rad iz baze
    comments_cursor = db.comments.find({"work_id": work_id})

    # pretvori cursor (mongo objekt) u obicnu python listu
    comments = list(comments_cursor)

    # prodi kroz svaki komentar i pripremi ga za slanje na frontend
    for comment in comments:
        # mongodb objectId nije moguce direktno pretvoriti u json, pa ide u string
        comment["_id"] = str(comment["_id"])

        # datum isto ne moze direktno u json ako je jos uvijek datetime objekt
        # provjerava je li vec string (ako je vec bio konvertiran ranije)
        created_at = comment["created_at"]
        if type(created_at) != str:
            comment["created_at"] = created_at.isoformat()

    return comments


@router.delete("/comments/{comment_id}")
def delete_comment(comment_id: str, user=Depends(get_current_user)):
    if not ObjectId.is_valid(comment_id):
        raise HTTPException(status_code=400, detail="Invalid comment ID")

    comment = db.comments.find_one({"_id": ObjectId(comment_id)})
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    if comment["username"] != user["username"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this comment")

    db.comments.delete_one({"_id": ObjectId(comment_id)})
    return {"message": "Comment deleted"}