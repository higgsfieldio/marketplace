from fastapi import HTTPException
import asyncio
import aiohttp
import requests
import config
import json
import base64
import os
import datetime
from bson import ObjectId
from utils import main as main_additional_funcs
from models import tokens as tokens_models
from typing import Optional


async def save_file(media: str, token_id: str, contract_id: str, sem_ipfs):
    tries = 10
    timeout = 15
    sleep = 2
    for try_id in range(tries):
        try:
            async with sem_ipfs:
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
            print(f'downloading photo err: {e}; token and contract ids: {contract_id}_{token_id}')
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


async def analyze_reference_obj(link: str, obj: dict, category_id, sem_ipfs):
    tries = 10
    timeout = 10
    sleep = 1
    for try_id in range(tries):
        try:
            async with sem_ipfs:

                async with aiohttp.ClientSession() as client_1:
                    async with client_1.get(link,
                                            timeout=timeout) as resp_1:
                        if resp_1.status == 200:
                            response = json.loads(await resp_1.text())
                            if isinstance(response, list) and len(response) > 0:
                                response = response[0]
                            obj['reference'] = response
                            category_in_response = await main_additional_funcs.find_by_key_in_dict(response, 'category')
                            rank = await main_additional_funcs.find_by_key_in_dict(response, 'rank')
                            explicitContent = await main_additional_funcs.find_by_key_in_dict(response,
                                                                                              'explicitContent')
                            if category_in_response is not None and isinstance(category_in_response, str):
                                category = config.db.categories.find_one({"name": category_in_response.lower()})
                                if category is None and category_id is None:
                                    category = config.db.categories.insert_one({"name": category_in_response.lower()})
                                    obj['category'] = category.inserted_id
                                elif category_id is None:
                                    obj['category'] = category["_id"]
                                else:
                                    obj['category'] = category_id

                            if rank is not None and isinstance(rank, str):
                                obj['rank'] = rank
                            if explicitContent is not None and isinstance(explicitContent, bool):
                                obj['explicitContent'] = explicitContent
                            return obj
        except Exception as e:
            print(f'downloading reference err: {e}; obj: {obj}')
        if try_id == tries - 1:
            return None
        else:
            await asyncio.sleep(sleep)
    return None


async def check_json(obj):
    try:
        obj = json.loads(obj)
        info = obj[3][0]
        return info

    except Exception as e:
        print(f'json load err: {e}')

    return None


async def check_token_on_blockchain(token_id: str, nft_contract_id: str, sem_ipfs, base_uri, category_id,
                                    sem_upload_to_main_server):
    for i in range(5):
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
        try:
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
                                                                                        category_id, sem_ipfs, royalty,
                                                                                        sem_upload_to_main_server)
                                if update_query is not None:
                                    return update_query
                            except Exception as e:
                                print(e, token, token_id, nft_contract_id)
                        else:
                            return None
        except Exception as e:
            print(f'check_token_on_blockchain err: {e}')
            await asyncio.sleep(0.5)
    return None


async def check(hash_, address, sem_rpc, _id):
    try_id = 0
    max_retries = 5
    timeout = 1.2
    try:
        tokens = list()
        near_url = config.main_near_link
        params = {
            "jsonrpc": "2.0",
            "id": "dontcare",
            "method": "tx",
            "params": [hash_, address]
        }
        while True:
            async with sem_rpc:
                print(f'_id: {_id}')
                try:
                    async with aiohttp.ClientSession() as client_1:
                        async with client_1.post(near_url,
                                                 json=params) as resp_1:
                            if resp_1.status == 200:
                                response = json.loads(await resp_1.text())

                                if 'result' not in response and near_url == config.main_near_link:
                                    near_url = config.main_near_archival_link
                                    continue
                                elif 'result' not in response:
                                    return tokens

                                result_keys = list(response['result']['status'].keys())
                                if 'SuccessValue' in result_keys:
                                    receipts_outcome = response['result']['receipts_outcome']
                                    for receipt_outcome_id in range(len(receipts_outcome)):
                                        receipt_outcome = receipts_outcome[receipt_outcome_id]['outcome']['logs']
                                        for item in receipt_outcome:
                                            try:
                                                log = json.loads(item.replace('EVENT_JSON:', ''))
                                            except Exception as e:
                                                print(f'literal_eval error: "{e}"')
                                                print(f'item: "{item.replace("EVENT_JSON:", "")}"')
                                                continue
                                            print(log)
                                            try:
                                                for data in log['data']:
                                                    for token_id in data['token_ids']:
                                                        if len(data['token_ids']) > 1:
                                                            print(f'hash for many: {hash_}; token_id: {token_id}')
                                                        if token_id not in tokens:
                                                            tokens.append(token_id)

                                            except Exception as e:
                                                print(f'token data err: {e}')
                                return tokens

                except Exception as e:
                    print(f'{"main" if near_url == config.main_near_link else "archival"} helper err: {e}')
                try_id += 1
                if try_id >= max_retries:
                    return tokens
                await asyncio.sleep(timeout)

    except asyncio.CancelledError as async_exception:
        print(async_exception)
    return {}


