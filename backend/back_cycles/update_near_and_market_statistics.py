import asyncio
import datetime
import aiohttp
from utils.statistics import get_amount_history_for_time_simply, convert_to_usd_exchange_rate
import config
import json


async def check_json_and_update_db(info, type_):
    try:
        # accountsCount
        if type_ == 'active-accounts-count-aggregated-by-date':
            if info[-2]['accountsCount'] != 0:
                volume_percent = float(
                    "{:.0%}".format((info[-1]['accountsCount'] - info[-2]['accountsCount'])
                                    / info[-2]['accountsCount'])[:-1])
            elif info[-1]['accountsCount'] != 0 and info[-2]['accountsCount'] == 0:
                volume_percent = 100.0
            else:
                volume_percent = 0.0
            max_value = max([int(d['accountsCount']) for d in info])
            info = [
                {
                    'value': int(elem['accountsCount']),
                    'date': elem['date'],
                    'percent': int("{:.0%}".format(int(elem['accountsCount']) / max_value)[:-1])
                    if max_value != 0 else 0
                }
                for elem in info.copy()]
            updated = config.db.statistics.update_one({"name": "near_accounts_stats"},
                                                      {"$set": {"stats": info,
                                                                "volume_percent": volume_percent}})
            if updated.raw_result['n'] == 0:
                config.db.statistics.insert_one({"name": "near_accounts_stats",
                                                 "stats": info,
                                                 "volume_percent": volume_percent})

        # transactionsCount
        elif type_ == 'transactions-count-aggregated-by-date':
            if int(info[-2]['transactionsCount']) != 0:
                volume_percent = float(
                    "{:.0%}".format((int(info[-1]['transactionsCount']) - int(info[-2]['transactionsCount']))
                                    / int(info[-2]['transactionsCount']))[:-1])
            elif int(info[-1]['transactionsCount']) != 0 and int(info[-2]['transactionsCount']) == 0:
                volume_percent = 100.0
            else:
                volume_percent = 0.0
            max_value = max([int(d['transactionsCount']) for d in info])
            info = [
                {
                    'value': int(elem['transactionsCount']),
                    'date': elem['date'],
                    'percent': int("{:.0%}".format(int(elem['transactionsCount']) / max_value)[:-1])
                    if max_value != 0 else 0
                }
                for elem in info.copy()]

            updated = config.db.statistics.update_one({"name": "near_transactions_stats"},
                                                      {"$set": {"stats": info,
                                                                "volume_percent": volume_percent}})
            if updated.raw_result['n'] == 0:
                config.db.statistics.insert_one({"name": "near_transactions_stats",
                                                 "stats": info,
                                                 "volume_percent": volume_percent})
    except Exception as e:
        print(f'json load err: {e}')


async def get_responses_from_explorer(path: str):
    try:
        async with aiohttp.ClientSession() as client:
            async with client.get(
                    f'https://backend-{config.development}-{config.wamp_type[config.development]}.onrender.com/trpc/{path}',
                    timeout=2.0) as resp:
                if resp.status == 200:
                    response = await resp.json()
                    return response['result']['data'][-7:]
    except Exception as e:
        print(f'get_responses_from_explorer err: {e}')
    return []


