from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timezone
from database import db
from auth import get_current_user, require_admin
from models import Competition, CompetitionEntry
from bson.objectid import ObjectId

router = APIRouter()

@router.get("/competitions")
def get_competitions():
    comps = list(db.competitions.find())
    for c in comps:
        c["_id"] = str(c["_id"])
    return {"competitions": comps}

@router.post("/competitions")
def create_competition(competition: Competition, admin=Depends(require_admin)):
    comp_data = competition.model_dump()
    result = db.competitions.insert_one(comp_data)
    comp_data["_id"] = str(result.inserted_id)
    return {"message": "Competition created", "competition": comp_data}

@router.get("/competitions/{competition_id}")
def get_competition(competition_id: str):
    if not ObjectId.is_valid(competition_id):
        raise HTTPException(status_code=400, detail="Invalid competition ID")

    comp = db.competitions.find_one({"_id": ObjectId(competition_id)})
    if not comp:
        raise HTTPException(status_code=404, detail="Competition not found")
    comp["_id"] = str(comp["_id"])

    entries = list(db.competition_entries.find({
        "competition_id": competition_id,
        "status": "approved"
    }))
    work_ids = [ObjectId(e["work_id"]) for e in entries if ObjectId.is_valid(e["work_id"])]

    works = list(db.works.find({"_id": {"$in": work_ids}}))
    for w in works:
        w["_id"] = str(w["_id"])

    comp["entries"] = works
    return comp

@router.post("/competitions/{competition_id}/enter")
def enter_competition(competition_id: str, work_id: str, user=Depends(get_current_user)):
    comp = db.competitions.find_one({"_id": ObjectId(competition_id)})
    if not comp:
        raise HTTPException(status_code=404, detail="Competition not found")

    now = datetime.now(timezone.utc).replace(tzinfo=None)
    if now < comp["start_date"] or now > comp["end_date"]:
        raise HTTPException(status_code=400, detail="Competition is not currently open")

    existing = db.competition_entries.find_one({
        "competition_id": competition_id,
        "work_id": work_id,
        "username": user["username"]
    })
    if existing:
        raise HTTPException(status_code=400, detail="Already entered this work")

    db.competition_entries.insert_one({
        "competition_id": competition_id,
        "work_id": work_id,
        "username": user["username"],
        "status": "pending",
        "submitted_at": now
    })
    return {"message": "Entry submitted, pending approval"}

@router.get("/competitions/{competition_id}/pending-entries")
def get_pending_entries(competition_id: str, admin=Depends(require_admin)):
    entries = list(db.competition_entries.find({
        "competition_id": competition_id,
        "status": "pending"
    }))

    work_ids = [ObjectId(e["work_id"]) for e in entries if ObjectId.is_valid(e["work_id"])]
    works = {str(w["_id"]): w for w in db.works.find({"_id": {"$in": work_ids}})}

    valid_entries = []
    for e in entries:
        work = works.get(e["work_id"])
        if not work:
            continue  # rad je obrisan, preskoči ovaj zapis

        e["_id"] = str(e["_id"])
        work["_id"] = str(work["_id"])
        e["work"] = work
        valid_entries.append(e)

    return {"entries": valid_entries}

@router.post("/competitions/entries/{entry_id}/approve")
def approve_entry(entry_id: str, admin=Depends(require_admin)):
    result = db.competition_entries.update_one(
        {"_id": ObjectId(entry_id)},
        {"$set": {"status": "approved"}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Entry not found")
    return {"message": "Entry approved"}

@router.post("/competitions/entries/{entry_id}/reject")
def reject_entry(entry_id: str, admin=Depends(require_admin)):
    result = db.competition_entries.update_one(
        {"_id": ObjectId(entry_id)},
        {"$set": {"status": "rejected"}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Entry not found")
    return {"message": "Entry rejected"}

@router.get("/competitions/{competition_id}/my-entries")
def get_my_entries(competition_id: str, user=Depends(get_current_user)):
    entries = list(db.competition_entries.find({
        "competition_id": competition_id,
        "username": user["username"]
    }))

    work_ids = [ObjectId(e["work_id"]) for e in entries if ObjectId.is_valid(e["work_id"])]
    existing_work_ids = {str(w["_id"]) for w in db.works.find({"_id": {"$in": work_ids}}, {"_id": 1})}

    valid_entries = []
    for e in entries:
        if e["work_id"] not in existing_work_ids:
            continue  # rad je obrisan, preskoci

        e["_id"] = str(e["_id"])
        valid_entries.append(e)

    return {"entries": valid_entries}