async def insert_new_token_or_update_existed(token: dict, contract: str, category_id, sem_ipfs, royalty,
                                             sem_upload_to_main_server):
    timestamp = str(datetime.datetime.now().timestamp())
    token['category'] = None
    token['reference'] = None
    token['price'] = None
    token['royalty'] = royalty
    token['category'] = None
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
    new_token_dict['$set'] = dict()
    new_token_dict['$set']['is_staked'] = False
    new_token_dict['$set']['contract_staked_address'] = None
    new_token_dict['$set']['recent_change'] = token['recent_change']
    obj = config.db.tokens.find_one({"token_id": token['token_id'],
                                     "contract_id": contract})
    market_data = await main_additional_funcs.get_market_data(token['token_id'], contract, token)
    if market_data is not None:
        new_token_dict['$set']['price'] = market_data['price']
        token['price'] = market_data['price']
        if obj is not None and obj['price'] != market_data['price']:
            new_token_dict['$push']['history'] = {"activity_id": ObjectId(),
                                                  "timestamp": token['recent_change'],
                                                  "price": market_data['price'],
                                                  "type": "refresh_metadata_price_update"}
    elif obj is not None and obj['price'] is not None:
        new_token_dict['$push']['history'] = {"activity_id": ObjectId(),
                                              "timestamp": token['recent_change'],
                                              "price": None,
                                              "type": "refresh_metadata_price_update"}
        new_token_dict['$set']['price'] = None

    if token['owner_id'] in config.base_staking_account:
        is_staked_info = await main_additional_funcs.check_if_token_is_staked(token['token_id'], contract, token)
        if is_staked_info is not None:
            new_token_dict['$set'].update(is_staked_info)
            token.update(is_staked_info)
            if 'history' not in new_token_dict['$push'] or '$each' not in new_token_dict['$push']['history']:
                new_token_dict['$push']['history'] = dict()
                new_token_dict['$push']['history']['$each'] = list()
            history_data = {
                "activity_id": ObjectId(),
                "timestamp": token['recent_change'],
                "buyer_id": is_staked_info["owner_id"],
                "owner_id": token["owner_id"],
                "type": "refresh_metadata_owner_and_price_update",
                "price": None
            }
            new_token_dict['$push']['history']['$each'].append(history_data)
            token['history'].append(history_data)
        else:
            return None

    if obj is not None:
        if token['metadata']['reference'] is not None and ('reference' not in obj or obj['reference'] is None) \
                and token['metadata']['reference'].lstrip('/')[:7] in ['https:/', 'http://']:
            new_token_dict['$set'] = await analyze_reference_obj(token['metadata']['reference'], new_token_dict['$set'],
                                                                 category_id, sem_ipfs)
            if new_token_dict['$set'] is None:
                return None
        if category_id is not None:
            new_token_dict['$set']['category'] = category_id
        update_queries = dict(
            tokens=[dict(
                type='update_one',
                find_query={"token_id": token['token_id'],
                            "contract_id": contract},
                update_query=new_token_dict)],
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
        return update_queries
    if token['metadata']['reference'] is not None:
        token = await analyze_reference_obj(token['metadata']['reference'], token, category_id, sem_ipfs)
        if token is None:
            return None
        if "name" in token["reference"]:
            token["name"] = token["reference"]["name"]

    save_path = await save_file(token['metadata']['media'], token['token_id'], contract, sem_ipfs)

    if save_path is None:
        return None

    uploaded = False
    for i in range(5):
        async with sem_upload_to_main_server:
            try:
                async with aiohttp.ClientSession() as client:
                    form = aiohttp.FormData()
                    with open(config.app_location + f'/files/tokens/' + save_path, 'rb') as file:
                        form.add_field('file', file, filename=save_path)
                        async with client.post(config.server_link + '/tokens/upload',
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
    os.remove(config.app_location + f'/files/tokens/' + save_path)
    if not uploaded:
        return None

    token['preview'] = dict(size0=save_path)

    if category_id is not None:
        token['category'] = category_id

    update_queries = dict(
        tokens=[dict(
            type='insert_one',
            update_query=token)]
    )
    return update_queries


async def get_nft_total_supply(contract_id: str):
    params = {
        "jsonrpc": "2.0",
        "id": "dontcare",
        "method": "query",
        "params": {
            "request_type": "call_function",
            "account_id": contract_id,
            "method_name": "nft_total_supply",
            "args_base64": "e30=",
            "finality": "final"}
    }
    async with aiohttp.ClientSession() as client_1:
        async with client_1.post(config.main_near_link,
                                 json=params) as resp_1:
            if resp_1.status == 200:
                response = json.loads(await resp_1.text())
                if 'error' not in response and 'error' not in response['result']:
                    amount = json.loads(bytearray(response['result']['result']).decode('utf-8'))
                    return int(amount)
    raise HTTPException(status_code=400, detail='nft_total_supply method not found')


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
    if response.status_code == 200 and 'error' not in response.json() and 'error' not in \
            response.json()['result']:
        return True
    elif 'error' in response.json() and response.json()['error']['name'] == 'UNKNOWN_BLOCK':
        response_1 = requests.post(config.main_near_archival_link,
                                   json=params)
        if response_1.status_code == 200 and 'error' not in response_1.json():
            return True
    raise HTTPException(status_code=400, detail='Account not found')


async def check_contract_methods(contract_id: str):
    params = {
        "jsonrpc": "2.0",
        "id": "dontcare",
        "method": "query",
        "params": {
            "request_type": "call_function",
            "account_id": contract_id,
            "method_name": "nft_tokens",
            "args_base64": base64.b64encode(
                f'{{"from_index":"0","limit":'
                f'5}}'.encode("ascii")
            ).decode('ascii'),
            "finality": "final"}
    }
    async with aiohttp.ClientSession() as client_1:
        async with client_1.post(config.main_near_link,
                                 json=params) as resp_1:
            if resp_1.status == 200:
                response = json.loads(await resp_1.text())
                if 'error' not in response and 'error' not in response['result']:
                    return await get_account(contract_id)

    raise HTTPException(status_code=400, detail='nft_tokens method not found')


async def get_royalty(contract_id: str, token_id: str, owner_id: str):
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
                async with client.post(config.main_near_link, json=data, timeout=config.timeout_req) as resp:
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
            print(f'downloading royalty err: {e}')
        await asyncio.sleep(0.5)
    return None


async def get_responses_from_explorer(account_id: str, end_timestamp: Optional[int] = None):
    try:
        async with aiohttp.ClientSession() as client:
            data = {"0": {"accountId": account_id, "limit": 10}}
            if end_timestamp is not None:
                data.update({"cursor": {"endTimestamp": end_timestamp}})
            params = {"batch": 1, "input": json.dumps(data)}
            async with client.get(
                    f'https://backend-{config.development}-{config.wamp_type[config.development]}.onrender.com'
                    f'/trpc/transactions-list-by-account-id',
                    params=params, timeout=2.0) as resp:
                if resp.status == 200:
                    response = await resp.json()
                    return response[0]['result']['data']
    except Exception as e:
        print(f'get_responses_from_explorer err: {e}')
    return []


async def get_items(nft_contract_id: str, category_id):
    sem_rcp = asyncio.Semaphore(30)
    sem_ipfs = asyncio.Semaphore(30)
    sem_upload_to_main_server = asyncio.Semaphore(20)
    try:
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
                    base_uri = ''
        task_list = list()
        last_timestamp = None
        while True:
            response = await get_responses_from_explorer(nft_contract_id, last_timestamp)
            info = await check_json(response)
            if info is not None:
                if len(info) == 0:
                    break
                for elem in info:
                    if 'actions' in elem:
                        for in_elem in elem['actions']:
                            if 'args' in in_elem and 'method_name' in in_elem['args'] \
                                    and in_elem['args']['method_name'] in ['nft_mint_one', 'nft_mint',
                                                                           'claim', 'nft_mint_many']:
                                if in_elem['args']['method_name'] == 'nft_mint_many':
                                    print(f'nft_mint_many: {elem["hash"]}')
                                task_list.append(
                                    asyncio.create_task(
                                        check(
                                            elem["hash"],
                                            elem["signerId"],
                                            sem_rcp, len(task_list)
                                        )
                                    )
                                )

                                break
                last_timestamp = dict(endTimestamp=info[-1]['blockTimestamp'], transactionIndex=0)
        update_queries = dict()
        new_task_list = list()
        tokens = list()
        try:
            print(f'total amount _id: {len(task_list)}')
            items_gathered = await asyncio.gather(*task_list)
            for item_gathered in items_gathered:
                for token in item_gathered:
                    if token not in tokens:
                        tokens.append(token)
                        new_task_list.append(
                            asyncio.create_task(
                                check_token_on_blockchain(
                                    token, nft_contract_id,
                                    sem_ipfs, base_uri,
                                    category_id, sem_upload_to_main_server
                                )
                            )
                        )
            items_gathered = await asyncio.gather(*new_task_list)
            for item_gathered in items_gathered:
                if isinstance(item_gathered, dict):
                    for key in item_gathered.keys():
                        if key not in update_queries:
                            update_queries[key] = list()
                        [update_queries[key].append(elem) for elem in item_gathered[key]]
                else:
                    print(f'isinstance(item_gathered, dict) err: {item_gathered}')
            return update_queries
        except Exception as e:
            print(f'item gathered err: {e}')
            for task in task_list:
                task.cancel()
            for task in new_task_list:
                task.cancel()
            raise HTTPException(status_code=400, detail=f'item gathered err: {e}')

    except Exception as e:
        raise HTTPException(status_code=400, detail=f'wamp err: {e}')
