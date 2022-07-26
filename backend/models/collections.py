from pydantic import BaseModel
from fastapi import Form
from typing import List, Optional, Literal


class Tokens(BaseModel):
    token_id: str = Form(..., min_length=24, max_length=24)


class CollectionAddItems(BaseModel):
    collection_id: str = Form(..., min_length=24, max_length=24)
    tokens: List[Tokens]


class CollectionGetItems(BaseModel):
    collection_id: str = Form(..., min_length=24, max_length=24)
    name: Optional[Literal['art', 'collectables', 'games', 'metaverses']] = None
    next_id: str = Form(None, min_length=24, max_length=24)
    next_rank: Optional[int] = None
    next_price: Optional[str] = None
    limit: Optional[int] = 3
    is_only_on_sale: Optional[bool] = False
    price_less: Optional[str] = None
    price_more: Optional[str] = None
    sort_type: Optional[Literal['price', 'rank']] = 'price'
    sort_order: Optional[Literal[-1, 1]] = -1