async def update_near_and_market_statistics():
    tasks = list()
    tasks.append(asyncio.create_task(get_responses_from_explorer('active-accounts-count-aggregated-by-date')))
    tasks.append(asyncio.create_task(get_responses_from_explorer('transactions-count-aggregated-by-date')))
    response = await asyncio.gather(*tasks)
    await check_json_and_update_db(response[0], 'active-accounts-count-aggregated-by-date')
    await check_json_and_update_db(response[1], 'transactions-count-aggregated-by-date')

    if config.db.statistics.find_one({"name": "marketplace_purchase_near_stats"}) is None:
        history_all_tokens = list()
        purchase_near = {}
        purchase_amount = {}
        for token in list(config.db.tokens.find()):
            for in_elem in token['history']:
                in_elem['token_id'] = str(token['_id'])
                if in_elem['type'] in ['refresh_metadata_owner_and_price_update', 'resolve_purchase'] \
                        and in_elem['price'] is not None:
                    history_all_tokens.append(in_elem)
        history_all_tokens = sorted(
            history_all_tokens,
            key=lambda item: datetime.datetime.fromtimestamp(float(item['timestamp'])))

        async def iterator_func_1(x):
            date_not_str = datetime.datetime.fromtimestamp(float(x.get("timestamp"))).date()
            date = str(date_not_str)
            if date not in purchase_near:
                purchase_near[date] = int(x.get('price'))
                purchase_amount[date] = 1
            else:
                purchase_near[date] += int(x.get('price'))
                purchase_amount[date] = 1

        [await iterator_func_1(elem_) for elem_ in history_all_tokens]

        purchase_near = dict(reversed(list(purchase_near.items())))
        purchase_amount = dict(reversed(list(purchase_amount.items())))

        purchase_near = await get_amount_history_for_time_simply(purchase_near, 7, 'UTC', True)
        purchase_amount = await get_amount_history_for_time_simply(purchase_amount, 7, 'UTC')
        config.db.statistics.insert_one({"name": "marketplace_purchase_near_stats",
                                         "stats": purchase_near})
        config.db.statistics.insert_one({"name": "marketplace_purchase_amount_stats",
                                         "stats": purchase_amount})
    categories = dict()
    convert = 1000000000000000000000000
    last_timestamp = datetime.datetime.now()
    covert_to_usd_last_date = await convert_to_usd_exchange_rate(last_timestamp.date())
    for name in config.base_categories:
        category = config.db.categories.find_one({"name": name})
        category['purchase_summary'] = 0.0
        items_in_cat = list(config.db.collections.find({"category_id": category['_id'], "items.0": {"$exists": 1}}))
        category['collections'] = len(items_in_cat)
        items_in_cat = list(config.db.tokens.find({"category": category['_id']}))
        category['items'] = len(items_in_cat)
        for token in items_in_cat:
            token['history'] = sorted(
                token['history'],
                key=lambda item: datetime.datetime.fromtimestamp(float(item['timestamp'])), reverse=True)
            for history_elem in token['history']:
                timestamp = datetime.datetime.fromtimestamp(float(history_elem["timestamp"]))
                if timestamp < last_timestamp - datetime.timedelta(days=1):
                    break
                if history_elem['type'] != 'resolve_purchase':
                    continue

                if timestamp.date() == last_timestamp.date():
                    category['purchase_summary'] += \
                        (int(history_elem['price']) / convert) * covert_to_usd_last_date
                else:
                    category['purchase_summary'] += \
                        (int(history_elem['price']) / convert) * \
                        await convert_to_usd_exchange_rate(timestamp.date())
        categories[category['name']] = category
    config.db.statistics.update_one({"name": "categories_stats"},
                                    {"$set": {
                                        "name": "categories_stats",
                                        "categories": categories
                                    }},
                                    upsert=True)

    print('closing')


async def add_new_date():
    config.db.statistics.update_one({"name": "marketplace_purchase_near_stats"},
                                    {"$push": {
                                        "stats": {
                                            "date": (
                                                    datetime.datetime.now() + datetime.timedelta(days=1)
                                            ).replace(hour=0, minute=0, second=0, microsecond=0),
                                            "value": 0
                                        }
                                    }})
    config.db.statistics.update_one({"name": "marketplace_purchase_amount_stats"},
                                    {"$push": {
                                        "stats": {
                                            "date": (
                                                    datetime.datetime.now() + datetime.timedelta(days=1)
                                            ).replace(hour=0, minute=0, second=0, microsecond=0),
                                            "value": 0
                                        }
                                    }})


async def delete_last_date():
    config.db.statistics.update_one({"name": "marketplace_purchase_near_stats"},
                                    {"$pull": {
                                        "stats": {
                                            "date": (
                                                    datetime.datetime.now() - datetime.timedelta(days=7)
                                            ).replace(hour=0, minute=0, second=0, microsecond=0)
                                        }
                                    }})
    config.db.statistics.update_one({"name": "marketplace_purchase_amount_stats"},
                                    {"$pull": {
                                        "stats": {
                                            "date": (
                                                    datetime.datetime.now() - datetime.timedelta(days=7)
                                            ).replace(hour=0, minute=0, second=0, microsecond=0)
                                        }
                                    }})
