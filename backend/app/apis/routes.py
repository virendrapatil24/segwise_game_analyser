from fastapi import APIRouter, Depends, HTTPException, status

api_router = APIRouter()

from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from models.db import User, get_db
from models.schemas import Token, UserCreate
from sqlalchemy.orm import Session
from utils.auth import (
    authenticate_user,
    create_access_token,
    hash_password,
    verify_password,
)
from utils.config import settings
from utils.csv_utils import download_and_save_csv, query_data

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


@api_router.post("/register/")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == user.username).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )

    hashed_password = hash_password(user.password)
    new_user = User(username=user.username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}


@api_router.post("/login/", response_model=Token)
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@api_router.post("/upload_csv/")
async def upload_csv(
    file_url: str, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    user = authenticate_user(token, db)
    if not user:
        raise HTTPException(status_code=403, detail="Invalid authentication token")

    try:
        download_and_save_csv(file_url, db)
        return {"message": "CSV uploaded successfully!"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@api_router.get("/query/")
async def query_data_endpoint(
    parameter: str = None,
    value: str = None,
    operator: str = None,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    user = authenticate_user(token, db)
    if not authenticate_user(user):
        raise HTTPException(status_code=403, detail="Invalid authentication token")

    data = query_data(parameter=parameter, value=value, operator=operator, db=db)
    return {"results": data}
