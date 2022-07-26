from fastapi import APIRouter, HTTPException, Form, UploadFile, File
from models import collections_admin as collections_models
from utils import users as users_additional_funcs
from utils import main as main_additional_funcs
from utils import statistics as statistics_additional_funcs
from utils import near_for_creating_collections as near_additional_funcs
import datetime
import os
import asyncio
import aiohttp
import json
from utils import collections_admin as collections_additional_funcs
from bson import ObjectId

from middlewares import auth
import config

router = APIRouter(
    prefix=f"{config.root_path}/collections_admin",
    tags=["collections_admin"],
    responses={404: {"description": "Not found"}}
)


@router.post('/insert_missed_token_ids', dependencies=[auth.Security(auth.get_api_key)])
async def get_possible_missed_files(collection_: collections_models.CollectionInsertMissedTokens):
    collection = config.db.collections.find_one({"_id": ObjectId(collection_.collection_id)})
    if collection is not None and 'contract_address' in collection:
        task_list = list()
        update_queries = dict()
        try:
            params = {
                "jsonrpc": "2.0",
                "id": "dontcare",
                "method": "query",
                "params": {
                    "request_type": "call_function",
                    "account_id": collection['contract_address'],
                    "method_name": "nft_metadata",
                    "args_base64": "e30",
                    "finality": "final"}
            }
            async with aiohttp.ClientSession() as client_1:
                async with client_1.post(config.main_near_link,
                                         json=params) as resp_1:
                    response = json.loads(await resp_1.text())
                    if resp_1.status == 200 and 'error' not in response and 'error' not in response['result']:
                        base_uri = json.loads(
                            bytearray(response['result']['result']).decode('utf-8'))['base_uri']
                    else:
                        base_uri = ''
            sem_ipfs = asyncio.Semaphore(25)
            sem_upload_to_main_server = asyncio.Semaphore(20)
            for token in collection_.tokens:
                task_list.append(
                    asyncio.create_task(
                        near_additional_funcs.check_token_on_blockchain(
                            token.token_id, collection['contract_address'],
                            sem_ipfs, base_uri,
                            collection['category_id'],
                            sem_upload_to_main_server
                        )
                    )
                )
            items_gathered = await asyncio.gather(*task_list)
            for item_gathered in items_gathered:
                if isinstance(item_gathered, dict):
                    for key in item_gathered.keys():
                        if key not in update_queries:
                            update_queries[key] = list()
                        [update_queries[key].append(elem) for elem in item_gathered[key]]
                else:
                    print(f'isinstance(item_gathered, dict) err: {item_gathered}')
            await main_additional_funcs.update_queries_in_db_after_collection_refresh(
                update_queries,
                collection["_id"],
            )
            await collections_additional_funcs.update_attributes_rarity(collection['contract_address'])
            collection['items'] \
                = list(config.db.tokens.find({"_id": {"$in": [elem["token_id"] for elem in collection['items']]}}))

            return await main_additional_funcs.get_collection_for_market_page(
                await statistics_additional_funcs.get_statistics_for_collection(collection,
                                                                                'UTC'
                                                                                )
            )
        except Exception as e:
            print(f'item gathered err: {e}')
            print(e)
            for task in task_list:
                task.cancel()
            raise HTTPException(status_code=400, detail=f'item gathered err: {e}')
    raise HTTPException(status_code=404, detail='Object not found')


