from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from auth import get_current_user
from models import EditProfile, ChangePassword, PublicUser
from database import db, pwd_context
import os
from uuid import uuid4
import shutil


router = APIRouter()

UPLOAD_DIR = "uploads/profile_pics"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/profile")
def profile(user=Depends(get_current_user)):
    return {"message": f"Hello {user['username']}, welcome to your profile"}

@router.get("/username")
def get_username(user=Depends(get_current_user)):
    return user




@router.get("/settings/edit-profile", response_model=EditProfile)
def get_profile(user=Depends(get_current_user)):
    query = {"username": user["username"]}
    user_data = db.users.find_one(query, {"_id": 0, "password": 0})
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return EditProfile(
        display_name=user_data.get("display_name"),
        bio=user_data.get("bio"),
        birthday=user_data.get("birthday"),
        link=user_data.get("link"),
        profile_picture=user_data.get("profile_picture"),
        location=user_data.get("location"),
    )


@router.put("/settings/edit-profile")
async def edit_profile(
    display_name: str = Form(None),
    bio: str = Form(None),
    birthday: str = Form(None),
    link: str = Form(None),
    file: UploadFile = File(None),
    user=Depends(get_current_user)
):
    query = {"username": user["username"]}
    update_data = {}

    if display_name is not None:
        update_data["display_name"] = display_name
    if bio is not None:
        update_data["bio"] = bio
    if birthday:
        update_data["birthday"] = birthday
    if link is not None:
        update_data["link"] = link
    if file:
        # create unique filename
        filename = f"{uuid4()}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        # save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # save relative URL
        update_data["profile_picture"] = f"/uploads/profile_pics/{filename}"

    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    db.users.update_one(query, {"$set": update_data})
    updated_user = db.users.find_one(query, {"_id": 0, "password": 0})
    return {"msg": "Profile updated", "user": updated_user}



@router.put("/settings/password")
def change_password(data: ChangePassword, user=Depends(get_current_user)):
    username = user["username"]
    account = db.users.find_one({"username": username})
    print("username from token:", username)
    print("account:", account)
    print("old_password:", data.old_password)

    if not account:
        raise HTTPException(status_code=404, detail="User not found")

    if not pwd_context.verify(data.old_password, account["password"]):
        raise HTTPException(status_code=400, detail="Old password is incorrect")

    new_hashed = pwd_context.hash(data.new_password)
    db.users.update_one({"username": username}, {"$set": {"password": new_hashed}})
    
    return {"message": "Password updated successfully"}


@router.get("/users/{username}", response_model=PublicUser)
def get_user_profile(username: str):
    user = db.users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "username": user["username"],
        "display_name": user.get("display_name"),
        "profile_picture": user.get("profile_picture"),
        "bio": user.get("bio"),
        "link": user.get("link"),
    }