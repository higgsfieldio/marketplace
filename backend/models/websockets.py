from pydantic import BaseModel, root_validator
from fastapi import Form
from typing import Optional


class Token(BaseModel):
    token_id: str = Form(..., min_length=24, max_length=24)
    preview_url: str
    name: Optional[str] = None


class Comment(BaseModel):
    token_id: str = Form(..., min_length=24, max_length=24)
    comment_id: str = Form(..., min_length=24, max_length=24)
    user_id: str
    text: str
    user_name: Optional[str] = None
    verified: bool
    avatar_url: Optional[str] = None
    timestamp: str
