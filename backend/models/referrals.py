from pydantic import BaseModel, validator
from fastapi import Form


class CreateLink(BaseModel):
    name: str = Form(..., min_length=2, max_length=7)
    tag_1: str = Form(None, max_length=7)
    tag_2: str = Form(None, max_length=7)
    customName: str = Form(None, min_length=5, max_length=7)

    @validator('customName')
    def check_custom_name_omitted(cls, value):
        if value is None or value.isalpha():
            return value
        raise ValueError('customName can contain only A-Z, a-z')