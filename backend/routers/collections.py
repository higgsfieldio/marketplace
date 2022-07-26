from fastapi import APIRouter, Request, HTTPException, Form, UploadFile, File, Depends
from fastapi_limiter.depends import RateLimiter
from models import collections as collections_models
from utils import main as main_additional_funcs
from utils import statistics as statistics_additional_funcs
from pymongo import ReturnDocument
import datetime
import os
from bson import ObjectId  # , Decimal128
import re

from middlewares import auth
import config

router = APIRouter(
    prefix=f"{config.root_path}/collections",
    tags=["collections"],
    responses={404: {"description": "Not found"}}
)


@router.post("/create", dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def create_collection(request: Request,
                            name: str = Form(...),
                            bio: str = Form(...),
                            explicitContent: str = Form("false"),
                            cover: UploadFile = File(...),
                            avatar: UploadFile = File(...),
                            category_name: str = Form("art"),
                            customURL: str = Form('null')
                            ):
    user_wallet = await auth.get_authorize_header_check(request)
    obj = config.db.users.find_one_and_update({"user_wallet": user_wallet}, {"$set": {"was_logged_in": True}})

    if customURL.lower() == 'no_such_user' or (customURL.lower() != "null"
                                               and config.db.collections.find_one({"customURL": customURL}) is not None
    ):
        raise HTTPException(status_code=400, detail='customURL is already in use')
    elif customURL.lower() == "null":
        customURL = None
    if obj is None:
        raise HTTPException(status_code=404, detail='User not found')

    await main_additional_funcs.check_code_in_request(request, user_wallet, obj['was_logged_in'])

    if category_name.lower() not in config.available_categories:
        raise HTTPException(status_code=400, detail="category_name not in available_categories")
    if explicitContent not in ['true', 'false']:
        raise HTTPException(status_code=404, detail='explicitContent can be only true or false')

    if len(name) > 20 or len(bio) > 350 \
            or not await main_additional_funcs.check_text_in_black_list(name) \
            or not await main_additional_funcs.check_text_in_black_list(bio):
        raise HTTPException(status_code=400, detail='Validation name or bio failed')

    if customURL is not None and (not 3 <= len(customURL) <= 16
                                        or not await main_additional_funcs.check_text_in_black_list(customURL)
                                        or len(re.sub(r'^id[\d\d*][\D*\d*]*', '', customURL)) == 0
                                        or ' ' in customURL):
        raise HTTPException(status_code=400, detail='Validation customURL failed')

    category_id = config.db.categories.find_one({"name": category_name.lower()})['_id']

    data = dict()

    data["explicitContent"] = bool(explicitContent == 'true')

    data["name"] = name

    data['items'] = list()

    data['customURL'] = customURL

    data['socials'] = {
        "instagram": None,
        "twitter": None,
        "facebook": None,
        "personal": None
    }

    data['category_id'] = category_id

    if config.db.collections.find_one({"name": name,
                                       "creator_id": obj["_id"]}) is not None:
        raise HTTPException(status_code=400, detail='Such collection name is already in use by the current user')

    data["bio"] = bio

    if cover.content_type in ['image/jpg', 'image/jpeg', 'image/gif', 'image/png']:
        new_cover = dict()
        file_read = await cover.read()
        if len(file_read) > 15728640:
            raise HTTPException(status_code=400, detail='Cover is too big')
        with open(f'files/collections/cover-{user_wallet}.{cover.filename.split(".")[-1]}', 'wb') as doc:
            doc.write(file_read)
        for size_key in config.cover_sizes.keys():
            new_path = await main_additional_funcs.save_new_images(cover.filename, cover.content_type, user_wallet,
                                                                   config.cover_sizes[size_key], 'cover',
                                                                   'collections')
            new_cover[size_key] = new_path
        os.remove(f'files/collections/cover-{user_wallet}.{cover.filename.split(".")[-1]}')
        data['cover_url'] = new_cover
    else:
        raise HTTPException(status_code=400, detail='Only content-type image are available')

    if avatar.content_type in ['image/jpg', 'image/jpeg', 'image/gif', 'image/png']:

        new_avatar = dict()
        file_read = await avatar.read()
        if len(file_read) > 15728640:
            raise HTTPException(status_code=400, detail='Avatar is too big')
        with open(f'files/collections/avatar-{user_wallet}.{avatar.filename.split(".")[-1]}', 'wb') as doc:
            doc.write(file_read)
        for size_key in config.avatar_sizes.keys():
            new_path = await main_additional_funcs.save_new_images(avatar.filename, avatar.content_type, user_wallet,
                                                                   config.avatar_sizes[size_key], 'avatar',
                                                                   'collections')
            new_avatar[size_key] = new_path
        os.remove(f'files/collections/avatar-{user_wallet}.{avatar.filename.split(".")[-1]}')
        data['avatar_url'] = new_avatar
    else:
        raise HTTPException(status_code=400, detail='Only content-type image are available')
    timestamp = datetime.datetime.now()
    data['recent_change'] = str(timestamp.timestamp())
    data['date_create'] = timestamp
    data['history'] = list()
    data['is_on_popular'] = False
    data['statistics'] = False
    data['creator_id'] = obj['_id']
    config.db.collections.insert_one(data)
    config.db.users.find_one_and_update({"_id": obj['_id']},
                                        {"$push": {"collections": {"collection_id": data["_id"]}}})
    return await main_additional_funcs.get_collection_for_market_page(
        await statistics_additional_funcs.get_statistics_for_collection(data,
                                                                        request.headers
                                                                        )
    )


@router.post("/update_collection", dependencies=[Depends(RateLimiter(times=config.max_req,
                                                                     seconds=config.timeout_req))])
async def update_collection(request: Request,
                            collection_id: str = Form("null"),
                            name: str = Form("null"),
                            bio: str = Form("null"),
                            explicitContent: str = Form("null"),
                            cover: UploadFile = File(None),
                            avatar: UploadFile = File(None),
                            customURL: str = Form('null')
                            ):
    user_wallet = await auth.get_authorize_header_check(request)
    obj = config.db.users.find_one_and_update({"user_wallet": user_wallet}, {"$set": {"was_logged_in": True}})
    if not ObjectId.is_valid(collection_id):
        raise HTTPException(status_code=400, detail='not valid object collection id')
    if obj is None:
        raise HTTPException(status_code=404, detail='User not found')

    await main_additional_funcs.check_code_in_request(request, user_wallet, obj['was_logged_in'])

    if explicitContent not in ['true', 'false']:
        raise HTTPException(status_code=404, detail='explicitContent can be only true or false')

    collection_obj = config.db.collections.find_one({"_id": ObjectId(collection_id),
                                                     "creator_id": obj["_id"]})

    if collection_obj is None:
        raise HTTPException(status_code=404, detail='Collection not found or user cannot change it')

    if customURL.lower() == 'no_such_user' or (customURL.lower() != "null"
                                               and config.db.collections.find_one({"customURL": customURL}) is not None
                                               and config.db.collections.find_one({"customURL": customURL})
                                               != collection_obj):
        raise HTTPException(status_code=400, detail='customURL is already in use')

    new_data = dict()

    if name.lower() != "null" and len(name) <= 20 and await main_additional_funcs.check_text_in_black_list(name):
        new_data["name"] = name
    elif len(name) > 20 or not await main_additional_funcs.check_text_in_black_list(name):
        raise HTTPException(status_code=400, detail='Validation name failed')

    if bio.lower() != "null" and len(bio) <= 350 and await main_additional_funcs.check_text_in_black_list(bio):
        new_data["bio"] = bio
    elif len(bio) > 350 or not await main_additional_funcs.check_text_in_black_list(bio):
        raise HTTPException(status_code=400, detail='Validation bio failed')

    if explicitContent.lower() != "null":
        new_data["explicitContent"] = bool(explicitContent == 'true')

    if customURL.lower() != "null" and 3 <= len(customURL) <= 16 \
            and len(re.sub(r'^id[\d\d*][\D*\d*]*', '', customURL)) != 0 \
            and await main_additional_funcs.check_text_in_black_list(customURL) and ' ' not in customURL:
        new_data["customURL"] = customURL
    elif customURL.lower() != "null":
        raise HTTPException(status_code=400, detail='Validation customURL failed')

    if cover is not None and cover.content_type in ['image/jpg', 'image/jpeg', 'image/gif', 'image/png']:
        if collection_obj['cover_url'] is not None:
            await main_additional_funcs.delete_existing_photos(collection_obj, 'cover_url', 'collections')
        new_cover = dict()
        file_read = await cover.read()
        if len(file_read) > 15728640:
            raise HTTPException(status_code=400, detail='Cover is too big')
        with open(f'files/collections/cover-{user_wallet}.{cover.filename.split(".")[-1]}', 'wb') as doc:
            doc.write(file_read)
        for size_key in config.cover_sizes.keys():
            new_path = await main_additional_funcs.save_new_images(cover.filename, cover.content_type, user_wallet,
                                                                   config.cover_sizes[size_key], 'cover',
                                                                   'collections')
            new_cover[size_key] = new_path
        os.remove(f'files/collections/cover-{user_wallet}.{cover.filename.split(".")[-1]}')
        new_data['cover_url'] = new_cover
    elif cover is not None:
        raise HTTPException(status_code=400, detail='Only content-type image are available')

    if avatar is not None and avatar.content_type in ['image/jpg', 'image/jpeg', 'image/gif', 'image/png']:
        if collection_obj['avatar_url'] is not None:
            await main_additional_funcs.delete_existing_photos(collection_obj, 'avatar_url', 'collections')

        new_avatar = dict()
        file_read = await avatar.read()
        if len(file_read) > 15728640:
            raise HTTPException(status_code=400, detail='Avatar is too big')
        with open(f'files/collections/avatar-{user_wallet}.{avatar.filename.split(".")[-1]}', 'wb') as doc:
            doc.write(file_read)
        for size_key in config.avatar_sizes.keys():
            new_path = await main_additional_funcs.save_new_images(avatar.filename, avatar.content_type, user_wallet,
                                                                   config.avatar_sizes[size_key], 'avatar',
                                                                   'collections')
            new_avatar[size_key] = new_path
        os.remove(f'files/collections/avatar-{user_wallet}.{avatar.filename.split(".")[-1]}')
        new_data['avatar_url'] = new_avatar
    elif avatar is not None:
        raise HTTPException(status_code=400, detail='Only content-type image are available')
    new_data['recent_change'] = str(datetime.datetime.now().timestamp())
    collection_obj = config.db.collections.find_one_and_update(
        {"_id": collection_obj["_id"]},
        {"$set": new_data},
        return_document=ReturnDocument.AFTER)
    print(f'start timestamp: {datetime.datetime.now().timestamp()}')
    collection_obj['items'] \
        = list(config.db.tokens.find({"_id": {"$in": [elem["token_id"] for elem in collection_obj['items']]}}))
    print(f'end timestamp: {datetime.datetime.now().timestamp()}')
    return await main_additional_funcs.get_collection_for_market_page(
        await statistics_additional_funcs.get_statistics_for_collection(collection_obj,
                                                                        request.headers
                                                                        )
    )


@router.post('/add_items', dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def add_new_items_to_collection(request: Request, collection: collections_models.CollectionAddItems):
    user_wallet = await auth.get_authorize_header_check(request)
    obj = config.db.users.find_one_and_update({"user_wallet": user_wallet,
                                               "collections.collection_id": ObjectId(collection.collection_id)},
                                              {"$set": {"was_logged_in": True}})
    if obj is None:
        raise HTTPException(status_code=404, detail='User not found or collection is not attached to the user')
    await main_additional_funcs.check_code_in_request(request, user_wallet, obj['was_logged_in'])

    collection_in_db = config.db.collections.find_one({"_id": ObjectId(collection.collection_id),
                                                       "creator_id": obj['_id'],
                                                       "contract_address": {"$exists": 0}})

    if collection_in_db is None:
        raise HTTPException(status_code=404, detail='Collection not found or is not attached to the user '
                                                    'or cannot be changed')

    update_queries = dict()
    update_queries['collections'] = list()
    update_queries['tokens'] = list()
    update_queries['users'] = list()
    update_queries_tokens_listed = list()
    tokens = config.db.tokens.find({"_id": {"$in": [ObjectId(elem.token_id) for elem in collection.tokens]},
                                    "owner_id": obj['user_wallet'],
                                    "contract_id": config.nft_contract,
                                    "collection_id": None})
    # collection_checks = config.db.collections.find({
    #     "_id": collection_in_db["_id"],
    #     "items.token_id": {"$nin": [ObjectId(elem.token_id) for elem in collection.tokens]}
    # })
    for token in tokens:
        collection_check = config.db.collections.find_one({
            "_id": collection_in_db["_id"],
            "items.token_id": {"$ne": ObjectId(token['_id'])}
        })
        if collection_check is not None and token not in update_queries_tokens_listed:
            activity_id = ObjectId()
            update_queries['collections'].append(dict(
                type='update_one',
                find_query={"_id": collection_in_db['_id'],
                            "items.token_id": {"$ne": token["_id"]}},
                update_query={'$push': {"items": {"token_id": token['_id']},
                                        "history": {"token_id": token['_id'],
                                                    "activity_id": activity_id}}}
            ))
            update_queries['tokens'].append(dict(
                type='update_one',
                find_query={"_id": token['_id'],
                            "collection_id": None},
                update_query={'$set': {"collection_id": collection_in_db["_id"]},
                              '$push': {"history": {"activity_id": activity_id,
                                                    "type": "collection_adding",
                                                    "collection_id": collection_in_db['_id'],
                                                    "timestamp": str(datetime.datetime.now().timestamp()),
                                                    "owner_id": user_wallet}}}
            ))
            update_queries['users'].append(dict(
                type='update_one',
                find_query={"_id": obj['_id'],
                            "activities.token_id": {"$ne": token["_id"]}},
                update_query={'$push': {"activities": {"token_id": token['_id'],
                                                       "activity_id": activity_id}}}
            ))
            update_queries_tokens_listed.append(token)

        else:
            print(token, collection_check, token not in update_queries_tokens_listed)
            raise HTTPException(status_code=400, detail='One of the tokens was not found, '
                                                        'or user cannot affect on it, '
                                                        'or token is already in the collection')

    await main_additional_funcs.update_queries_in_db(update_queries)
    print(f'start timestamp: {datetime.datetime.now().timestamp()}')
    collection = config.db.collections.find_one(
        {"_id": collection_in_db['_id']})
    collection['items'] \
        = list(config.db.tokens.find({"_id": {"$in": [elem["token_id"] for elem in collection['items']]}}))
    print(f'end timestamp: {datetime.datetime.now().timestamp()}')
    return await main_additional_funcs.get_collection_for_market_page(
        await statistics_additional_funcs.get_statistics_for_collection(
            collection,
            request.headers
        )
    )


@router.get('/possible_items/{collection_id}', dependencies=[Depends(RateLimiter(times=config.max_req,
                                                                                 seconds=config.timeout_req))])
async def possible_items_for_collection(request: Request, collection_id):
    if not ObjectId.is_valid(collection_id):
        raise HTTPException(status_code=400, detail='Not valid ObjectId')
    user_wallet = await auth.get_authorize_header_check(request)
    obj = config.db.users.find_one_and_update({"user_wallet": user_wallet,
                                               "collections.collection_id": ObjectId(collection_id)},
                                              {"$set": {"was_logged_in": True}})
    if obj is None:
        raise HTTPException(status_code=400, detail='User not found or collection is not attached to user')
    await main_additional_funcs.check_code_in_request(request, user_wallet, obj['was_logged_in'])
    collection_obj = config.db.collections.find_one({"_id": ObjectId(collection_id),
                                                     "creator_id": obj['_id'],
                                                     "contract_address": {"$exists": 0}})
    if collection_obj is None:
        raise HTTPException(status_code=400, detail='That collection cannot be changed')
    tokens = list(config.db.tokens.find({"_id": {"$in": [elem['token_id'] for elem in obj['items_owned']]},
                                         "owner_id": obj['user_wallet'],
                                         "contract_id": config.nft_contract,
                                         "collection_id": None
                                         }))
    categories = dict()
    for token in tokens:
        if 'category' in token and ObjectId(token['category']) not in categories:
            categories[ObjectId(token['category'])] = config.db.categories.find_one(
                {"_id": ObjectId(token['category'])})

    for token_id in range(len(tokens)):
        token = tokens[token_id]
        token = await main_additional_funcs.fill_in_single_token_object(token, categories)
        for to_delete in ['category', 'rank', 'collection_id', 'likes', 'is_on_sale']:
            if to_delete in token:
                del token[to_delete]
        tokens[token_id] = token
    return dict(tokens=tokens,
                collection_name=collection_obj['name'])


@router.get("/statistics/{collection_id_or_customURL}", dependencies=[Depends(RateLimiter(times=config.max_req,
                                                                                          seconds=config.timeout_req))])
async def get_collection_statistics(request: Request, collection_id_or_customURL):
    collection = None
    if not ObjectId.is_valid(collection_id_or_customURL):
        collection = config.db.collections.find_one({"customURL": collection_id_or_customURL})
        if collection is None:
            raise HTTPException(status_code=400, detail='Not valid ObjectId')
    if collection is None:
        collection = config.db.collections.find_one({"_id": ObjectId(collection_id_or_customURL)})
    if collection is not None:
        print(f'start timestamp: {datetime.datetime.now().timestamp()}')
        collection['items'] \
            = list(config.db.tokens.find({"_id": {"$in": [elem["token_id"] for elem in collection['items']]}}))
        print(f'end timestamp: {datetime.datetime.now().timestamp()}')

        return await main_additional_funcs.delete_object_ids_from_dict(
            await statistics_additional_funcs.get_statistics_for_collection(collection, request.headers))
    raise HTTPException(status_code=404, detail='Collection not found')


@router.get("/get/{collection_id_or_customURL}", dependencies=[Depends(RateLimiter(times=config.max_req,
                                                                                   seconds=config.timeout_req))])
async def get_collection(request: Request, collection_id_or_customURL):
    collection = None
    if not ObjectId.is_valid(collection_id_or_customURL):
        collection = config.db.collections.find_one({"customURL": collection_id_or_customURL})
        if collection is None:
            raise HTTPException(status_code=400, detail='Not valid ObjectId')
    if collection is None:
        collection = config.db.collections.find_one({"_id": ObjectId(collection_id_or_customURL)})
    if collection is not None:
        print(f'start timestamp: {datetime.datetime.now().timestamp()}')
        collection['items'] \
            = list(config.db.tokens.find({"_id": {"$in": [elem["token_id"] for elem in collection['items']]}}))
        print(f'end timestamp: {datetime.datetime.now().timestamp()}')

        return await main_additional_funcs.get_collection_for_market_page(
            await statistics_additional_funcs.get_statistics_for_collection(collection,
                                                                            request.headers
                                                                            )
        )
    raise HTTPException(status_code=404, detail='Collection not found')


# @router.post('/get_collection_tokens')
# async def get_collection_items(search: collections_models.CollectionGetItems):
#     find_query = {"collection_id": ObjectId(search.collection_id),
#                   "price": None}
#     sort_order = {1: "$gte",
#                   -1: "$lte"}
#     if search.name is not None:
#         category = config.db.categories.find_one({"name": search.name})
#         if category is not None:
#             find_query['category'] = category['_id']
#
#     if search.price_less is not None:
#         find_query.update({"price": {"$gte": Decimal128(search.price_less)}})
#     if search.price_more is not None:
#         find_query.update({"price": {"$lte": Decimal128(search.price_more)}})
#
#     if search.next_rank is not None:
#         find_query.update({"rank": {sort_order[search.sort_order]: search.next_rank}})
#     if search.next_price is not None:
#         find_query.update({"price": {sort_order[search.sort_order] if search.next_rank is None else '$lt':
#                                          Decimal128(search.next_price)}})
#
#     if search.next_id is not None:
#         find_query.update({"_id": {"$ne": ObjectId(search.next_id)}})
#
#     print(find_query)
#
#     tokens_with_price = list(config.db.tokens.find(find_query)
#                              .sort([(search.sort_type, search.sort_order)])
#                              .limit(search.limit))
#
#     tokens_without_price = list()
#     if search.price_less is None and search.price_more is None \
#             and not search.is_only_on_sale and len(tokens_with_price) < search.limit:
#         find_query = {"collection_id": ObjectId(search.collection_id),
#                       "price": None}
#         if search.name is not None:
#             if category is not None:
#                 find_query['category'] = category['_id']
#         if search.next_rank is not None:
#             find_query.update({"rank": {sort_order[search.sort_order]: search.next_rank}})
#         if search.next_id is not None:
#             find_query.update({"_id": {"$ne": ObjectId(search.next_id)}})
#         print(find_query)
#         tokens_without_price = list(config.db.tokens.find(find_query)
#                                     .sort([(search.sort_type, search.sort_order)])
#                                     .limit(search.limit - len(tokens_with_price)))
#
#     tokens = tokens_with_price + tokens_without_price
#
#     return await main_additional_funcs.delete_object_ids_from_list(tokens)


@router.get("/without_stats/{collection_id_or_customURL}", dependencies=[Depends(RateLimiter(times=config.max_req,
                                                                                             seconds=config.timeout_req
                                                                                             ))])
async def get_collection(collection_id_or_customURL):
    collection = None
    if not ObjectId.is_valid(collection_id_or_customURL):
        collection = config.db.collections.find_one({"customURL": collection_id_or_customURL})
        if collection is None:
            raise HTTPException(status_code=400, detail='Not valid ObjectId')
    if collection is None:
        collection = config.db.collections.find_one({"_id": ObjectId(collection_id_or_customURL)})
    if collection is not None:
        print(f'start timestamp: {datetime.datetime.now().timestamp()}')
        collection['items'] \
            = list(config.db.tokens.find({"_id": {"$in": [elem["token_id"] for elem in collection['items']]}}))
        print(f'end timestamp: {datetime.datetime.now().timestamp()}')

        return await main_additional_funcs.get_collection_for_market_page(collection)
    raise HTTPException(status_code=404, detail='Collection not found')


@router.get("/metadata/{obj}",
            dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def get_metadata(obj):
    if not ObjectId.is_valid(obj):
        raise HTTPException(status_code=400, detail="Not valid ObjectId")
    obj = config.db.collections.find_one({"_id": ObjectId(obj)})
    if obj is not None:
        avatar_url = None
        if obj['avatar_url'] is not None:
            avatar_url = config.server_link + '/collections/get_file/' + obj['avatar_url']["size3"]
        return dict(name=obj['name'], image=avatar_url)

    raise HTTPException(status_code=404, detail='Object not found')
