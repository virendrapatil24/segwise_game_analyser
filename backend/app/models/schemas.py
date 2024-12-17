from datetime import date
from typing import List, Optional

from pydantic import BaseModel


class UserCreate(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
