import requests
import aiohttp
import config
from fastapi import HTTPException
import json
from utils import contract_methods
import asyncio
from utils import main as main_additional_funcs
from typing import Optional
from bson import ObjectId
import datetime
import os
import base64
from models import tokens as tokens_models


async def save_file(media: str, token_id: str, contract_id: str, transaction_hash):
    if transaction_hash is None:
        tries = config.tries_for_getting_json_token
        timeout = config.timeout_for_getting_json_token
        sleep = 0.2
    else:
        tries = 10
        timeout = 15
        sleep = 2
    for try_id in range(tries):
        try:
            async with aiohttp.ClientSession() as client:
                async with client.get(media, timeout=timeout) as resp:
                    if resp.status == 200:
                        filename = f'files/tokens/token-{contract_id}_{token_id}.{resp.content_type.split("/")[1]}'
                        if 'svg' not in resp.content_type:
                            file_read = await resp.read()
                            if len(file_read) > 20971520:
                                return None
                            with open(filename,
                                      'wb') as file:
                                file.write(file_read)
                            token = await main_additional_funcs.save_new_images(resp.content_type.replace('/', '.'),
                                                                                resp.content_type,
                                                                                f'{contract_id}_{token_id}',
                                                                                (600, 600), 'token',
                                                                                'tokens')
                            os.remove(filename)
                        else:
                            text = await resp.text()
                            if len(text) > 20971520:
                                return None
                            token = await main_additional_funcs.save_svg_image(text,
                                                                               f'{contract_id}_{token_id}',
                                                                               (600, 600), 'token',
                                                                               'tokens'
                                                                               )
                        return token
        except Exception as e:
            print(e)
        if try_id == tries - 1:
            return None
        else:
            await asyncio.sleep(sleep)
    return None


async def get_creator(creators):
    if isinstance(creators, list) and len(creators) == 1 and isinstance(creators[0], dict) and 'address' in creators[0]:
        return creators[0]['address']

    elif isinstance(creators, dict) and 'address' in creators:
        return creators['address']


async def analyze_reference_obj(link: str, obj: dict, transaction_hash: Optional[str] = None):
    if transaction_hash is None:
        tries = config.tries_for_getting_json_token
        timeout = config.timeout_for_getting_json_token
        sleep = 0.2
    else:
        tries = 10
        timeout = 10
        sleep = 1
    for try_id in range(tries):
        try:
            async with aiohttp.ClientSession() as client_1:
                async with client_1.get(link,
                                        timeout=timeout) as resp_1:
                    if resp_1.status == 200:
                        response = json.loads(await resp_1.text())
                        if isinstance(response, list) and len(response) > 0:
                            response = response[0]
                        obj['reference'] = response
                        category_in_response = await main_additional_funcs.find_by_key_in_dict(response, 'category')
                        creators = await main_additional_funcs.find_by_key_in_dict(response, 'creators')
                        creator_id = await main_additional_funcs.find_by_key_in_dict(response, 'creator_id')
                        collection_id = await main_additional_funcs.find_by_key_in_dict(response, 'collection_id')
                        explicitContent = await main_additional_funcs.find_by_key_in_dict(response, 'explicitContent')
                        rank = await main_additional_funcs.find_by_key_in_dict(response, 'rank')
                        if category_in_response is not None and isinstance(category_in_response, str):
                            if category_in_response.lower() in config.available_categories:
                                category = config.db.categories.find_one({"name": category_in_response.lower()})
                                obj['category'] = category["_id"]
                        if creators is not None and not isinstance(creators, str):
                            creator = await get_creator(creators)
                            if creator is not None:
                                obj['creator_id'] = creator
                                if ObjectId.is_valid(collection_id):
                                    user = config.db.users.find_one({"user_wallet": creator})
                                    if user is not None and config.db.collections.find_one(
                                            {"_id": ObjectId(collection_id), "creator_id": user["_id"]}):
                                        obj['collection_id'] = ObjectId(collection_id)
                                        obj['history'].append({
                                            "activity_id": ObjectId(),
                                            "type": "collection_adding",
                                            "collection_id": ObjectId(collection_id),
                                            "timestamp": obj['recent_change'],
                                            "owner_id": obj['owner_id']
                                        })

                        if creator_id is not None and isinstance(creator_id, str) and 'creator_id' not in obj:
                            obj['creator_id'] = creator_id
                            if ObjectId.is_valid(collection_id):
                                user = config.db.users.find_one({"user_wallet": creator})
                                if user is not None and config.db.collections.find_one(
                                        {"_id": ObjectId(collection_id), "creator_id": user["_id"]}):
                                    obj['collection_id'] = ObjectId(collection_id)
                                    obj['history'].append({
                                        "activity_id": ObjectId(),
                                        "type": "collection_adding",
                                        "collection_id": ObjectId(collection_id),
                                        "timestamp": obj['recent_change'],
                                        "owner_id": obj['owner_id']
                                    })

                        if rank is not None and isinstance(rank, str):
                            obj['rank'] = rank
                        if explicitContent is not None and isinstance(explicitContent, bool):
                            obj['explicitContent'] = explicitContent
                        return obj
        except Exception as e:
            print(e)
        if try_id == tries - 1:
            return None
        else:
            await asyncio.sleep(sleep)
    return None


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
    raise HTTPException(status_code=400, detail='Account not found')


