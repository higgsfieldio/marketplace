from pydantic import BaseModel
from typing import Optional, Literal
from fastapi import Form


class Search(BaseModel):
    text: str
    from_index: Optional[int] = 0
    limit: Optional[int] = 3


class SearchStatistics(BaseModel):
    from_index: Optional[int] = 0
    limit: Optional[int] = 3
    range: Optional[Literal['hours_24', 'days_7', 'days_30']] = 'hours_24'
    sort_name: Optional[Literal['volume', 'average_price', 'floor_price', 'market_cap_average', 'volume_percent']] \
        = 'volume'
    sort_order: Optional[Literal[-1, 1]] = -1


class SearchExploreCollections(BaseModel):
    next_id: str = Form(None, min_length=24, max_length=24)
    volume_next: int = Form(None)
    name: str
    limit: Optional[int] = 3
    days: int


class SearchCategory(BaseModel):
    name: str
    next_id: str = Form(None, min_length=24, max_length=24)
    limit: Optional[int] = 3
    is_only_on_sale: bool

