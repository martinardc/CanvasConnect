from fastapi import APIRouter, HTTPException
from database import db, pwd_context
from models import UserRegister, UserLogin
from auth import create_token

router = APIRouter()

@router.post("/register")
def register(user: UserRegister):
    if db.users.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already exists")

    email = user.email.lower()
    if db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password)
    db.users.insert_one({
        "name": user.name,
        "email": user.email,
        "username": user.username,
        "password": hashed_password,
        "profile_completed": False
    })
    return {"message": "User created successfully"}

@router.post("/login")
def login(user: UserLogin):
    query = {"username": user.username} if user.username else {"email": user.email}
    existing_user = db.users.find_one(query)
    if not existing_user or not pwd_context.verify(user.password, existing_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_token(existing_user)
    return {"token": token}