async def check_if_key_is_available(account_id: str, pub_key: str):
    params = {
        "jsonrpc": "2.0",
        "id": "dontcare",
        "method": "query",
        "params": {
            "request_type": "view_access_key",
            "finality": "final",
            "account_id": account_id,
            "public_key": pub_key
        }
    }
    try:
        async with aiohttp.ClientSession() as client:
            async with client.post(config.main_near_link,
                                   json=params) as resp:
                response = json.loads(await resp.text())
                if resp.status == 200 and 'error' not in response and 'error' not in response['result']:
                    return True
                elif 'error' in response and response['error']['name'] == 'UNKNOWN_BLOCK':
                    async with aiohttp.ClientSession() as client_1:
                        async with client_1.post(config.main_near_link,
                                                 json=params) as resp_1:
                            response = json.loads(await resp_1.text())
                            if response['result']['permission']['FunctionCall']['receiver_id'] \
                                    == config.market_contract:
                                return True
    except Exception as e:
        print(e)
    return False


async def get_royalty(contract_id: str, token_id: str, owner_id: str):
    royalty = None
    data = {
        "jsonrpc": "2.0",
        "id": "dontcare",
        "method": "query",
        "params": {
            "request_type": "call_function",
            "account_id": contract_id,
            "method_name": "nft_payout",
            "args_base64": base64.b64encode(
                f'{{"token_id":"{token_id}","balance": "10000", "max_len_payout": 10}}'.encode("ascii")
            ).decode('ascii'),
            "finality": "final"}
    }
    for i in range(5):
        try:
            async with aiohttp.ClientSession() as client:
                async with client.post(config.main_near_link, json=data, timeout=5.0) as resp:
                    if resp.status == 200:
                        response = await resp.json()
                        if 'error' not in response and 'error' not in response['result']:
                            royalty = json.loads(bytearray(response['result']['result']).decode('utf-8'))['payout']
                            if owner_id != contract_id:
                                del royalty[owner_id]
                            else:
                                royalty[owner_id] = 10000 - int(royalty[owner_id])
                            new_royalty = dict()
                            for k, v in royalty.items():
                                new_royalty[k] = int(v)
                            if new_royalty != {}:
                                return new_royalty
        except Exception as e:
            print(f'downloading royalty err: {e}; {royalty}; {contract_id}_{token_id}')
        await asyncio.sleep(0.5)
    return None


