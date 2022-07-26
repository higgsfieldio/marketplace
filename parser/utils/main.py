import asyncio

import pytz

import config
from bson import ObjectId
import datetime
from PIL import Image, ImageSequence, ExifTags
from utils.black_list import words_black_list
import re
from moviepy.editor import VideoFileClip
from pymongo import ReturnDocument
import aiohttp
from cairosvg import svg2png
from typing import Optional
import requests
from utils import users as users_additional_funcs
from utils import statistics as statistics_additional_funcs
import base64
import json
import aioredis


async def check_if_token_is_staked(token_id: str, contract_address: str, data: dict):
    if data['owner_id'] == 'staking.paras.near':
        params = {
            "token_id": token_id,
            "collection_id": contract_address
        }
        for i in range(5):
            try:
                async with aiohttp.ClientSession() as client:
                    async with client.get('https://api-v2-mainnet.paras.id/token', params=params, ssl=False,
                                          timeout=15.0) as resp:
                        if resp.status == 200:
                            response = await resp.json()
                            if 'data' in response and 'results' in response['data'] \
                                    and len(response['data']['results']) != 0 \
                                    and 'is_staked' in response['data']['results'][0] \
                                    and response['data']['results'][0]['is_staked']:
                                return {
                                    "contract_staked_address": data['owner_id'],
                                    'owner_id': response['data']['results'][0]['owner_id'],
                                    'is_staked': True
                                }
                            elif 'data' in response and 'results' in response['data'] \
                                    and len(response['data']['results']) != 0:
                                return {
                                    "contract_staked_address": None,
                                    'is_staked': False,
                                    'owner_id': response['data']['results'][0]['owner_id']
                                }
            except Exception as e:
                print(f'check_if_token_is_staked err: {e}')
            await asyncio.sleep(0.3)
    elif data['owner_id'] == 'nearton-staking.near':
        data_ = {
            "jsonrpc": "2.0",
            "id": "dontcare",
            "method": "query",
            "params": {
                "request_type": "call_function",
                "account_id": data['owner_id'],
                "method_name": "get_token_owner",
                "args_base64": base64.b64encode(
                    f'{{"token_id": "{token_id}", '
                    f'"contract_id": "{contract_address}"}}'.encode("ascii")
                ).decode('ascii'),
                "finality": "final"}
        }
        for i in range(5):
            try:
                async with aiohttp.ClientSession() as client:
                    async with client.post(config.main_near_link, json=data_, ssl=False,
                                           timeout=15.0) as resp:
                        if resp.status == 200:
                            response = await resp.json()
                            owner = json.loads(bytearray(response['result']['result']).decode('utf-8'))
                            if owner is not None:
                                return {
                                    "contract_staked_address": data['owner_id'],
                                    'owner_id': owner,
                                    'is_staked': True
                                }
                            else:
                                return {
                                    "contract_staked_address": None,
                                    'is_staked': False,
                                    'owner_id': data['owner_id']
                                }
            except Exception as e:
                print(f'check_if_token_is_staked err: {e}')
            await asyncio.sleep(0.3)
    return None


async def check_text_in_black_list(text: str):
    for word in words_black_list:
        if text.replace(' ', '').strip().lower().count(word) != 0 \
                or re.sub(r'[^a-z ]', "", text.replace(' ', '').strip().lower()).count(word) != 0:
            print(word)
            return False
    return True


async def get_contract_id(obj, nft_contract_id: str):
    obj = \
        config.db.collections.find_one({"contract_address": nft_contract_id, "items.token_id": {"$nin": [obj["_id"]]}}) \
            if obj is not None \
            else config.db.collections.find_one({"contract_address": nft_contract_id})
    if obj is not None:
        return obj['_id']
    return None


async def get_new_token_info(token_id: str, nft_contract_id: str):
    params = {
        "jsonrpc": "2.0",
        "id": "dontcare",
        "method": "query",
        "params": {
            "request_type": "call_function",
            "account_id": nft_contract_id,
            "method_name": "nft_token",
            "args_base64": base64.b64encode(
                f'{{"token_id":"{token_id}"}}'.encode("ascii")
            ).decode('ascii'),
            "finality": "final"}
    }
    for i in range(5):
        try:
            async with aiohttp.ClientSession() as client_1:
                async with client_1.post(config.main_near_link,
                                         json=params) as resp_1:
                    if resp_1.status == 200:
                        response = json.loads(await resp_1.text())
                        if 'error' not in response and 'error' not in response['result']:
                            token = json.loads(bytearray(response['result']['result']).decode('utf-8'))
                            if token['owner_id'] in config.base_staking_account:
                                is_staked_info = await check_if_token_is_staked(token['token_id'], nft_contract_id,
                                                                                token)
                                if is_staked_info is not None:
                                    token.update(is_staked_info)
                                else:
                                    return None
                            return token
                        # In case of deleting contract account to delete all items connected to that contract
                        # elif ('error' in response
                        #       and 'wasm execution failed with error' in response['error']) \
                        #         or ('error' in response['result']
                        #             and 'wasm execution failed with error' in response['result']['error']):
                        #     token = config.db.tokens.find_one_and_update({'token_id': token_id,
                        #                                                   'contract_id': nft_contract_id},
                        #                                                   {"$set": {"owner_id": None}})
                        #     if token is not None:
                        #         config.db.users.update_one({'user_wallet': token['owner_id']},
                        #                                    {"$pull": {"items_owned": {'token_id': token['_id']}}})
        except Exception as e:
            print(f'get_new_token_info err: {e}')
        await asyncio.sleep(0.3)
    return None


