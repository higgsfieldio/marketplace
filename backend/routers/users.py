import re
import validators
from fastapi import APIRouter, HTTPException, UploadFile, File, Request, Form, Depends
from fastapi_limiter.depends import RateLimiter
from utils import users as users_additional_funcs
from utils import near as near_additional_funcs
from utils import main as main_additional_funcs
from pymongo import ReturnDocument
import os
from middlewares import auth
import datetime
import config

router = APIRouter(
    prefix=f"{config.root_path}/users",
    tags=["users"],
    responses={404: {"description": "Not found"}}
)


@router.post("/create", dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def creating_user(request: Request):
    user_wallet = await auth.get_authorize_header_check(request)
    if config.db.users.find_one_and_update({"user_wallet": user_wallet}, {"$set": {"was_logged_in": True}}) is not None \
            or not await near_additional_funcs.get_account(user_wallet):
        raise HTTPException(status_code=404, detail='User not found')
    timestamp = str(datetime.datetime.now().timestamp())
    insert_dict = {
        "user_name": None,
        "description": None,
        "user_id": f'id{await users_additional_funcs.get_next_id("users")}',
        "user_wallet": user_wallet,
        "socials": {
            "instagram": None,
            "twitter": None,
            "facebook": None,
            "personal": None
        },
        "avatar_url": None,
        "cover_url": None,
        "items_owned": list(),
        "items_created": await users_additional_funcs.get_created_items(user_wallet),
        "collections": list(),
        "activities": list(),
        "liked": list(),
        "bio": None,
        "customURL": None,
        "email": None,
        "verified": False,
        "was_logged_in": True,
        "date_created": timestamp,
        "recent_change": timestamp,
        "recent_metadata_change": timestamp}
    await main_additional_funcs.check_code_in_request(request, user_wallet, False)
    config.db.users.update_one({"user_wallet": user_wallet}, {"$set": insert_dict}, upsert=True)
    return dict(user_created=True,
                user=await main_additional_funcs.fill_in_user_object(insert_dict))


@router.post("/update_profile", dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def update_profile(request: Request,
                         user_name: str = Form("null"),
                         bio: str = Form("null"),
                         customURL: str = Form("null"),
                         personal: str = Form("null"),
                         email: str = Form("null"),
                         cover: UploadFile = File(None),
                         avatar: UploadFile = File(None),
                         delete_cover: str = Form('false'),
                         delete_avatar: str = Form('false'),
                         ):
    user_wallet = await auth.get_authorize_header_check(request)
    obj = config.db.users.find_one_and_update({"user_wallet": user_wallet}, {"$set": {"was_logged_in": True}})
    if obj is None:
        raise HTTPException(status_code=404, detail='User not found')

    await main_additional_funcs.check_code_in_request(request, user_wallet, obj['was_logged_in'])

    if customURL.lower() == 'no_such_user' or (customURL.lower() != "null"
                                               and config.db.users.find_one({"customURL": customURL}) is not None
                                               and config.db.users.find_one({"customURL": customURL}) != obj):
        raise HTTPException(status_code=400, detail='customURL is already in use')
    if delete_cover == 'true' and cover is not None:
        raise HTTPException(status_code=400, detail='pass only delete_cover to delete it')
    if delete_avatar == 'true' and avatar is not None:
        raise HTTPException(status_code=400, detail='pass only delete_cover to delete it')

    new_data = dict()

    if user_name.lower() != "null" and len(user_name) <= 32 and await main_additional_funcs.check_text_in_black_list(
            user_name):
        new_data["user_name"] = user_name
    elif len(user_name) > 32 or not await main_additional_funcs.check_text_in_black_list(user_name):
        raise HTTPException(status_code=400, detail='Validation user_name failed')

    if bio.lower() != "null" and len(bio) <= 1000 and await main_additional_funcs.check_text_in_black_list(bio):
        new_data["bio"] = bio
    elif len(bio) > 1000 or not await main_additional_funcs.check_text_in_black_list(bio):
        raise HTTPException(status_code=400, detail='Validation bio failed')
    if customURL.lower() != "null" and 3 <= len(customURL) <= 16 \
            and len(re.sub(r'^id[\d\d*][\D*\d*]*', '', customURL)) != 0 \
            and await main_additional_funcs.check_text_in_black_list(customURL) and ' ' not in customURL:
        new_data["customURL"] = customURL
    elif customURL.lower() != "null":
        raise HTTPException(status_code=400, detail='Validation customURL failed')

    if personal.lower() != "null":
        if validators.url(personal):
            new_data["socials.personal"] = personal
        else:
            raise HTTPException(status_code=400, detail="Not valid URL")

    if email.lower() != "null":
        new_data["email"] = email

    if delete_cover == 'true':
        new_data['cover_url'] = None
        if obj['cover_url'] is not None:
            await main_additional_funcs.delete_existing_photos(obj, 'cover_url', 'users')
    if delete_avatar == 'true':
        new_data['avatar_url'] = None
        if obj['avatar_url'] is not None:
            await main_additional_funcs.delete_existing_photos(obj, 'avatar_url', 'users')

    if cover is not None and cover.content_type in ['image/jpg', 'image/jpeg', 'image/gif', 'image/png']:
        if obj['cover_url'] is not None:
            await main_additional_funcs.delete_existing_photos(obj, 'cover_url', 'users')
        new_cover = dict()
        file_read = await cover.read()
        if len(file_read) > 15728640:
            raise HTTPException(status_code=400, detail='Cover is too big')
        with open(f'files/users/cover-{user_wallet}.{cover.filename.split(".")[-1]}', 'wb') as doc:
            doc.write(file_read)
        for size_key in config.cover_sizes.keys():
            new_path = await main_additional_funcs.save_new_images(cover.filename, cover.content_type, user_wallet,
                                                                   config.cover_sizes[size_key], 'cover', 'users')
            new_cover[size_key] = new_path
        os.remove(f'files/users/cover-{user_wallet}.{cover.filename.split(".")[-1]}')
        new_data['cover_url'] = new_cover
    elif cover is not None:
        raise HTTPException(status_code=400, detail='Only content-type image are available')

    if avatar is not None and avatar.content_type in ['image/jpg', 'image/jpeg', 'image/gif', 'image/png']:
        if obj['avatar_url'] is not None:
            await main_additional_funcs.delete_existing_photos(obj, 'avatar_url', 'users')

        new_avatar = dict()
        file_read = await avatar.read()
        if len(file_read) > 15728640:
            raise HTTPException(status_code=400, detail='Avatar is too big')
        with open(f'files/users/avatar-{user_wallet}.{avatar.filename.split(".")[-1]}', 'wb') as doc:
            doc.write(file_read)
        for size_key in config.avatar_sizes.keys():
            new_path = await main_additional_funcs.save_new_images(avatar.filename, avatar.content_type, user_wallet,
                                                                   config.avatar_sizes[size_key], 'avatar', 'users')
            new_avatar[size_key] = new_path
        os.remove(f'files/users/avatar-{user_wallet}.{avatar.filename.split(".")[-1]}')
        new_data['avatar_url'] = new_avatar
    elif avatar is not None:
        raise HTTPException(status_code=400, detail='Only content-type image are available')
    new_data['recent_change'] = str(datetime.datetime.now().timestamp())
    obj = config.db.users.find_one_and_update({"user_wallet": user_wallet},
                                              {"$set": new_data},
                                              return_document=ReturnDocument.AFTER)
    return await main_additional_funcs.fill_in_user_object(obj)


@router.get("/get_profile/{user_custom_url_or_id}",
            dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def check(user_custom_url_or_id):
    for key in ["customURL", "user_id"]:
        obj = config.db.users.find_one({key: user_custom_url_or_id})
        if obj is not None:
            return await main_additional_funcs.fill_in_user_object(obj)

    raise HTTPException(status_code=404, detail='User not found')


@router.get("/get_profile_by_wallet/{user_wallet}",
            dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def check(user_wallet):
    obj = config.db.users.find_one({"user_wallet": user_wallet})
    if obj is not None:
        return await main_additional_funcs.fill_in_user_object(obj)

    raise HTTPException(status_code=404, detail='User not found')


@router.get("/metadata/{obj}",
            dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def get_metadata(obj):
    if len(re.sub(r'^id[\d\d*][\D*\d*]*', '', obj)) == 0:
        obj = config.db.users.find_one({"user_id": obj})
    else:
        obj = config.db.users.find_one({"customURL": obj})
    if obj is not None:
        user_id = obj['user_id']
        avatar_url = None
        if obj['customURL'] is not None:
            user_id = obj['customURL']
        if obj['avatar_url'] is not None:
            avatar_url = config.server_link + '/users/get_file/' + obj['avatar_url']["size3"]
        return dict(name=user_id, image=avatar_url)

    raise HTTPException(status_code=404, detail='Object not found')


@router.get("/check_custom_url/{custom_url}", dependencies=[Depends(RateLimiter(times=config.max_req,
                                                                                seconds=config.timeout_req))])
async def check_custom_url_availability(custom_url):
    if config.db.users.find_one({"customURL": custom_url}) is None:
        return dict(available=True)
    raise HTTPException(status_code=400, detail='User_name is already in use')


@router.get("/get_logged_user", dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def get_logged_user(request: Request):
    user_wallet = await auth.get_authorize_header_check(request)
    obj = config.db.users.find_one_and_update({"user_wallet": user_wallet}, {"$set": {"was_logged_in": True}})
    if obj is not None:
        await main_additional_funcs.check_code_in_request(request, user_wallet, obj['was_logged_in'])
        user = await main_additional_funcs.fill_in_user_object(obj)
        notifications = list(
            config.db.notifications.aggregate(
                [
                    {
                        "$match": {"user_id": obj['_id']}
                    },
                    {
                        "$sort": {
                            "viewed": 1,
                            "timestamp": -1
                        }
                    },
                    {
                        "$limit": 110
                    },
                    {
                        "$lookup": {
                            "from": 'users',
                            "localField": 'buyer_id',
                            "foreignField": '_id',
                            "as": 'buyer'
                        }
                    },
                    {
                        "$lookup": {
                            "from": 'referral_levels',
                            "localField": 'new_level',
                            "foreignField": 'level',
                            "as": 'level'
                        }
                    }
                ]
            )
        )
        [print(elem['_id']) for elem in notifications]
        for elem in notifications:
            if len(elem['buyer']) == 1:
                elem['buyer'] = await main_additional_funcs.get_small_user_object(elem['buyer'][0])
            else:
                del elem['buyer']

            if len(elem['level']) == 1:
                elem['level_name'] = elem['level'][0]['name']
            else:
                del elem['level']
            elem['timestamp'] = str(elem['timestamp'].timestamp())
        user['notifications'] = notifications

        user['notifications_not_viewed'] = sum(1 for item in user['notifications'] if not item['viewed'])
        return await main_additional_funcs.delete_object_ids_from_dict(user)
    raise HTTPException(status_code=404, detail='User not found')


@router.on_event('startup')
async def startup():
    config.db.notifications.create_index([('viewed', 1), ('timestamp', -1)])
