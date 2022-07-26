import asyncio

import aiohttp
from fastapi import FastAPI
from uvicorn import Config, Server
from routers import collections_admin, tokens
import aioschedule as schedule
from back_cycles.update_refresh_metadata import update_refresh_metadata
import json
import base64
from back_cycles.check_tx_on_helper import check_tx_on_wamp
from utils.collections_admin import add_collection_to_approved
from utils.main import create_user_after_refresh, check_if_token_is_staked
from utils.near import get_royalty
from models.tokens import Token
import datetime
from bson import ObjectId

import config

app = FastAPI(docs_url=None, openapi_url=None)

app.include_router(tokens.router)
app.include_router(collections_admin.router)


async def scheduler():
    schedule.every(6).hours.do(update_refresh_metadata)
    while True:
        await schedule.run_pending()
        await asyncio.sleep(60)


async def add_royalty():
    l = list(config.db.tokens.find())
    for token_id in range(len(l)):
        print(token_id)
        token = l[token_id]
        for i in range(5):
            params = {
                "jsonrpc": "2.0",
                "id": "dontcare",
                "method": "query",
                "params": {
                    "request_type": "call_function",
                    "account_id": token['contract_id'],
                    "method_name": "nft_token",
                    "args_base64": base64.b64encode(
                        f'{{"token_id":"{token["token_id"]}"}}'.encode("ascii")
                    ).decode('ascii'),
                    "finality": "final"}
            }
            try:
                async with aiohttp.ClientSession() as client_1:
                    async with client_1.post(config.main_near_link,
                                             json=params) as resp_1:
                        response = json.loads(await resp_1.text())
                        if resp_1.status == 200:
                            if 'error' not in response and 'error' not in response['result']:
                                token_ = json.loads(bytearray(response['result']['result']).decode('utf-8'))
                                try:
                                    token_ = Token(**token_).dict()
                                    new_royalty = await get_royalty(token['contract_id'], token['token_id'],
                                                                    token_['owner_id'])
                                    config.db.tokens.update_one({"_id": token['_id']},
                                                                {"$set": {"royalty": new_royalty}})
                                    break
                                except Exception as e:
                                    print(e, token, token_id, token['contract_id'])
            except Exception as e:
                print(f'check_token_on_blockchain err: {e}')
                await asyncio.sleep(0.5)


async def set_category():
    category = config.db.categories.find_one({"name": "art"})
    config.db.tokens.update_many({"collection_id": None},
                                 {"category": category['_id']})


async def parse_tokens_staking():
    i = 0
    for obj in config.db.tokens.find({'owner_id': {"$in": config.base_staking_account}}):
        i += 1
        print(i)
        if 'contract_staked_address' not in obj or obj['contract_staked_address'] == obj['owner_id']:
            is_staked_info = await check_if_token_is_staked(obj['token_id'], obj['contract_id'], obj)
            if is_staked_info is not None:
                history_data = {
                    "activity_id": ObjectId(),
                    "timestamp": str(datetime.datetime.now().timestamp()),
                    "buyer_id": is_staked_info["owner_id"],
                    "owner_id": obj["owner_id"],
                    "type": "refresh_metadata_owner_and_price_update",
                    "price": None
                }
                config.db.tokens.update_one({"_id": ObjectId(obj['_id'])},
                                            {"$set": is_staked_info, '$push': {"history": history_data}})
                config.db.users.update_one({"user_wallet": obj["owner_id"]},
                                           {'$pull': {"items_owned": {"token_id": obj['_id']}}})
                n_ = config.db.users.update_one({"user_wallet": is_staked_info['owner_id'],
                                                 "items_owned.token_id": {"$nin": [obj['_id']]}},
                                                {'$push': {"items_owned": {"token_id": obj['_id']}}})

                if n_.raw_result['n'] == 0 and is_staked_info['owner_id'] is not None:
                    await create_user_after_refresh(is_staked_info['owner_id'], obj["_id"], False)
            await asyncio.sleep(0.1)


@app.on_event('startup')
async def on_start():
    asyncio.create_task(scheduler())
    asyncio.create_task(check_tx_on_wamp())
    asyncio.create_task(parse_tokens_staking())

    # config.db.users.update_many({
    #     "$expr": {"$eq": ["$recent_change", "$date_created"]},
    #     "collections.0": {"$exists": 0},
    #     "activities.0": {"$exists": 0},
    #     "likes.0": {"$exists": 0},
    #     "avatar_url": None,
    #     "bio": None,
    #     "cover_url": None,
    #     "customURL": None,
    #     "description": None,
    #     "user_name": None,
    #     "verified": False,
    #     "email": None,
    #
    # },
    #     {"$set": {"was_logged_in": False}})

    # asyncio.create_task(set_category())
    # asyncio.create_task(add_royalty())
    # for collection in config.db.collections.find({"contract_address": {"$ne": None}}):
    #     await add_collection_to_approved(collection['contract_address'])
    # timestamp = str(datetime.datetime.now().timestamp())
    # config.db.tokens.update_many({"price": {"$ne": None}},
    #                              {"$set": {"price": None},
    #                               "$push": {"history": {"type": "delete_market_data",
    #                                                     "price": None,
    #                                                     "transaction_hash":
    #                                                         "2yJF6CKH2NipDGvLL9W5an3kTQKPst7eggzxZxUqD62V",
    #                                                     "owner_id": "higgsfield.near",
    #                                                     "timestamp": timestamp,
    #                                                     "activity_id": ObjectId()
    #                                                     }}})


if __name__ == "__main__":
    loop_main = asyncio.new_event_loop()
    config_server = Config(app=app, loop=loop_main, host=config.server_host, port=config.port)
    server = Server(config_server)
    loop_main.run_until_complete(server.serve())
