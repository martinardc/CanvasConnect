from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timezone
from database import db
from auth import get_current_user
from models import Purchase
from bson.objectid import ObjectId

router = APIRouter()

@router.post("/works/{work_id}/buy")
def buy_work(work_id: str, user=Depends(get_current_user)):
    # provjeri postoji li rad
    if not ObjectId.is_valid(work_id):
        raise HTTPException(status_code=400, detail="Invalid work ID")

    work = db.works.find_one({"_id": ObjectId(work_id)})
    if not work:
        raise HTTPException(status_code=404, detail="Work not found")

    # sprijeci da netko kupi vlastiti rad
    if work["username"] == user["username"]:
        raise HTTPException(status_code=400, detail="You can't buy your own work")

    # sprijeci duplu kupnju
    existing = db.purchases.find_one({
        "work_id": work_id,
        "buyer_username": user["username"]
    })
    if existing:
        raise HTTPException(status_code=400, detail="Already purchased")

    # upisi kupnju
    purchase = {
        "work_id": work_id,
        "buyer_username": user["username"],
        "price": work.get("price", 0),
        "purchased_at": datetime.now(timezone.utc)
    }
    db.purchases.insert_one(purchase)

    return {"message": "Purchase successful"}


@router.get("/my-purchases")
def get_my_purchases(user=Depends(get_current_user)):
    purchases = list(db.purchases.find({"buyer_username": user["username"]}))

    work_ids = [ObjectId(p["work_id"]) for p in purchases if ObjectId.is_valid(p["work_id"])]
    works = list(db.works.find({"_id": {"$in": work_ids}}))
    for w in works:
        w["_id"] = str(w["_id"])

    return {"purchased_works": works}



    

    