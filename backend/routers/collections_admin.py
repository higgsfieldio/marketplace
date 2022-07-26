import datetime
from fastapi import APIRouter, HTTPException, Form, UploadFile, File
from models import collections_admin as collections_models
from utils import collections_admin as collections_additional_funcs
from utils import main as main_additional_funcs
from utils import statistics as statistics_additional_funcs
import aiohttp
from bson import ObjectId
from middlewares import auth
import config

router = APIRouter(
    prefix=f"{config.root_path}/collections_admin",
    tags=["collections_admin"],
    responses={404: {"description": "Not found"}}
)


@router.get('/get_possible_missed_files/{collection_id}', dependencies=[auth.Security(auth.get_api_key)])
async def get_possible_missed_files(collection_id):
    if not ObjectId.is_valid(collection_id):
        raise HTTPException(status_code=400, detail='collection_id is not valid')
    collection = config.db.collections.find_one({"_id": ObjectId(collection_id)})
    if collection is not None and 'contract_address' in collection:
        collection['items'] \
            = list(config.db.tokens.find({"_id": {"$in": [elem["token_id"] for elem in collection['items']]}}))
        tokens = list()
        for token in collection['items']:
            if not token['token_id'].isdigit():
                raise HTTPException(status_code=400, detail='token_ids are not digits')
            tokens.append(int(token['token_id']))
        max_v = max(tokens)
        missed = [elem for elem in range(0, max_v + 1)]
        for token in tokens:
            if token in missed:
                missed.remove(token)
        return dict(collection_id=collection_id, tokens=[dict(token_id=elem) for elem in missed])
    raise HTTPException(status_code=404, detail='Object not found')


@router.post('/insert_missed_token_ids', dependencies=[auth.Security(auth.get_api_key)])
async def get_possible_missed_files(collection_: collections_models.CollectionInsertMissedTokens):
    params = {
        "collection_id": collection_.collection_id,
        "tokens": collection_.dict()['tokens']
    }
    async with aiohttp.ClientSession() as client:
        async with client.post(config.parser_link + '/collections_admin/insert_missed_token_ids',
                               headers={config.FAST_API_KEY_NAME: config.FAST_API_KEY},
                               json=params) as resp:
            if resp.status == 200:
                return await resp.json()
            elif resp.status != 500:
                raise HTTPException(status_code=resp.status, detail=(await resp.json())['detail'])
    raise HTTPException(status_code=500, detail='Unknown Error')


@router.post('/refresh_ranks/{collection_id}', dependencies=[auth.Security(auth.get_api_key)])
async def refresh_ranks(collection_id: str):
    if ObjectId.is_valid(collection_id):
        collection = config.db.collections.find_one({"_id": ObjectId(collection_id),
                                                     "contract_address": {"$ne": None}})
        if collection is None:
            raise HTTPException(status_code=400, detail='Object not found')
        await collections_additional_funcs.update_attributes_rarity(collection['contract_address'])
        collection['items'] \
            = list(config.db.tokens.find({"_id": {"$in": [elem["token_id"] for elem in collection['items']]}}))

        return await main_additional_funcs.get_collection_for_market_page(
            await statistics_additional_funcs.get_statistics_for_collection(collection,
                                                                            'UTC'
                                                                            )
        )
    raise HTTPException(status_code=400, detail='Not valid ObjectId')


@router.post('/refresh_ranks_as_in_file', dependencies=[auth.Security(auth.get_api_key)])
async def refresh_ranks_as_in_file(collection_: collections_models.CollectionRefreshAsInFile):
    collection = config.db.collections.find_one({"_id": ObjectId(collection_.collection_id),
                                                 "contract_address": {"$ne": None}})
    if collection is None:
        raise HTTPException(status_code=400, detail='Object not found')
    for token in collection_.tokens.keys():
        config.db.tokens.update_one({"contract_id": collection['contract_address'],
                                     "token_id": token},
                                    {"$set": {"rank": collection_.tokens[token],
                                              "score": None}})
    collection['items'] \
        = list(config.db.tokens.find({"_id": {"$in": [elem["token_id"] for elem in collection['items']]}}))

    return await main_additional_funcs.get_collection_for_market_page(
        await statistics_additional_funcs.get_statistics_for_collection(collection,
                                                                        'UTC'
                                                                        )
    )


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
    async with aiohttp.ClientSession() as client:
        form = aiohttp.FormData()
        form.add_field('contract_address', contract_address)
        form.add_field('name', name)
        form.add_field('bio', bio)
        form.add_field('user_id', user_id) if user_id != 'null' else None
        form.add_field('socials', socials)
        form.add_field('category_id', category_id) if category_id != 'null' else None
        form.add_field('explicitContent', explicitContent)
        form.add_field('mint_price', mint_price)
        form.add_field('customURL', customURL) if customURL != 'null' else None
        if mint_date != 'null':
            try:
                datetime.datetime.strptime(mint_date, '%Y-%m-%d')
                form.add_field('mint_date', mint_date)
            except Exception as e:
                raise HTTPException(status_code=400, detail=f'mint_date must be equal to format %Y-%m-%d err: {e}')
        form.add_field('cover', await cover.read(), filename=cover.filename, content_type=cover.content_type)
        form.add_field('avatar', await avatar.read(), filename=avatar.filename, content_type=avatar.content_type)
        async with client.post(config.parser_link + '/collections_admin/create_admin',
                               data=form,
                               headers={config.FAST_API_KEY_NAME: config.FAST_API_KEY}
                               ) as resp:
            if resp.status == 200:
                return await resp.json()
            elif resp.status != 500:
                raise HTTPException(status_code=resp.status, detail=(await resp.json())['detail'])
    raise HTTPException(status_code=500, detail='Unknown Error')