async def get_market_data(token_id: str, nft_contract_id: str, token: dict):
    params = {
        "jsonrpc": "2.0",
        "id": "dontcare",
        "method": "query",
        "params": {
            "request_type": "call_function",
            "account_id": config.market_contract,
            "method_name": "get_market_data",
            "args_base64": base64.b64encode(
                f'{{"token_id":"{token_id}",'
                f'"nft_contract_id":"{nft_contract_id}"}}'.encode("ascii")
            ).decode('ascii'),
            "finality": "final"}
    }
    for i in range(5):
        try:
            async with aiohttp.ClientSession() as client_1:
                async with client_1.post(config.main_near_link,
                                         json=params) as resp_1:
                    if resp_1.status == 200:
                        response = json.loads(await resp_1.text())
                        if 'error' not in response and 'error' not in response['result']:
                            response = json.loads(bytearray(response['result']['result']).decode('utf-8'))
                            if response['owner_id'] == token['owner_id']:
                                return response
                        return None
        except Exception as e:
            print(f'get_market_data err: {e}')
        await asyncio.sleep(0.3)
    return None


async def get_approved_account_ids():
    redis = await aioredis.from_url(f"redis://{config.main_server_host}", encoding="utf8")

    db_check = await redis.get("v2testnet_approved_nft_contract_ids")
    if db_check is not None:
        return json.loads(db_check.decode("utf-8"))

    for i in range(5):
        try:
            params = {
                "jsonrpc": "2.0",
                "id": "dontcare",
                "method": "query",
                "params": {
                    "request_type": "call_function",
                    "account_id": config.market_contract,
                    "method_name": "approved_nft_contract_ids",
                    "args_base64": "e30=",
                    "finality": "final"}
            }
            async with aiohttp.ClientSession() as client:
                async with client.post(config.main_near_link,
                                       json=params, timeout=5.0) as resp_1:
                    response = json.loads(await resp_1.text())
                    if resp_1.status == 200 and 'error' not in response and 'error' not in response['result']:
                        loaded_js = json.loads(
                            bytearray(response['result']['result']).decode('utf-8'))
                        await redis.set("v2testnet_approved_nft_contract_ids", json.dumps(loaded_js),
                                        300)
                        return loaded_js
        except Exception as e:
            print(f"approved_nft_contract_ids err {e}")
            await asyncio.sleep(0.75)
    return None


async def get_small_user_object(obj: dict):
    user_id = obj['user_id']
    user_name = obj['user_name']
    avatar_url = None
    if obj['customURL'] is not None:
        user_id = obj['customURL']
    if obj['avatar_url'] is not None:
        avatar_url = obj['avatar_url']["size3"]

    return dict(user_id=user_id, avatar_url=avatar_url, user_name=user_name, verified=obj['verified'])