async def check_transaction(transaction_hash: str, account_id: str):
    market_change_methods = {"add_market_data": contract_methods.add_market_data,
                             "update_market_data": contract_methods.update_market_data,
                             "resolve_purchase": contract_methods.resolve_purchase,
                             "delete_market_data": contract_methods.delete_market_data,
                             "nft_transfer": contract_methods.nft_transfer,
                             "nft_create": nft_create,
                             "nft_mint": nft_create,
                             "storage_referral_deposit": contract_methods.storage_referral_deposit,
                             "add_new_child_referral_to_father": contract_methods.add_new_child_referral_to_father,
                             "update_level_referral_father": contract_methods.update_level_referral_father}
    params = {
            "jsonrpc": "2.0",
            "id": "dontcare",
            "method": "tx",
            "params": [transaction_hash, account_id]
        }
    async with aiohttp.ClientSession() as client_1:
        async with client_1.post(config.main_near_link,
                                 json=params) as resp_1:
            if resp_1.status == 200:
                response = json.loads(await resp_1.text())
                result_keys = list(response['result']['status'].keys())
                if 'SuccessValue' in result_keys:
                    receipts_outcome = response['result']['receipts_outcome']
                    return_ = None
                    logs_to_check = list()
                    for receipt_outcome_id in range(len(receipts_outcome)):
                        receipt_outcome = receipts_outcome[receipt_outcome_id]['outcome']['logs']
                        receipt_executor = receipts_outcome[receipt_outcome_id]['outcome']['executor_id']
                        if receipt_executor == config.market_contract \
                                or receipt_executor == config.nft_contract \
                                or config.db.tokens.find_one({"contract_id": receipt_executor}) is not None:
                            for item in receipt_outcome:
                                try:
                                    log = json.loads(item.replace('EVENT_JSON:', ''))
                                except Exception as e:
                                    print(f'literal_eval error: "{e}"')
                                    print(f'item: "{item.replace("EVENT_JSON:", "")}"')
                                    continue
                                print(log)
                                if 'type' in log and log['type'] in market_change_methods:
                                    logs_to_check.append(dict(type=log['type'], log=log,
                                                              receipt_executor=receipt_executor))

                                elif 'event' in log and log['event'] in market_change_methods:
                                    logs_to_check.append(dict(type=log['event'], log=log['data'][0],
                                                              receipt_executor=receipt_executor))

                    for log in logs_to_check:
                        if log['type'] == 'resolve_purchase':
                            return await market_change_methods[log['type']](log['log'],
                                                                            transaction_hash)
                    for log in logs_to_check:
                        return__ = await market_change_methods[log['type']](log['log'],
                                                                            transaction_hash,
                                                                            log['receipt_executor'])
                        if return__ is not None and return_ is None:
                            return_ = return__.copy()
                    return return_
            else:
                raise ValueError('No answer from rpc.near')


