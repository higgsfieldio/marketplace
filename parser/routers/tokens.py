import asyncio

from fastapi import APIRouter
from utils import main as main_additional_funcs
from utils import near as near_additional_funcs
from models import tokens as tokens_models
from pymongo import ReturnDocument
import datetime
from middlewares import auth
import config
from bson import ObjectId


router = APIRouter(
    prefix=f"{config.root_path}/tokens",
    tags=["tokens"],
    responses={404: {"description": "Not found"}}
)


@router.patch("/refresh_metadata", dependencies=[auth.Security(auth.get_api_key)])
async def refresh_metadata(data: tokens_models.TokenRefreshMetadata):
    user = data.user
    update_queries = await near_additional_funcs.get_items(user['user_wallet'], asyncio.Semaphore(3))
    await main_additional_funcs.update_queries_in_db_after_refresh(
        update_queries,
        user['user_wallet'],
        [ObjectId(token["token_id"]) for token in user['items_owned']]
    )
    user = config.db.users.find_one_and_update({"user_wallet": user['user_wallet']},
                                               {"$set": {"recent_metadata_change":
                                                         str(datetime.datetime.now().timestamp())}},
                                               return_document=ReturnDocument.AFTER)
    return await main_additional_funcs.fill_in_user_object(user)
