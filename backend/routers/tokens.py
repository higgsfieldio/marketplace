from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi_limiter.depends import RateLimiter
from models import tokens as tokens_models
from utils import main as main_additional_funcs
from pymongo import ReturnDocument
from bson import ObjectId
import datetime
import aiohttp

from middlewares import auth
import config


router = APIRouter(
    prefix=f"{config.root_path}/tokens",
    tags=["tokens"],
    responses={404: {"description": "Not found"}}
)


@router.patch("/toggle_like", dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def toggle_like(request: Request, token: tokens_models.TokenToggleLike):
    user_wallet = await auth.get_authorize_header_check(request)
    user = config.db.users.find_one_and_update({"user_wallet": user_wallet}, {"$set": {"was_logged_in": True}})
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')

    await main_additional_funcs.check_code_in_request(request, user_wallet, user['was_logged_in'])

    if dict(token_id=ObjectId(token.token_id)) in user['liked']:
        user = config.db.users.find_one_and_update({"user_wallet": user_wallet},
                                                   {"$pull": {
                                                        "liked": {"token_id": ObjectId(token.token_id)}
                                                    }},
                                                   return_document=ReturnDocument.AFTER)
        token = config.db.tokens.find_one_and_update({"_id": ObjectId(token.token_id)},
                                                     {"$pull": {
                                                          "likes": {"user_id": user["_id"]}
                                                      }},
                                                     return_document=ReturnDocument.AFTER)

    else:
        user = config.db.users.find_one_and_update({"user_wallet": user_wallet},
                                                   {"$push": {
                                                      "liked": {"token_id": ObjectId(token.token_id)}
                                                   }},
                                                   return_document=ReturnDocument.AFTER)
        token = config.db.tokens.find_one_and_update({"_id": ObjectId(token.token_id)},
                                                     {"$push": {
                                                         "likes": {"user_id": user["_id"]}
                                                     }},
                                                     return_document=ReturnDocument.AFTER)
    return dict(token=await main_additional_funcs.fill_in_single_token_object(token),
                liked=await main_additional_funcs.delete_object_ids_from_list(user['liked']))


@router.patch("/refresh_metadata", dependencies=[Depends(RateLimiter(times=config.max_req,
                                                                     seconds=config.timeout_req))])
async def refresh_metadata(request: Request):
    user_wallet = await auth.get_authorize_header_check(request)
    user = config.db.users.find_one_and_update({"user_wallet": user_wallet}, {"$set": {"was_logged_in": True}})
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')

    await main_additional_funcs.check_code_in_request(request, user_wallet, user['was_logged_in'])

    recent_metadata_change = user['recent_metadata_change']
    date_created = user['date_created']
    if recent_metadata_change == date_created or datetime.datetime.fromtimestamp(float(recent_metadata_change)) \
            + datetime.timedelta(minutes=10) < datetime.datetime.now():
        config.db.users.update_one({"user_wallet": user_wallet},
                                   {"$set": {"recent_metadata_change":
                                             str(datetime.datetime.now().timestamp())}})
        params = {
            "user": await main_additional_funcs.delete_object_ids_from_dict(user)
        }
        async with aiohttp.ClientSession() as client:
            async with client.patch(config.parser_link + '/tokens/refresh_metadata',
                                    headers={config.FAST_API_KEY_NAME: config.FAST_API_KEY},
                                    json=params) as resp:
                if resp.status == 200:
                    return await resp.json()
    raise HTTPException(status_code=400, detail='Data is fresh already')


@router.get("/get/{token_id}", dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def get_token(request: Request, token_id):
    if not ObjectId.is_valid(token_id):
        raise HTTPException(status_code=400, detail='Not valid ObjectId')
    token = config.db.tokens.find_one_and_update({"_id": ObjectId(token_id)},
                                                 {'$inc': {'views': 1}},
                                                 return_document=ReturnDocument.AFTER)
    if token is not None:
        return await main_additional_funcs.get_token_for_market_page(token, request.headers)
    raise HTTPException(status_code=404, detail='Token not found')


@router.get("/metadata/{obj}",
            dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def get_metadata(obj):
    if not ObjectId.is_valid(obj):
        raise HTTPException(status_code=400, detail="Not valid ObjectId")
    obj = config.db.tokens.find_one({"_id": ObjectId(obj)})
    if obj is not None:
        avatar_url = None
        if obj['preview'] is not None:
            avatar_url = config.server_link + '/tokens/get_file/' + obj['preview']["size0"]
        return dict(name=obj['name'], image=avatar_url)

    raise HTTPException(status_code=404, detail='Object not found')


@router.post('/comment', dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def comment_token(request: Request, comment: tokens_models.TokenComment):
    user_wallet = await auth.get_authorize_header_check(request)
    user = config.db.users.find_one_and_update({"user_wallet": user_wallet}, {"$set": {"was_logged_in": True}})
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')

    await main_additional_funcs.check_code_in_request(request, user_wallet, user['was_logged_in'])

    comment_id = ObjectId()
    date_obj = datetime.datetime.now()
    comment_obj = {"comment_id": comment_id,
                   "user_id": ObjectId(user["_id"]),
                   "text": comment.text,
                   "timestamp":
                   str(date_obj.timestamp())}
    token = config.db.tokens.find_one_and_update({"_id": ObjectId(comment.token_id)},
                                                 {"$push": {"comments": comment_obj}},
                                                 return_document=ReturnDocument.AFTER)

    if token is not None:
        name = token["name"]
        comment_obj['token_id'] = token['_id']
        user_ = await main_additional_funcs.get_small_user_object(user)
        comment_obj['avatar_url'] = user_['avatar_url']
        comment_obj['verified'] = user_['verified']
        comment_obj['user_name'] = user_['user_name']
        comment_obj['user_id'] = user_['user_id']
        comment_obj = await main_additional_funcs.delete_object_ids_from_dict(comment_obj)
        async with aiohttp.ClientSession() as client:
            headers = {config.FAST_API_KEY_NAME: config.FAST_API_KEY}
            await client.post(config.server_link + '/ws/push_comment', json=comment_obj, headers=headers)
            token_owner = config.db.users.find_one({"user_wallet": token['owner_id']})
            if token_owner is not None and {"token_id": token["_id"]} not in user['items_owned']:
                notification_obj = {
                    "viewed": False,
                    "user_id": token_owner['_id'],
                    "type": "new_comment",
                    "text": comment.text[:30],
                    "comment_id": comment_id,
                    "timestamp":
                        date_obj,
                    "token": {
                        "token_id": token["_id"],
                        "preview_url": token['preview']['size0'],
                        "name": name
                    }
                }
                config.db.notifications.insert_one(notification_obj)
                notification_obj['timestamp'] = str(date_obj.timestamp())
                await client.post(config.server_link + '/ws/push_notification',
                                  json=await main_additional_funcs.delete_object_ids_from_dict(notification_obj),
                                  headers=headers)
        return await main_additional_funcs.get_token_for_market_page(token, request.headers)
    raise HTTPException(status_code=404, detail='Token not found')
