from fastapi import APIRouter, Query
from database import db
import re

router = APIRouter()

import re

@router.get("/search")
def search(q: str = Query(..., min_length=1)):
    q = q.strip()

    if not q:
        return {"users": [], "works": []}

    escaped_q = re.escape(q)

    regex = {
        "$regex": f"^{escaped_q}",
        "$options": "i"
    }

    users = list(
        db.users.find(
            {
                "$or": [
                    {"username": regex},
                    {"display_name": regex}
                ]
            },
            {"password": 0}
        ).limit(5)
    )

    works = list(
        db.works.find(
            {"title": regex}
        ).limit(5)
    )

    for user in users:
        user["_id"] = str(user["_id"])

    for work in works:
        work["_id"] = str(work["_id"])

    return {
        "users": users,
        "works": works
    }