async def insert_new_token_or_update_existed(token: dict, contract: str,  transaction_hash: Optional[str] = None,
                                             royalty: Optional[dict] = None):
    timestamp = str(datetime.datetime.now().timestamp())
    token['category'] = None
    token['reference'] = None
    token['price'] = None
    category = config.db.categories.find_one({"name": "art"})
    token['category'] = category["_id"]
    token['creator_id'] = None
    token['collection_id'] = None
    token['rank'] = None
    token['views'] = 0
    token['contract_id'] = contract
    token['likes'] = list()
    token['explicitContent'] = False
    token['history'] = [{
        "type": "item_creating",
        "activity_id": ObjectId(),
        "timestamp": timestamp,
        "owner_id": token['owner_id']
    }]
    token["name"] = token['metadata']['title']
    token['comments'] = list()
    token['recent_change'] = timestamp
    new_token_dict = dict()
    new_token_dict['$push'] = dict()
    new_token_dict['$set'] = dict()
    if token['royalty'] is None:
        token['royalty'] = royalty
        new_token_dict['$set']['royalty'] = royalty
    else:
        new_token_dict['$set']['royalty'] = token['royalty']
    new_token_dict['$set']['recent_change'] = token['recent_change']
    obj = config.db.tokens.find_one({"token_id": token['token_id'],
                                     "contract_id": contract})
    market_data = await main_additional_funcs.get_market_data(token['token_id'], contract, token)
    if market_data is not None:
        new_token_dict['$set']['price'] = market_data['price']
        token['price'] = market_data['price']
        if obj is not None and obj['price'] != market_data['price']:
            new_token_dict['$push']['history'] = dict()
            new_token_dict['$push']['history']['$each'] \
                = [{"activity_id": ObjectId(),
                    "timestamp": token['recent_change'],
                    "price": market_data['price'],
                    "type": "refresh_metadata_price_update"}]
    elif obj is not None and obj['price'] is not None:
        new_token_dict['$push']['history'] = dict()
        new_token_dict['$push']['history']['$each'] \
            = [{"activity_id": ObjectId(),
                "timestamp": token['recent_change'],
                "price": None,
                "type": "refresh_metadata_price_update"}]
        new_token_dict['$set']['price'] = None
    if obj is not None:
        if token['metadata']['reference'] is not None and ('reference' not in obj or obj['reference'] is None):
            new_token_dict['$set'] = await analyze_reference_obj(token['metadata']['reference'], new_token_dict['$set'])
            if new_token_dict['$set'] is None:
                return None

        update_queries = dict(
            users=[
                dict(
                    type='update_one',
                    find_query={"items_owned.token_id": obj['_id']},
                    update_query={'$pull': {"items_owned": {"token_id": obj['_id']}}}
                ),
                dict(
                    type='update_one',
                    find_query={"user_wallet": obj['owner_id'],
                                "items_owned.token_id": {"$ne": obj['_id']}},
                    update_query={'$push': {"items_owned": {"token_id": obj['_id']}}}
                )
            ]
        )
        update_queries['tokens'] = [dict(
            type='update_one',
            find_query={"_id": obj['_id']},
            update_query=new_token_dict)]
        return update_queries
    if token['metadata']['reference'] is not None:
        token = await analyze_reference_obj(token['metadata']['reference'], token, transaction_hash)
        if token is None:
            return None
        if "name" in token["reference"]:
            token["name"] = token["reference"]["name"]

    save_path = await save_file(token['metadata']['media'], token['token_id'], contract, transaction_hash)

    if save_path is None:
        return None

    token['preview'] = dict(size0=save_path)

    if transaction_hash is not None:
        token['history'][0]['transaction_hash'] = transaction_hash

    update_queries = dict(
        tokens=[dict(
            type='insert_one',
            find_query={"token_id": token['token_id'], 'contract_id': token['contract_id']},
            update_query={"$set": token})]
    )
    return update_queries


async def nft_create(log: dict, transaction_hash: str, nft_contract_id: str):
    params = {
        "jsonrpc": "2.0",
        "id": "dontcare",
        "method": "query",
        "params": {
            "request_type": "call_function",
            "account_id": nft_contract_id,
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
                return None
    print(log)
    if nft_contract_id != config.nft_contract:
        return None
    if 'params' in log:
        token_id = log["params"]["token_id"]
    else:
        token_id = log["token_ids"][0]
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
    await asyncio.sleep(0.5)
    async with aiohttp.ClientSession() as client_1:
        async with client_1.post(config.main_near_link,
                                 json=params) as resp_1:
            response = json.loads(await resp_1.text())
            if resp_1.status == 200:
                if 'error' not in response and 'error' not in response['result']:
                    token = json.loads(bytearray(response['result']['result']).decode('utf-8'))
                    try:
                        token = tokens_models.Token(**token).dict()
                        royalty = await get_royalty(nft_contract_id, token['token_id'], token['owner_id'])
                        if base_uri is not None:
                            if not token['metadata']['media'].lstrip('/')[:7] in ['https:/', 'http://']:
                                token['metadata']['media'] = base_uri.rstrip('/') + \
                                                             '/' + token['metadata']['media'].lstrip('/')
                            if 'reference' in token['metadata'] and token['metadata']['reference'] is not None:
                                if not token['metadata']['reference'].lstrip('/')[:7] in ['https:/', 'http://']:
                                    token['metadata']['reference'] = base_uri.rstrip('/') + \
                                                                     '/' + token['metadata'][
                                                                         'reference'].lstrip(
                                        '/')
                        update_query = await insert_new_token_or_update_existed(token, nft_contract_id,
                                                                                transaction_hash, royalty)
                        if update_query is not None:
                            to_return = await main_additional_funcs.update_queries_in_db(update_query)
                            print(to_return)
                            return to_return
                    except Exception as e:
                        print(e, token)
