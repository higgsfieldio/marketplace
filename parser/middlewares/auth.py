import config

from fastapi import HTTPException, Security
from fastapi.security.api_key import APIKeyHeader


API_KEY = config.FAST_API_KEY
API_KEY_NAME = config.FAST_API_KEY_NAME

api_key_header_auth = APIKeyHeader(name=API_KEY_NAME, auto_error=True)


async def get_api_key(api_key_header: str = Security(api_key_header_auth)):
    if api_key_header != API_KEY:
        raise HTTPException(
            status_code=401,
            detail="Invalid API Key",
        )