async def update_queries_in_db_after_refresh(update_queries: dict, user_wallet: str, user_tokens: list):
    updated_tokens = list()
    timestamp = str(datetime.datetime.now().timestamp())
    for key in update_queries.keys():
        for query in update_queries[key]:
            if query['type'] == 'update_one':
                query_ = config.db[key].find_one_and_update(query['find_query'], query['update_query'])
                if query_ is not None and key == 'tokens':
                    updated_tokens.append(query_["_id"])
                    if '$set' in query['update_query'] and 'collection_id' in query['update_query'] \
                            and query['update_query']['$set']['collection_id'] != query_['collection_id']:
                        if query_['collection_id'] is not None:
                            activity_id = ObjectId()
                            config.db[key].update_one({"_id": query_["_id"]},
                                                      {"$push": {
                                                          "history": {
                                                              "activity_id": activity_id,
                                                              "type": "collection_deleting",
                                                              "collection_id": query_['collection_id'],
                                                              "timestamp": timestamp,
                                                              "owner_id": query_['owner_id']
                                                          }}
                                                      })
                            config.db.collections.update_one(
                                {"_id": query_['collection_id'],
                                 "items.token_id": query_["_id"]},
                                {"$pull": {
                                    "items": {
                                        "token_id": query_['_id']}},
                                    "$push": {
                                        "history": {
                                            "token_id": query_['_id'],
                                            "activity_id": activity_id}}})
                        activity_id = ObjectId()
                        config.db[key].update_one({"_id": query_["_id"]},
                                                  {"$push": {
                                                      "history": {
                                                          "activity_id": activity_id,
                                                          "type": "collection_adding",
                                                          "collection_id": query['update_query']['$set']['collection_id'],
                                                          "timestamp": timestamp,
                                                          "owner_id": query_['owner_id']
                                                      }}})
                        config.db.collections.update_one(
                            {"_id": query['update_query']['$set']['collection_id'],
                             "items.token_id": {"$nin": [query_["_id"]]}},
                            {"$push": {
                                "items": {
                                    "token_id": query_['_id']},
                                "history": {
                                    "token_id": query_['_id'],
                                    "activity_id": activity_id}}})
            elif query['type'] == 'insert_one':
                find_query = query['find_query']
                query_ = query['update_query']
                elem = config.db[key].find_one_and_update(find_query, query_, upsert=True,
                                                          return_document=ReturnDocument.AFTER)
                n_ = config.db.users.update_one({"user_wallet": elem['owner_id'],
                                                 "items_owned.token_id": {"$nin": [elem['_id']]}},
                                                {'$push': {"items_owned": {"token_id": elem['_id']}}})

                if n_.raw_result['n'] == 0 and elem['owner_id'] is not None:
                    await create_user_after_refresh(elem['owner_id'], elem["_id"], False)

                if elem['collection_id'] is not None:
                    for elem in elem['history']:
                        if elem['type'] == 'collection_adding':
                            config.db.collections.update_one(
                                {"_id": elem['collection_id'],
                                 "items.token_id": {"$nin": [elem['_id']]}},
                                {"$push": {
                                    "items": {
                                        "token_id": elem['_id']},
                                    "history": {
                                        "token_id": elem['_id'],
                                        "activity_id": elem['activity_id']}}})
                            break
    [user_tokens.remove(token_id) for token_id in updated_tokens if token_id in user_tokens]
    for not_updated_id in user_tokens:
        token = config.db.tokens.find_one({"_id": not_updated_id})
        new_token_info = await get_new_token_info(token['token_id'], token["contract_id"])
        if new_token_info is not None:
            if new_token_info["owner_id"] != user_wallet:
                new_market_info = await get_market_data(token['token_id'], token["contract_id"], new_token_info)
                date_obj = datetime.datetime.now()
                update_query = dict()
                update_query['$set'] = dict()
                update_query["$push"] = dict()
                update_query["$set"]["price"] = None
                update_query["$push"]["history"] = {"activity_id": ObjectId(),
                                                    "timestamp": token['recent_change'],
                                                    "buyer_id": new_token_info["owner_id"],
                                                    "owner_id": token["owner_id"],
                                                    "type": "refresh_metadata_owner_and_price_update",
                                                    "price": None}
                if new_market_info is not None and token['price'] != new_market_info['price']:
                    update_query["$set"]["price"] = new_market_info["price"]
                    update_query["$push"]["history"]['price'] = new_market_info["price"]
                update_query["$set"]['owner_id'] = new_token_info["owner_id"]
                update_query["$set"]['recent_change'] = str(date_obj.timestamp())
                config.db.tokens.update_one({"_id": not_updated_id},
                                            update_query)
                n_ = config.db.users.update_one({"user_wallet": new_token_info["owner_id"]},
                                                {"$push": {"items_owned": {"token_id": not_updated_id}}})
                config.db.users.update_one({"user_wallet": token["owner_id"]},
                                           {"$pull": {"items_owned": {"token_id": not_updated_id}}})

                if n_.raw_result['n'] == 0 and new_token_info["owner_id"] is not None:
                    await create_user_after_refresh(new_token_info["owner_id"], not_updated_id, False)

                config.db.statistics.update_one(
                    {"name": "marketplace_purchase_near_stats",
                     "stats": {"$elemMatch": {
                         "date": date_obj.replace(hour=0, minute=0, second=0, microsecond=0)}}},
                    {"$inc": {
                        "stats.$.value":
                            int(update_query["$set"]["price"]) / 1000000000000000000000000
                            if update_query["$set"]["price"] is not None else 0}})
                config.db.statistics.update_one(
                    {"name": "marketplace_purchase_amount_stats",
                     "stats": {"$elemMatch": {
                         "date": date_obj.replace(hour=0, minute=0, second=0, microsecond=0)}}},
                    {"$inc": {
                        "stats.$.value": 1}})


