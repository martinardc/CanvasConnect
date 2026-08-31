import jwt
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer
from datetime import datetime, timedelta, timezone
from config import JWT_SECRET

security = HTTPBearer()
security_optional = HTTPBearer(auto_error=False)
ADMIN_USERNAMES = ["admin"]


def create_token(user: dict):
    payload = {
        "username": user["username"],
        "email": user.get("email", ""),
        "exp": datetime.now(timezone.utc) + timedelta(hours=1)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def get_current_user(credentials=Depends(security)):
    token = credentials.credentials
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_optional_user(credentials=Depends(security_optional)):
    if credentials is None:
        return None
    try:
        return jwt.decode(credentials.credentials, JWT_SECRET, algorithms=["HS256"])
    except jwt.PyJWTError:
        return None

def require_admin(user=Depends(get_current_user)):
    if user["username"] not in ADMIN_USERNAMES:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user
