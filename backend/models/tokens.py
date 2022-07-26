from pydantic import BaseModel, validator
from typing import Optional, List
from fastapi import Form


class TokenMetadata(BaseModel):
    title: Optional[str]
    description: Optional[str]
    media: Optional[str]
    media_hash: Optional[str]
    copies: Optional[int]
    issued_at: Optional[str]
    expires_at: Optional[str]
    starts_at: Optional[str]
    updated_at: Optional[str]
    extra: Optional[str]
    reference: Optional[str]
    reference_hash: Optional[str]


class Token(BaseModel):
    token_id: str
    owner_id: str
    metadata: TokenMetadata
    approved_account_ids: dict
    royalty: Optional[dict]


class TokenToggleLike(BaseModel):
    token_id: str = Form(..., min_length=24, max_length=24)


class TokenComment(BaseModel):
    token_id: str = Form(..., min_length=24, max_length=24)
    text: str


class AttributesWithRarity(BaseModel):
    rarity: str

    @validator('rarity', allow_reuse=True)
    def check_rarity_is_str(cls, value):
        if value is None:
            raise ValueError(f"Field 'rarity' must not be None")


class CheckTokenAttributesRarity(BaseModel):
    attributes: List[AttributesWithRarity]

    @validator('attributes', allow_reuse=True)
    def check_attributes_is_not_none(cls, value):
        if value is None:
            raise ValueError(f"Field 'attributes' must not be None")


class AttributesWithOutRarity(BaseModel):
    rarity: Optional[str] = None

    @validator('rarity', allow_reuse=True)
    def check_rarity_is_none(cls, value):
        if value is not None:
            raise ValueError(f"Field 'rarity' must be None")


class CheckTokenAttributesWithOutRarity(BaseModel):
    attributes: List[AttributesWithOutRarity]

    @validator('attributes', allow_reuse=True)
    def check_attributes_is_not_none(cls, value):
        if value is None:
            raise ValueError(f"Field 'attributes' must not be None")


class TokensWithRarity(BaseModel):
    tokens: List[CheckTokenAttributesRarity]


class TokensWithoutRarity(BaseModel):
    tokens: List[CheckTokenAttributesWithOutRarity]