async def update_queries_in_db_after_collection_refresh(update_queries: dict,
                                                        collection_id: ObjectId):
    timestamp = str(datetime.datetime.now().timestamp())
    for key in update_queries.keys():
        for query in update_queries[key]:
            if query['type'] == 'update_one':
                if '$set' not in query['update_query']:
                    query['update_query']['$set'] = dict()
                query['update_query']["$set"]['collection_id'] = collection_id
                elem = config.db[key].find_one_and_update(query['find_query'], query['update_query'])
                if key == 'tokens':
                    if elem['collection_id'] is not None:
                        activity_id = ObjectId()
                        config.db[key].update_one({"_id": elem["_id"]},
                                                  {"$push": {
                                                      "history": {
                                                          "activity_id": activity_id,
                                                          "type": "collection_deleting",
                                                          "collection_id": elem['collection_id'],
                                                          "timestamp": timestamp,
                                                          "owner_id": elem['owner_id']
                                                      }}
                                                  })
                        config.db.collections.update_one(
                            {"_id": elem['collection_id'],
                             "items.token_id": elem["_id"]},
                            {"$pull": {
                                "items": {
                                    "token_id": elem['_id']}},
                                "$push": {
                                    "history": {
                                        "token_id": elem['_id'],
                                        "activity_id": activity_id}}})
                    activity_id = ObjectId()
                    config.db[key].update_one({"_id": elem["_id"]},
                                              {"$push": {
                                                  "history": {
                                                      "activity_id": activity_id,
                                                      "type": "collection_adding",
                                                      "collection_id": ObjectId(collection_id),
                                                      "timestamp": timestamp,
                                                      "owner_id": elem['owner_id']
                                                  }}})
                    config.db.collections.update_one(
                        {"_id": collection_id,
                         "items.token_id": {"$nin": [elem["_id"]]}},
                        {"$push": {
                            "items": {
                                "token_id": elem['_id']},
                            "history": {
                                "token_id": elem['_id'],
                                "activity_id": activity_id}}})
            elif query['type'] == 'insert_one':
                query_ = query['update_query']
                query_['collection_id'] = collection_id
                elem = config.db[key].find_one({"token_id": query_['token_id'], "contract_id": query_['contract_id']})
                if elem is not None:
                    if elem['collection_id'] is not None:
                        activity_id = ObjectId()
                        config.db[key].update_one({"_id": elem["_id"]},
                                                  {"$push": {
                                                      "history": {
                                                          "activity_id": activity_id,
                                                          "type": "collection_deleting",
                                                          "collection_id": ObjectId(collection_id),
                                                          "timestamp": timestamp,
                                                          "owner_id": elem['owner_id']
                                                      }}
                                                  })
                        config.db.collections.update_one(
                            {"_id": elem['collection_id'],
                             "items.token_id": elem["_id"]},
                            {"$pull": {
                                "items": {
                                    "token_id": elem['_id']}},
                                "$push": {
                                    "history": {
                                        "token_id": elem['_id'],
                                        "activity_id": activity_id}}})
                    activity_id = ObjectId()
                    config.db[key].update_one({"_id": elem["_id"]},
                                              {"$push": {
                                                  "history": {
                                                      "activity_id": activity_id,
                                                      "type": "collection_adding",
                                                      "collection_id": ObjectId(collection_id),
                                                      "timestamp": timestamp,
                                                      "owner_id": elem['owner_id']
                                                  }},
                                              "$set": {"collection_id": ObjectId(collection_id)}})
                    config.db.collections.update_one(
                        {"_id": collection_id,
                         "items.token_id": {"$nin": [elem["_id"]]}},
                        {"$push": {
                            "items": {
                                "token_id": elem['_id']},
                            "history": {
                                "token_id": elem['_id'],
                                "activity_id": activity_id}}})
                    continue
                config.db[key].insert_one(query_)
                activity_id = ObjectId()
                config.db[key].update_one({"_id": query_["_id"]},
                                          {"$push": {
                                              "history": {
                                                  "activity_id": activity_id,
                                                  "type": "collection_adding",
                                                  "collection_id": ObjectId(collection_id),
                                                  "timestamp": timestamp,
                                                  "owner_id": query_['owner_id']
                                              }}})
                config.db.collections.update_one(
                    {"_id": collection_id,
                     "items.token_id": {"$nin": [query_["_id"]]}},
                    {"$push": {
                        "items": {
                            "token_id": query_['_id']},
                        "history": {
                            "token_id": query_['_id'],
                            "activity_id": activity_id}}})
                n_ = config.db.users.update_one({"user_wallet": query_['owner_id']},
                                                {'$push': {"items_owned": {"token_id": query_["_id"]}}})
                n = config.db.users.update_one({"user_wallet": query_['creator_id']},
                                               {'$push': {"items_created": {"token_id": query_["_id"]}}})
                if n_.raw_result['n'] == 0 and query_['owner_id'] is not None:
                    await create_user_after_refresh(query_['owner_id'], query_["_id"], False)
                if n.raw_result['n'] == 0 and query_['creator_id'] is not None:
                    await create_user_after_refresh(query_['creator_id'], query_["_id"], True)


async def get_account(account_id: str):
    params = {
        "jsonrpc": "2.0",
        "id": "dontcare",
        "method": "query",
        "params": {
            "request_type": "view_account",
            "finality": "final",
            "account_id": account_id
        }
    }
    response = requests.post(config.main_near_link,
                             json=params)
    if response.status_code == 200 and 'error' not in response.json() and 'error' not in response.json()['result']:
        return response.json()
    elif 'error' in response.json() and response.json()['error']['name'] == 'UNKNOWN_BLOCK':
        response_1 = requests.post(config.main_near_archival_link,
                                   json=params)
        if response_1.status_code == 200 and 'error' not in response_1.json():
            return response_1.json()
    return None


async def create_user_after_refresh(user_wallet, inserted_id, is_creator):
    if config.db.users.find_one({"user_wallet": user_wallet}) is not None:
        return None
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
            "personal": None,
        },
        "avatar_url": None,
        "cover_url": None,
        "items_owned": [dict({"token_id": inserted_id})] if not is_creator else list(),
        "items_created": await users_additional_funcs.get_created_items(user_wallet),
        "collections": list(),
        "activities": list(),
        "liked": list(),
        "bio": None,
        "customURL": None,
        "email": None,
        "verified": False,
        "was_logged_in": False,
        "date_created": timestamp,
        "recent_change": timestamp,
        "recent_metadata_change": timestamp}
    config.db.users.update_one({"user_wallet": user_wallet}, {"$set": insert_dict}, upsert=True)


