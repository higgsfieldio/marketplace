import json

import aiohttp
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi_limiter.depends import RateLimiter
from fastapi.requests import Request
from middlewares import auth
from utils import main as main_additional_funcs
from bson import ObjectId
import config
from transliterate import translit
import re
import urllib.request as req


router = APIRouter(
    prefix=f"{config.root_path}/ipfs",
    tags=["ipfs"],
    responses={404: {"description": "Not found"}}
)


async def get_most_freed_api_key():
    return config.db.ipfs_keys.find_one_and_update({"uses": {"$gt": -1}}, {"$inc": {"uses": 1}})['key']


async def upload_data_to_ipfs(image_obj, json_obj):
    try:
        timeout_float = 45.0
        async with aiohttp.ClientSession() as client:
            form = aiohttp.FormData()
            form.add_field('file', image_obj[0], filename=image_obj[1], content_type=image_obj[2])
            form.add_field('file', json_obj[0], filename=json_obj[1], content_type=json_obj[2])
            key = await get_most_freed_api_key()
            async with client.post(
                    f"https://api.nft.storage/upload",
                    data=form,
                    headers={"Authorization": 'Bearer ' + key},
                    timeout=timeout_float
            ) as resp:
                response = await resp.json(content_type=None)
                data = response['value']
                cid = data['cid']
                img = None
                json_ = None
                for file_id in range(len(data['files'])):
                    if data['files'][file_id]['type'] == 'application/json':
                        json_ = cid + '/' + req.pathname2url(data['files'][file_id]['name'])
                        if file_id == len(data['files']) - 1:
                            img = cid + '/' + req.pathname2url(data['files'][file_id - 1]['name'])
                        else:
                            img = cid + '/' + req.pathname2url(data['files'][file_id + 1]['name'])
                        break
                return img, json_
    except Exception as e:
        print(e)
        return None, None


@router.post("/upload", dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def upload_image(request: Request,
                       image: UploadFile = File(...),
                       name: str = Form(...),
                       description: str = Form(...),
                       collection_id: str = Form("null"),
                       category_name: str = Form(...),
                       royalty: str = Form("0"),
                       attributes: str = Form("null"),
                       explicitContent: str = Form('false'),
                       ):
    user_wallet = await auth.get_authorize_header_check(request)
    user = config.db.users.find_one_and_update({"user_wallet": user_wallet}, {"$set": {"was_logged_in": True}})
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')

    await main_additional_funcs.check_code_in_request(request, user_wallet, user['was_logged_in'])

    file_read = await image.read()
    if len(file_read) > 15728640:
        raise HTTPException(status_code=400, detail='Cover is too big')

    if len(name) > 20 or not await main_additional_funcs.check_text_in_black_list(name):
        raise HTTPException(status_code=400, detail='Collection name cannot be more than 20'
                                                    ' or one of the words in black list')

    if len(description) > 350 or not await main_additional_funcs.check_text_in_black_list(description):
        raise HTTPException(status_code=400, detail='Description cannot be more than 350'
                                                    ' or one of the words in black list')

    if collection_id != 'null'\
            and (not ObjectId.is_valid(collection_id)
                 or config.db.collections.find_one({"_id": ObjectId(collection_id), "creator_id": user['_id']})
                 is None):
        raise HTTPException(status_code=400, detail='No such collection connected to user')
    elif collection_id != 'null':
        collection_name = config.db.collections.find_one({"_id": ObjectId(collection_id)})['name']
    else:
        collection_name = None
        collection_id = None

    if attributes == 'null':
        attributes = None
    else:
        try:
            attributes = json.loads(attributes)
            for e in attributes:
                print(e)
                if 'trait_type' not in e or 'value' not in e:
                    raise ValueError
        except Exception as e:
            raise HTTPException(status_code=400, detail=f'Could not convert attributes to json: {e}')

    if not royalty.isdigit() or int(royalty) > 50:
        raise HTTPException(status_code=400, detail='Royalty cannot be more than 50%')

    if explicitContent not in ['true', 'false']:
        raise HTTPException(status_code=400, detail='explicitContent can be only true or false')
    else:
        explicitContent = bool(explicitContent == 'true')

    if category_name.lower() not in config.available_categories:
        raise HTTPException(status_code=400, detail="category_name not in available_categories")

    json_file_sample = {
        "name": name,
        "description": description,
        "attributes": attributes,
        "collection": {
            "collection_id": collection_id,
            "name": collection_name,
        },
        "properties": {
            "files": [
                {
                    "uri": image.filename,
                    "type": image.content_type
                }
            ],
            "category": category_name,
            "creators": [
                {
                    "address": user_wallet,
                    "share": int(royalty) * 100
                }
            ],
            "explicitContent": explicitContent
        }
    }
    image.filename = image.filename.replace(' ', '')
    try:
        filename = translit(image.filename, reversed=True)
        image.filename = re.sub(r'\ |\?||\!|\/|\;|\:',
                                '',
                                filename)
    except Exception as e:
        print(e)
    img, json_ = \
        await upload_data_to_ipfs(
            [file_read, image.filename, image.content_type],
            [json.dumps(json_file_sample), image.filename.rsplit('.', maxsplit=1)[0] + '.json', 'application/json']
        )
    if img is None or json_ is None:
        raise HTTPException(status_code=400, detail='Could not upload to ipfs')

    return dict(img=img, json=json_)
