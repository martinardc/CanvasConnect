from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timezone
from database import db
from auth import get_current_user
from models import Like

router = APIRouter()


@router.post("/works/{work_id}/like")
async def toggle_like(work_id: str, user=Depends(get_current_user)):
    existing = db.likes.find_one({
        "work_id": work_id,
        "username": user["username"]
    })

    if existing:
        db.likes.delete_one({"_id": existing["_id"]})
        return {"liked": False}
    else:
        db.likes.insert_one({
            "work_id": work_id,
            "username": user["username"],
        })        
        return {"liked": True}