async def update_queries_in_db(update_queries: dict):
    for key in update_queries.keys():
        for query in update_queries[key]:
            if query['type'] == 'update_one':
                config.db[key].update_one(query['find_query'], query['update_query'])
            elif query['type'] == 'insert_one' and key == 'tokens':
                find_query = query['find_query']
                query_ = query['update_query']
                elem = config.db[key].find_one_and_update(find_query, query_, upsert=True,
                                                          return_document=ReturnDocument.AFTER)
                n_ = config.db.users.update_one({"user_wallet": elem['owner_id'],
                                                 "items_owned.token_id": {"$nin": [elem['_id']]}},
                                                {'$push': {"items_owned": {"token_id": elem['_id']}}})
                n = config.db.users.update_one({"user_wallet": elem['creator_id'],
                                                "items_created.token_id": {"$nin": [elem['_id']]}},
                                               {'$push': {"items_created": {"token_id": elem['_id']}}})

                if n_.raw_result['n'] == 0 and elem['owner_id'] is not None:
                    await create_user_after_refresh(elem['owner_id'], elem["_id"], False)
                if n.raw_result['n'] == 0 and elem['creator_id'] is not None:
                    await create_user_after_refresh(elem['creator_id'], elem["_id"], True)

                if elem['collection_id'] is not None:
                    for elem_ in elem['history']:
                        if elem_['type'] == 'collection_adding':
                            config.db.collections.update_one(
                                {"_id": elem['collection_id']},
                                {"$push": {
                                    "items": {
                                        "token_id": elem['_id']},
                                    "history": {
                                        "token_id": elem['_id'],
                                        "activity_id": elem_['activity_id']}}})
                            break
                return elem


async def get_collection_small_object(collection: dict, creators: Optional[dict] = None):
    collection['likes'] = \
        list(config.db.tokens.aggregate([
            {"$match": {"collection_id": collection['_id']}},
            {"$group": {"_id": None, "sum": {"$sum": {"$size": "$likes"}}}}]))
    if len(collection['likes']) != 0:
        collection['likes'] = collection['likes'][0]['sum']
    else:
        collection['likes'] = 0
    collection['creator'] = await get_small_user_object(creators[collection['creator_id']])
    collection['items'] = list()
    for token in config.db.tokens.find({"collection_id": collection['_id']}).sort([("likes", -1)]).limit(5):
        collection['items'].append(await fill_in_single_token_object(token))
    for to_delete in ['activities', 'bio', 'cover_url', 'date_create', 'explicitContent', 'history',
                      'is_on_popular', 'statistics', 'creator_id']:
        if to_delete in collection:
            del collection[to_delete]

    return await delete_object_ids_from_dict(collection)


async def get_collection_for_market_page(collection_dict: dict):
    categories = dict()
    users = list()
    for token in collection_dict['items']:
        if token['category'] not in categories:
            categories[token['category']] = config.db.categories.find_one({"_id": ObjectId(token['category'])})
        if token['owner_id'] not in users:
            users.append(token['owner_id'])
        for activity in token['history']:
            if activity['type'] not in ['collection_adding',
                                        'collection_deleting',
                                        'refresh_metadata_price_update',
                                        'refresh_metadata_owner_and_price_update',
                                        'item_creating']:
                if 'owner_id' in activity:
                    if activity['owner_id'] not in users:
                        users.append(activity['owner_id'])
                if 'buyer_id' in activity:
                    if activity['buyer_id'] not in users:
                        users.append(activity['buyer_id'])
    dict_users = dict()
    [dict_users.update({elem['user_wallet']: elem})
     for elem in list(config.db.users.find({"user_wallet": {"$in": users}}))]
    for user in users:
        if user not in dict_users:
            dict_users[user] = None
    creator = config.db.users.find_one({"_id": collection_dict["creator_id"]})
    collection_dict["creator"] = await get_small_user_object(creator)
    collection_dict["activities"] = list()
    collection_dict["date_create"] = str(collection_dict["date_create"].timestamp())
    for to_delete in ['is_on_popular', 'history']:
        if to_delete in collection_dict:
            del collection_dict[to_delete]

    activities = list()
    for token_id in range(len(collection_dict['items'])):

        token_in_db = collection_dict['items'][token_id]
        token_dict = await fill_in_single_token_object(token_in_db, categories)
        token_dict["owner"] = None
        owner = dict_users[token_in_db['owner_id']]
        if owner is not None:
            token_dict["owner"] = await get_small_user_object(owner)
        for activity in token_in_db['history']:
            if activity['type'] not in ['collection_adding',
                                        'collection_deleting',
                                        'refresh_metadata_price_update',
                                        'refresh_metadata_owner_and_price_update',
                                        'item_creating']:
                item = dict(token=token_dict,
                            type=activity['type'],
                            price=activity['price'],
                            transaction_hash=activity['transaction_hash'],
                            activity_id=activity["activity_id"],
                            timestamp=activity['timestamp'])
                if 'owner_id' in activity:
                    owner = dict_users[activity['owner_id']]
                    if owner is not None:
                        owner = await get_small_user_object(owner)
                    item['owner'] = owner
                if 'buyer_id' in activity:
                    buyer = dict_users[activity['buyer_id']]
                    if buyer is not None:
                        buyer = await get_small_user_object(buyer)
                    item['buyer'] = buyer
                activities.append(item)
        collection_dict['items'][token_id] = token_dict

    collection_dict["activities"] = sorted(
        activities,
        key=lambda item_: float(item_['timestamp']))

    return await delete_object_ids_from_dict(collection_dict)


