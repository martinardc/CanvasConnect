from pydantic import BaseModel,  EmailStr, Field
from typing import Optional
from datetime import date, datetime, timezone


class UserRegister(BaseModel):
    name: str
    email: str
    username: str
    password: str
    profile_completed: bool = False

class UserLogin(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    password: str

class EditProfile(BaseModel):      
    display_name: Optional[str] = None          
    profile_picture: Optional[str] = None  
    bio: Optional[str] = None              
    birthday: Optional[date] = None        
    location: Optional[str] = None    
    link: Optional[str] = None  

class ChangePassword(BaseModel):
    old_password: str
    new_password: str   

class PublicUser(BaseModel):
    username: str
    display_name: str | None = None
    profile_picture: str | None = None
    bio: str | None = None
    link: str | None = None

class UploadWorks(BaseModel):
    title: str
    category: list[str]
    description: Optional[str] = None
    price: Optional[float] = None

class Like(BaseModel):
    work_id: str
    username: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Comment(BaseModel):
    work_id: str
    username: str
    text: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Gallery(BaseModel):
    title: str
    description: Optional[str] = None
    work_ids: list[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Competition(BaseModel):
    title: str
    theme: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime
    
class CompetitionEntry(BaseModel):
    competition_id: str
    work_id: str
    username: str
    status: str = "pending"  # pending / approved / rejected
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Purchase(BaseModel):
    work_id: str
    buyer_username: str
    price: float
    purchased_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))