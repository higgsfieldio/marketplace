import asyncio

import pytz

import config
from bson import ObjectId, Decimal128
from utils import statistics as statistics_additional_funcs
from utils.black_list import words_black_list
import datetime
from PIL import Image, ImageSequence, ExifTags
import os
from moviepy.editor import VideoFileClip
from pymongo import ReturnDocument
import aiohttp
from cairosvg import svg2png
from typing import Optional
import base64
import json
import re
import aioredis
from fastapi import Request


async def check_text_in_black_list(text: str):
    for word in words_black_list:
        if text.replace(' ', '').strip().lower().count(word) != 0 \
                or re.sub(r'[^a-z ]', "", text.replace(' ', '').strip().lower()).count(word) != 0:
            print(word)
            return False
    return True


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
    async with aiohttp.ClientSession() as client_1:
        async with client_1.post(config.main_near_link,
                                 json=params) as resp_1:
            if resp_1.status == 200:
                response = json.loads(await resp_1.text())
                if 'error' not in response and 'error' not in response['result']:
                    response = json.loads(bytearray(response['result']['result']).decode('utf-8'))
                    return response
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
    redis = await aioredis.from_url(f"redis://{config.internal_server_host}", encoding="utf8")

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
                config.db.users.update_one({"user_wallet": elem['owner_id'],
                                            "items_owned.token_id": {"$nin": [elem['_id']]}},
                                           {'$push': {"items_owned": {"token_id": elem['_id']}}})
                config.db.users.update_one({"user_wallet": elem['creator_id'],
                                            "items_created.token_id": {"$nin": [elem['_id']]}},
                                           {'$push': {"items_created": {"token_id": elem['_id']}}})
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


async def get_collection_small_object(collection: dict, creators: dict, range_volume: Optional[str] = None):
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
    collection['customURLorID'] = collection['_id'] if 'customURL' not in collection or collection['customURL'] is None \
        else collection['customURL']
    tokens = list(config.db.tokens.find({"collection_id": collection['_id']}).sort([("likes", -1)]).limit(5))

    for token in tokens:
        new_token = dict()
        new_token['_id'] = token['_id']
        new_token["preview_url"] = config.server_link + '/tokens/get_file/' + token['preview']['size0']
        new_token["explicitContent"] = token['explicitContent'] if "explicitContent" in token else False
        collection['items'].append(new_token)
    if range_volume is not None:
        collection['statistic_volume'] = collection['statistics'][range_volume.split('.')[1]]['volume']
    for to_delete in ['activities', 'bio', 'cover_url', 'date_create', 'explicitContent', 'history',
                      'is_on_popular', 'statistics', 'creator_id']:
        if to_delete in collection:
            del collection[to_delete]

    return await delete_object_ids_from_dict(collection)


async def get_contract_id(obj, nft_contract_id: str):
    obj = \
        config.db.collections.find_one({"contract_address": nft_contract_id, "items.token_id": {"$nin": [obj["_id"]]}}) \
            if obj is not None \
            else config.db.collections.find_one({"contract_address": nft_contract_id})
    if obj is not None:
        return obj['_id']
    return None


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

    collection_dict['customURLorID'] = collection_dict['_id'] if 'customURL' not in collection_dict \
                                                                 or collection_dict['customURL'] is None \
        else collection_dict['customURL']

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
    elif token['metadata']['extra'] is not None:
        try:
            token_dict["attributes"] = json.loads(token['metadata']['extra'])['attributes']
        except Exception as e:
            print(f'attrs json load err: {e}')

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


async def check_code_in_request(request: Request, user_wallet: str, was_logged_in: bool):
    if not was_logged_in and 'x-referral-code' in request.headers and request.headers['x-referral-code']:
        code = request.headers['x-referral-code']
        father_referral_link = config.db.referral_links.find_one({"code": code})
        if father_referral_link is not None:
            father_referral = config.db.users.find_one({"_id": father_referral_link['creator_id']})
            data = {
                "method": "add_new_child_referral_to_father",
                "params": {"father_referral": father_referral['user_wallet'],
                           "child_referral": user_wallet,
                           "code": code},

                "attached_gas": 300000000000000,
                "attached_tokens": 1
            }
            async with aiohttp.ClientSession() as client:
                await client.post(f'http://{config.internal_server_host}:{config.api_tx_sing_port}/new-tx',
                                  json=data)


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
        elif isinstance(the_lists[elem_id], Decimal128):
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
        elif isinstance(the_dict[elem], Decimal128):
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


async def delete_existing_photos(obj: dict, img_type: str, folder: str):
    for img in obj[img_type]:
        try:
            os.remove(config.app_location + f'/files/{folder}/' + obj[img_type][img])
        except FileNotFoundError as e:
            print(e)