async def get_token_for_market_page(token: dict, tz_dict):
    tz = 'UTC'
    if 'tz' in tz_dict:
        tz = tz_dict['tz']
    token_dict = await fill_in_single_token_object(token)
    token_dict['token_contract_id'] = token['token_id']
    token_dict['contract_id'] = token['contract_id']
    token_dict['owner'] = None
    token_dict['creator'] = None
    token_dict["description"] = None
    token_dict["attributes"] = None
    token_dict['is_owner_and_creator'] = False
    token_dict['comments'] = list()
    token_dict["price_history"] = list()
    token_dict["bid_history"] = list()
    token_dict["sale_history"] = list()
    approved_account_ids = await get_approved_account_ids()
    token_dict["can_be_listed"] \
        = True if approved_account_ids is not None and token['contract_id'] in approved_account_ids else False
    owner = config.db.users.find_one({"items_owned.token_id": token["_id"]})
    creator = config.db.users.find_one({"user_wallet": token["creator_id"]})
    if owner is not None:
        token_dict["owner"] = await get_small_user_object(owner)

    if creator is not None:
        token_dict["creator"] = await get_small_user_object(creator)

    if owner == creator and owner is not None:
        token_dict['is_owner_and_creator'] = True

    for comment in token['comments']:
        user = config.db.users.find_one({"_id": comment['user_id']})
        new_comment = await get_small_user_object(user)
        new_comment['text'] = comment['text']
        new_comment['timestamp'] = comment['timestamp']
        token_dict['comments'].append(new_comment)

    if "attributes" in token:
        token_dict['attributes'] = token['attributes']
    elif "reference" in token and token["reference"] is not None:
        if "description" in token['reference']:
            token_dict["description"] = token["reference"]["description"]
        if "attributes" in token['reference']:
            token_dict["attributes"] = token["reference"]["attributes"]

    if token_dict['collection_id'] is not None:
        collection = config.db.collections.find_one({"_id": ObjectId(token_dict['collection_id'])})
        if collection is not None:
            token_dict['collection'] = dict(name=collection['name'], avatar_url=collection['avatar_url'],
                                            _id=collection['_id'])

    price_history = {}
    sale_history = []

    async def filter_set(history):
        async def iterator_func(x):
            date_obj = datetime.datetime.fromtimestamp(float(x.get("timestamp")), tz=pytz.timezone(tz)).date()
            date = str(date_obj)
            if x.get("type") in ['add_market_data', 'update_market_data', 'refresh_metadata_price_update'] \
                    and isinstance(x.get('price'), str):
                if date in price_history and price_history[date] >= int(x.get('price')):
                    return False
                price_history[date] = int(x.get('price'))
                return True
            elif x.get('type') in ['resolve_purchase',
                                   'refresh_metadata_owner_and_price_update'] and isinstance(x.get('price'), str):
                sale_history.append(x)
                if date in price_history and date_obj < datetime.datetime.now(tz=pytz.timezone(tz)).date():
                    next_date = \
                        str((datetime.datetime.fromtimestamp(
                            float(x.get("timestamp")),
                            tz=pytz.timezone(tz)) + datetime.timedelta(days=1)
                             ).date())
                    price_history[next_date] = 0
                elif date_obj < datetime.datetime.now(tz=pytz.timezone(tz)).date():
                    price_history[date] = 0
            elif x.get('type') == 'delete_market_data':
                price_history[date] = 0

            return False

        [await iterator_func(elem_) for elem_ in history]

    token['history'] = sorted(token['history'],
                              key=lambda item: datetime.datetime.fromtimestamp(float(item['timestamp']),
                                                                               tz=pytz.timezone(tz)))
    await filter_set(token['history'])
    price_history = dict(reversed(list(price_history.items())))

    if len(price_history.values()) > 0:

        token_dict['price_history'] = {
            "week": await statistics_additional_funcs.get_price_history_for_time_without_changing(price_history, 7, tz),
            "month": await statistics_additional_funcs.get_price_history_for_time_without_changing(price_history, 30,
                                                                                                   tz)
        }

    for sale in sale_history:
        if 'owner_id' in sale:
            owner = config.db.users.find_one({"user_wallet": sale['owner_id']})
            if owner is not None:
                owner = await get_small_user_object(owner)
            sale['owner'] = owner
        for to_delete in ['type', 'transaction_hash', 'buyer_id', 'owner_id',
                          'is_on_popular', 'statistics']:
            if to_delete in sale:
                del sale[to_delete]
        token_dict['sale_history'].append(sale)

    token_dict['views'] = token['views']
    return await delete_object_ids_from_dict(token_dict)


async def fill_in_single_token_object(token: dict, categories: Optional[dict] = None):
    new_token = dict()
    new_token["price"] = token['price']
    new_token['is_on_sale'] = False
    new_token["rank"] = token['rank']
    new_token['score'] = None
    if new_token['rank'] is None and token['reference'] is not None and 'rank' in token['reference']:
        new_token['rank'] = token['reference']['rank']
    if 'score' in token:
        new_token['score'] = token['score']
    new_token["category"] = None
    new_token['collection_id'] = None
    new_token['token_id'] = str(token["_id"])
    new_token["preview_url"] = config.server_link + '/tokens/get_file/' + token['preview']['size0']
    new_token["likes"] = len(token["likes"])
    new_token["name"] = token["name"]
    new_token["royalty"] = None
    new_token["explicitContent"] = token['explicitContent'] if "explicitContent" in token else False
    if token["royalty"] is None:
        try:
            royalty = token['reference']['properties']['creators']
            new_royalty = list()
            for elem in royalty:
                if elem['share'] != 0:
                    new_royalty.append(dict(wallet=elem['address'], value=elem['share']))
            if len(new_royalty) != 0:
                new_token["royalty"] = new_royalty
        except Exception as e:
            print(f'exception royalty: {e}')
    else:
        try:
            new_royalty = list()
            for k, v in token["royalty"].items():
                if v != 0:
                    new_royalty.append(dict(wallet=k, value=v))
            if len(new_royalty) != 0:
                new_token["royalty"] = new_royalty
        except Exception as e:
            print(f'exception royalty: {e}')
            new_token["royalty"] = token["royalty"]

    if token['category'] is not None:
        if categories is None or token['category'] not in categories:
            category = config.db.categories.find_one({"_id": token['category']})
            if category is not None:
                new_token["category"] = category['name'].lower()
        else:
            new_token["category"] = categories[token['category']]['name'].lower()

    if 'collection_id' in token and token['collection_id'] is not None:
        new_token['collection_id'] = str(token['collection_id'])

    if token['price'] is not None:
        new_token['is_on_sale'] = True
    return new_token