@router.post('/create_admin', dependencies=[auth.Security(auth.get_api_key)])
async def create_admin_collection(
        contract_address: str = Form(...),
        name: str = Form(..., max_length=20),
        bio: str = Form(...),
        user_id: str = Form('null', min_length=24, max_length=24),
        explicitContent: str = Form("false"),
        socials: str = Form("null"),
        category_id: str = Form('null', min_length=24, max_length=24),
        cover: UploadFile = File(...),
        avatar: UploadFile = File(...),
        mint_price: str = Form("null"),
        mint_date: str = Form('null'),
        customURL: str = Form('null', min_length=3, max_length=16)
):
    if (user_id.lower() == 'null' and config.db.users.find_one({"user_wallet": contract_address}) is not None) \
            or config.db.collections.find_one({"contract_address": contract_address}) is not None:
        raise HTTPException(status_code=400, detail='Contract Address is already in db')

    if user_id.lower() != 'null':
        user_id = config.db.users.find_one({"_id": ObjectId(user_id)})
        if user_id is None:
            raise HTTPException(status_code=400, detail='UserId not found')
    if explicitContent not in ['true', 'false']:
        raise HTTPException(status_code=404, detail='explicitContent can be only true or false')

    if socials.lower() != 'null':
        socials = await collections_additional_funcs.check_socials(socials)
    else:
        socials = None

    if mint_price.lower() == 'null':
        mint_price = None

    if customURL.lower() == 'null':
        customURL = None

    if category_id.lower() != 'null':
        category_id = ObjectId(category_id)
        if config.db.categories.find_one({"_id": category_id}) is None:
            raise HTTPException(status_code=400, detail='No such category id')
    else:
        category_id = config.db.categories.find_one({"name": "art"})['_id']

    if len(name) > 20 or len(bio) > 350 \
            or not await main_additional_funcs.check_text_in_black_list(name) \
            or not await main_additional_funcs.check_text_in_black_list(bio):
        raise HTTPException(status_code=400, detail='Validation name or bio failed')

    update_queries = await near_additional_funcs.get_items(contract_address, category_id)
    cover_url, avatar_url = None, None
    data = dict()

    data["explicitContent"] = bool(explicitContent == 'true')

    data["name"] = name

    data['items'] = list()

    data["bio"] = bio

    data['socials'] = socials

    data['mint_price'] = mint_price

    if mint_date != 'null':
        try:
            data['date_create'] = datetime.datetime.strptime(mint_date, '%Y-%m-%d')
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Mint date must be equal to format %Y-%m-%d err: {e}")

    if cover.content_type in ['image/jpg', 'image/jpeg', 'image/gif', 'image/png']:
        new_cover = dict()
        file_read = await cover.read()
        if len(file_read) > 15728640:
            raise HTTPException(status_code=400, detail='Cover is too big')
        with open(f'files/collections/cover-{contract_address}.{cover.filename.split(".")[-1]}', 'wb') as doc:
            doc.write(file_read)
        for size_key in config.cover_sizes.keys():
            new_path = await main_additional_funcs.save_new_images(cover.filename, cover.content_type, contract_address,
                                                                   config.cover_sizes[size_key], 'cover',
                                                                   'collections')
            uploaded = False

            if user_id == 'null':
                for i in range(5):
                    try:
                        async with aiohttp.ClientSession() as client:
                            form = aiohttp.FormData()
                            with open(config.app_location + f'/files/collections/' + new_path, 'rb') as file:
                                form.add_field('file', file, filename=new_path)
                                async with client.post(config.server_link + '/users/upload',
                                                       data=form,
                                                       headers={config.FAST_API_KEY_NAME: config.FAST_API_KEY},
                                                       timeout=config.timeout_req + 7
                                                       ) as resp:
                                    if resp.status == 200:
                                        uploaded = True
                                        break
                    except Exception as e:
                        print(f'uploading file to main server err: {e}')
                    await asyncio.sleep(0.75)
                if not uploaded:
                    raise HTTPException(status_code=400, detail='Could not upload avatar to main server')

            uploaded = False

            for i in range(5):
                try:
                    async with aiohttp.ClientSession() as client:
                        form = aiohttp.FormData()
                        with open(config.app_location + f'/files/collections/' + new_path, 'rb') as file:
                            form.add_field('file', file, filename=new_path)
                            async with client.post(config.server_link + '/collections/upload',
                                                   data=form,
                                                   headers={config.FAST_API_KEY_NAME: config.FAST_API_KEY},
                                                   timeout=config.timeout_req + 7
                                                   ) as resp:
                                if resp.status == 200:
                                    uploaded = True
                                    break
                except Exception as e:
                    print(f'uploading file to main server err: {e}')
                await asyncio.sleep(0.75)
            os.remove(config.app_location + f'/files/collections/' + new_path)
            if not uploaded:
                raise HTTPException(status_code=400, detail='Could not upload cover to main server')

            new_cover[size_key] = new_path
        os.remove(f'files/collections/cover-{contract_address}.{cover.filename.split(".")[-1]}')
        data['cover_url'] = new_cover
        cover_url = new_cover

    else:
        raise HTTPException(status_code=400, detail='Only content-type image are available')

    if avatar.content_type in ['image/jpg', 'image/jpeg', 'image/gif', 'image/png']:
        new_avatar = dict()
        file_read = await avatar.read()
        if len(file_read) > 15728640:
            raise HTTPException(status_code=400, detail='Avatar is too big')
        with open(f'files/collections/avatar-{contract_address}.{avatar.filename.split(".")[-1]}', 'wb') as doc:
            doc.write(file_read)
        for size_key in config.avatar_sizes.keys():
            new_path = await main_additional_funcs.save_new_images(avatar.filename, avatar.content_type,
                                                                   contract_address,
                                                                   config.avatar_sizes[size_key], 'avatar',
                                                                   'collections')
            uploaded = False

            if user_id == 'null':
                for i in range(5):
                    try:
                        async with aiohttp.ClientSession() as client:
                            form = aiohttp.FormData()
                            with open(config.app_location + f'/files/collections/' + new_path, 'rb') as file:
                                form.add_field('file', file, filename=new_path)
                                async with client.post(config.server_link + '/users/upload',
                                                       data=form,
                                                       headers={config.FAST_API_KEY_NAME: config.FAST_API_KEY},
                                                       timeout=config.timeout_req + 7
                                                       ) as resp:
                                    if resp.status == 200:
                                        uploaded = True
                                        break
                    except Exception as e:
                        print(f'uploading file to main server err: {e}')
                    await asyncio.sleep(0.75)
                if not uploaded:
                    raise HTTPException(status_code=400, detail='Could not upload avatar to main server')

            uploaded = False

            for i in range(5):
                try:
                    async with aiohttp.ClientSession() as client:
                        form = aiohttp.FormData()
                        with open(config.app_location + f'/files/collections/' + new_path, 'rb') as file:
                            form.add_field('file', file, filename=new_path)
                            async with client.post(config.server_link + '/collections/upload',
                                                   data=form,
                                                   headers={config.FAST_API_KEY_NAME: config.FAST_API_KEY},
                                                   timeout=config.timeout_req + 7
                                                   ) as resp:
                                if resp.status == 200:
                                    uploaded = True
                                    break
                except Exception as e:
                    print(f'uploading file to main server err: {e}')
                await asyncio.sleep(0.75)
            os.remove(config.app_location + f'/files/collections/' + new_path)
            if not uploaded:
                raise HTTPException(status_code=400, detail='Could not upload avatar to main server')

            new_avatar[size_key] = new_path
        os.remove(f'files/collections/avatar-{contract_address}.{avatar.filename.split(".")[-1]}')
        data['avatar_url'] = new_avatar
        avatar_url = new_avatar
    else:
        raise HTTPException(status_code=400, detail='Only content-type image are available')

    if user_id == 'null':
        timestamp = str(datetime.datetime.now().timestamp())
        insert_dict = {
            "user_name": name,
            "description": None,
            "user_id": f'id{await users_additional_funcs.get_next_id("users")}',
            "user_wallet": contract_address,
            "socials": socials,
            "avatar_url": avatar_url,
            "cover_url": cover_url,
            "items_owned": list(),
            "items_created": list(),
            "collections": list(),
            "activities": list(),
            "liked": list(),
            "bio": bio,
            "customURL": customURL,
            "personal": None,
            "email": None,
            "verified": True,
            "date_created": timestamp,
            "recent_change": timestamp,
            "recent_metadata_change": timestamp}
        config.db.users.insert_one(insert_dict)
        creator_id = insert_dict["_id"]
    else:
        creator_id = user_id['_id']

    timestamp = datetime.datetime.now()
    data['recent_change'] = str(timestamp.timestamp())
    if 'date_create' not in data:
        data['date_create'] = timestamp
    data['history'] = list()
    data['is_on_popular'] = False
    data['statistics'] = False
    data['contract_address'] = contract_address
    data['creator_id'] = creator_id
    data['category_id'] = category_id
    if customURL is not None:
        data['customURL'] = customURL
    config.db.collections.insert_one(data)
    config.db.users.find_one_and_update({"_id": creator_id},
                                        {"$push": {"collections": {"collection_id": data["_id"]}}})
    await main_additional_funcs.update_queries_in_db_after_collection_refresh(
        update_queries,
        data["_id"],
    )
    await collections_additional_funcs.update_attributes_rarity(contract_address)
    await collections_additional_funcs.add_collection_to_approved(contract_address)
    collection = config.db.collections.find_one({"_id": data['_id']})
    collection['items'] \
        = list(config.db.tokens.find({"_id": {"$in": [elem["token_id"] for elem in collection['items']]}}))

    return await main_additional_funcs.get_collection_for_market_page(
        await statistics_additional_funcs.get_statistics_for_collection(collection,
                                                                        'UTC'
                                                                        )
    )
