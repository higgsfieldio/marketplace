from pydantic import BaseModel, validator
from validate_email import validate_email


class MemberEmail(BaseModel):
    email_address: str

    @validator('email_address', allow_reuse=True)
    def check_email_omitted(cls, value):
        if not validate_email(value):
            raise ValueError('email_address validation failed')
        return value