async def fill_in_user_object(obj: dict):
    categories = dict()
    users = list()
    new_obj = obj.copy()
    new_obj['items_owned'] = list()
    new_obj['items_created'] = list()
    new_obj['items_on_sale'] = list()
    new_obj['activities'] = list()
    new_obj['notifications'] = list()
    new_obj['collections'] = list()

    if 'referral' in obj and 'level' in obj['referral']:
        new_obj['referral_active'] = True
    else:
        new_obj['referral_active'] = False

    items_owned = list(config.db.tokens.find({"_id": {"$in": [item['token_id'] for item in obj["items_owned"]]}}))
    items_created = list(config.db.tokens.find({"_id": {"$in": [item['token_id'] for item in obj["items_created"]]}}))
    collections = list(
        config.db.collections.find({"_id": {"$in": [item['collection_id'] for item in obj["collections"]]}})
    )

    activities = list(
        config.db.tokens.aggregate(
            [
                {
                    "$match": {
                        "_id": {
                            "$in": [
                                elem['token_id']
                                for elem in obj["activities"]
                            ]
                        }
                    }
                },
                {
                    "$unwind": "$history"
                },
                {
                    "$match": {
                        "history.activity_id": {
                            "$in": [
                                elem['activity_id']
                                for elem in obj["activities"]
                            ]
                        }
                    }
                }

            ]
        )
    )

    for token in items_owned + items_created + activities:
        if token['category'] not in categories:
            categories[token['category']] = config.db.categories.find_one({"_id": ObjectId(token['category'])})
        if token['owner_id'] not in users:
            users.append(token['owner_id'])
        if isinstance(token['history'], list):
            for activity in token['history']:
                if activity['type'] not in ['collection_adding',
                                            'collection_deleting',
                                            'refresh_metadata_price_update',
                                            'refresh_metadata_owner_and_price_update',
                                            'item_creating']:
                    if 'owner_id' in activity:
                        if activity['owner_id'] not in users:
                            users.append(activity['owner_id'])
                    if 'buyer_id' in activity:
                        if activity['buyer_id'] not in users:
                            users.append(activity['buyer_id'])
        elif isinstance(token['history'], dict):
            activity = token['history']
            if activity['type'] not in ['collection_adding',
                                        'collection_deleting',
                                        'refresh_metadata_price_update',
                                        'refresh_metadata_owner_and_price_update',
                                        'item_creating']:
                if 'owner_id' in activity:
                    if activity['owner_id'] not in users:
                        users.append(activity['owner_id'])
                if 'buyer_id' in activity:
                    if activity['buyer_id'] not in users:
                        users.append(activity['buyer_id'])

    creators = list()
    for collection in collections:
        if collection['creator_id'] not in creators:
            creators.append(collection['creator_id'])

    dict_users = dict()
    [dict_users.update({elem['user_wallet']: elem, elem["_id"]: elem})
     for elem in list(config.db.users.find({"user_wallet": {"$in": users}}))]
    [dict_users.update({elem['user_wallet']: elem, elem["_id"]: elem})
     for elem in list(config.db.users.find({"_id": {"$in": creators}}))]
    for user in users:
        if user not in dict_users:
            dict_users[user] = None

    for creator in creators:
        if creator not in dict_users:
            dict_users[creator] = None

    for token in items_owned:
        filled_id = await fill_in_single_token_object(token, categories)
        new_obj['items_owned'].append(filled_id)
        if token['price'] is not None:
            new_obj['items_on_sale'].append(filled_id)

    for token in items_created:
        filled_id = await fill_in_single_token_object(token, categories)
        new_obj['items_created'].append(filled_id)

    for collection in collections:
        collection = await get_collection_small_object(collection, dict_users)

        new_obj['collections'].append(collection)

    new_activities = list()
    for token in activities:
        if token['history']['type'] not in ['collection_adding', 'collection_deleting', 'item_creating',
                                            'refresh_metadata_price_update',
                                            'refresh_metadata_owner_and_price_update',
                                            ]:
            token_dict = await fill_in_single_token_object(token, categories)
            item = dict(token=token_dict,
                        type=token['history']['type'],
                        price=token['history']['price'],
                        transaction_hash=token['history']['transaction_hash'],
                        activity_id=token['history']["activity_id"],
                        timestamp=token['history']['timestamp'])
            if 'owner_id' in token['history']:
                owner = dict_users[token['history']['owner_id']]
                if owner is not None:
                    owner = await get_small_user_object(owner)
                item['owner'] = owner
            if 'buyer_id' in token['history']:
                buyer = dict_users[token['history']['buyer_id']]
                if buyer is not None:
                    buyer = await get_small_user_object(buyer)
                item['buyer'] = buyer
                item['is_buyer'] = token['history']['buyer_id'] == obj['user_wallet']
            new_activities.append(item)
    new_obj['activities'] = sorted(
        new_activities,
        key=lambda item: datetime.datetime.fromtimestamp(float(item['timestamp']))
    )

    return await delete_object_ids_from_dict(new_obj)


