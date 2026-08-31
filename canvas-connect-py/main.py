from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes import users, profile, uploads, likes, comments, search, gallery, competition, purchases 
from database import db


app = FastAPI()

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(profile.router)
app.include_router(uploads.router)
app.include_router(likes.router)
app.include_router(comments.router)
app.include_router(search.router)
app.include_router(gallery.router)
app.include_router(competition.router)
app.include_router(purchases.router)