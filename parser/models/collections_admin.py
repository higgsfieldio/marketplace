from pydantic import BaseModel
from fastapi import Form
from typing import List


class MissedTokens(BaseModel):
    token_id: str


class CollectionInsertMissedTokens(BaseModel):
    collection_id: str = Form(..., min_length=24, max_length=24)
    tokens: List[MissedTokens]