async def fill_in_object_ids_list(the_list: list):
    for elem_id in range(len(the_list)):
        if isinstance(the_list[elem_id], dict):
            the_list[elem_id] = await fill_in_object_ids_dict(the_list[elem_id])
        elif isinstance(the_list[elem_id], list):
            the_list[elem_id] = await fill_in_object_ids_list(the_list[elem_id])
    return the_list


async def fill_in_object_ids_dict(the_dict: dict):
    for elem in the_dict.keys():
        if elem[-3:] == '_id' and not ObjectId.is_valid(the_dict[elem]):
            the_dict[elem] = ObjectId()
        elif elem[-3:] == '_id' and ObjectId.is_valid(the_dict[elem]):
            the_dict[elem] = ObjectId(the_dict[elem])
        elif isinstance(the_dict[elem], dict):
            the_dict[elem] = await fill_in_object_ids_dict(the_dict[elem])
        elif isinstance(the_dict[elem], list):
            the_dict[elem] = await fill_in_object_ids_list(the_dict[elem])
    return the_dict


async def find_by_key_in_dict(the_dict: dict, key: str):
    for elem in the_dict.keys():
        if elem == key:
            return the_dict[elem]
        elif isinstance(the_dict[elem], dict):
            elms = await find_by_key_in_dict(the_dict[elem], key)
            if elms is not None:
                return elms
        elif isinstance(the_dict[elem], list):
            for list_elem in the_dict[elem]:
                elms = await find_by_key_in_dict(list_elem, key)
                if elms is not None:
                    return elms


async def delete_object_ids_from_list(the_lists: list):
    for elem_id in range(len(the_lists)):
        if isinstance(the_lists[elem_id], ObjectId):
            the_lists[elem_id] = str(the_lists[elem_id])
        elif isinstance(the_lists[elem_id], dict):
            the_lists[elem_id] = await delete_object_ids_from_dict(the_lists[elem_id])
        elif isinstance(the_lists[elem_id], list):
            the_lists[elem_id] = await delete_object_ids_from_list(the_lists[elem_id])
    return the_lists


async def delete_object_ids_from_dict(the_dict: dict):
    for elem in the_dict.keys():
        if isinstance(the_dict[elem], ObjectId):
            the_dict[elem] = str(the_dict[elem])
        elif isinstance(the_dict[elem], dict):
            the_dict[elem] = await delete_object_ids_from_dict(the_dict[elem])
        elif isinstance(the_dict[elem], list):
            the_dict[elem] = await delete_object_ids_from_list(the_dict[elem])
    return the_dict


async def save_svg_image(text: str, identifier: str, size: (int, int), img_type: str,
                         folder: str):
    try:
        new_file_name = f'{datetime.datetime.now().timestamp()}-{img_type}-' \
                        f'{size[0]}-{size[1]}-{identifier}.png'
        svg2png(bytestring=text.encode(), write_to=config.app_location + f'/files/{folder}/' + new_file_name)
        return new_file_name
    except Exception as e:
        print(f'svg2png err: {e}')
    return None


async def save_new_images(filename: str, content_type: str, identifier: str, size: (int, int), img_type: str,
                          folder: str):
    content_type_splitted = content_type.split('/')
    if content_type_splitted[0] == 'image':
        new_file_name = f'{datetime.datetime.now().timestamp()}-{img_type}-' \
                        f'{size[0]}-{size[1]}-{identifier}.{filename.split(".")[-1]}'
        image = Image.open(f'files/{folder}/{img_type}-{identifier}.{filename.split(".")[-1]}')
        try:
            for orientation in ExifTags.TAGS.keys():
                if ExifTags.TAGS[orientation] == 'Orientation': break
            exif = dict(image._getexif().items())

            if exif[orientation] == 3:
                image = image.rotate(180, expand=True)
            elif exif[orientation] == 6:
                image = image.rotate(270, expand=True)
            elif exif[orientation] == 8:
                image = image.rotate(90, expand=True)
        except Exception:
            pass

        if content_type_splitted[1] != 'gif':
            image.thumbnail(size)
            image.save(config.app_location + f'/files/{folder}/' + new_file_name,
                       optimize=True, quality=100)
        else:
            frames = ImageSequence.Iterator(image)

            def thumbnails(frames_):
                for frame in frames_:
                    thumbnail = frame.copy().convert("RGBA")
                    thumbnail.thumbnail(size)
                    yield thumbnail

            frames = thumbnails(frames)

            om = next(frames)
            om.info = image.info
            om.save(config.app_location + f'/files/{folder}/' + new_file_name,
                    save_all=True, append_images=list(frames), loop=0, quality=100)

        return new_file_name
    elif content_type_splitted[0] == 'video':
        print(f'VIDEO ')
        new_file_name = f'{datetime.datetime.now().timestamp()}-{img_type}-' \
                        f'{size[0]}-{size[1]}-{identifier}.gif'
        clip = VideoFileClip(config.app_location + f'/files/{folder}/{img_type}-{identifier}.{filename.split(".")[-1]}')
        clip = clip.subclip(0, 3).resize(width=size[1])
        clip.write_gif(config.app_location + f'/files/{folder}/' + new_file_name, program='ffmpeg', fps=15)
        return new_file_name
    return None
