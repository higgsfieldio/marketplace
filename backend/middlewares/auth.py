import config

from fastapi import HTTPException, Security, Request
from fastapi.security.api_key import APIKeyHeader
from utils.near import check_if_key_is_available
import ed25519
import hashlib
import base64
import base58

API_KEY = config.FAST_API_KEY
API_KEY_NAME = config.FAST_API_KEY_NAME

api_key_header_auth = APIKeyHeader(name=API_KEY_NAME, auto_error=True)


async def get_api_key(api_key_header: str = Security(api_key_header_auth)):
    if api_key_header != API_KEY:
        raise HTTPException(
            status_code=401,
            detail="Invalid API Key",
        )


async def get_authorize_header_check(req: Request):
    try:
        authorize_header = req.headers["Authorization"]
        authorize_header = base64.b64decode(authorize_header).decode('utf-8').split('&')
        pub_key = ed25519.VerifyingKey(authorize_header[1].encode(),
                                       encoding="hex")

        signature = str(authorize_header[2])
        msg = hashlib.sha256(authorize_header[0].encode()).digest()
        pub_key.verify(signature, msg, encoding='hex')
        ed25519_key = "ed25519:" + base58.b58encode(bytearray.fromhex(authorize_header[1])).decode('utf-8')
        if await check_if_key_is_available(authorize_header[0], ed25519_key):
            return authorize_header[0]
        raise ValueError
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Unauthorised: {e}")


async def get_authorize_header_check_token(token: str):
    try:
        authorize_header = token
        authorize_header = base64.b64decode(authorize_header).decode('utf-8').split('&')
        pub_key = ed25519.VerifyingKey(authorize_header[1].encode(),
                                       encoding="hex")

        signature = str(authorize_header[2])
        msg = hashlib.sha256(authorize_header[0].encode()).digest()
        pub_key.verify(signature, msg, encoding='hex')
        ed25519_key = "ed25519:" + base58.b58encode(bytearray.fromhex(authorize_header[1])).decode('utf-8')
        if await check_if_key_is_available(authorize_header[0], ed25519_key):
            return authorize_header[0]
        raise ValueError
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Unauthorised: {e}")
