from datetime import datetime
from pydantic import BaseModel
from typing import Optional

# Auth
class UserCreate(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Features
class FeatureCreate(BaseModel):
    title: str
    description: str

class FeatureOut(BaseModel):
    id: int
    title: str
    description: str
    user_id: int
    created_at: datetime
    vote_count: int
    voted: bool = False

    class Config:
        from_attributes = True

# Votes
class VoteCreate(BaseModel):
    feature_id: int

class VoteOut(BaseModel):
    feature_id: int
    user_id: int

    class Config:
        from_attributes = True
