import asyncio
import aiohttp
import config
import json
from utils import near as near_additional_funcs


async def check_json_and_update_db(info):
    try:
        # checkingTxInDb
        for elem in info:
            token = config.db.tokens.find_one({'history.transaction_hash': elem['hash']})
            elem_ = config.db.users.find_one({'history.transaction_hash': elem['hash']})
            if token is None and elem_ is None:
                try:
                    await near_additional_funcs.check_transaction(elem['hash'], elem['signerId'])
                except Exception as e:
                    print(f'auto checkingTx err: {e}')
    except Exception as e:
        print(f'json load err: {e}')


async def get_responses_from_explorer(account_id: str):
    try:
        async with aiohttp.ClientSession() as client:
            params = {"batch": 1, "input": json.dumps({"0": {"accountId": account_id, "limit": 10}})}
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


async def check_tx_on_wamp():
    while True:
        try:
            tasks = list()
            tasks.append(asyncio.create_task(get_responses_from_explorer(config.nft_contract)))
            tasks.append(asyncio.create_task(get_responses_from_explorer(config.market_contract)))
            response = await asyncio.gather(*tasks)
            await check_json_and_update_db(response[0] + response[1])
            await asyncio.sleep(5)
        except Exception as e:
            print(f'wamp err: {e}')
