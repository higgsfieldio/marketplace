import asyncio

import aiohttp
import pytz

import config
from typing import Optional
import datetime
import copy
from pymongo import ReturnDocument
from bson import Decimal128


async def convert_to_usd_exchange_rate(date: datetime):
    convert = config.near_usd_db.dates.find_one({"date": str(date.strftime('%Y-%m-%d'))})
    if convert is not None:
        return convert['value']
    else:
        return config.near_usd_db.dates.find_one({"$query": {}, "$orderby": {"$natural": -1}})['value']


async def get_amount_history_for_date(collection_adding_history: dict, search_date: datetime):
    dates_listed = list(collection_adding_history.keys())
    if str(search_date) not in dates_listed:
        mid = len(dates_listed) // 2
        low = 0
        high = len(dates_listed) - 1
        while dates_listed[mid] != str(search_date) and low <= high:
            if search_date >= datetime.datetime.strptime(dates_listed[mid], '%Y-%m-%d').date():
                low = mid + 1
            else:
                high = mid - 1
            mid = (low + high) // 2
        if mid in range(0, len(dates_listed)):
            return collection_adding_history[dates_listed[mid]]
        return 0
    else:
        return collection_adding_history[str(search_date)]


async def get_price_history_for_time_without_changing(price_history: dict, days: int, tz: str,
                                                      collection_adding_history: Optional[dict] = None,
                                                      convert_to_usd_last_date: Optional[dict] = None,
                                                      do_convert: Optional[bool] = True):
    last_date = datetime.datetime.now(tz=pytz.timezone(tz))
    separator = 1
    if days == 0:
        days = (last_date.date() - datetime.datetime.strptime(list(price_history.keys())[-1], '%Y-%m-%d').date()).days
        if days > 30:
            separator = days // 30
        else:
            days = 30
    price_history_objects = list()
    key_id = 0
    convert = 1000000000000000000000000
    for i in range(0, days, separator):
        if str(last_date.date()) in price_history:
            if collection_adding_history is not None:
                amount_by_that_day = await get_amount_history_for_date(collection_adding_history, last_date.date())
                if amount_by_that_day == 0:
                    value = '0'
                elif convert_to_usd_last_date is not None and do_convert:
                    if str(last_date.date()) \
                            != list(convert_to_usd_last_date.keys())[0]:
                        convert_to_usd = \
                            await convert_to_usd_exchange_rate(datetime.datetime.fromtimestamp(float(
                                last_date.timestamp()),
                                tz=pytz.timezone(
                                    tz)).date())
                    else:
                        convert_to_usd = convert_to_usd_last_date[list(convert_to_usd_last_date.keys())[0]]
                    value = str((((list(price_history.values())[key_id]) * amount_by_that_day) / convert) *
                                convert_to_usd)
                else:
                    value = str((list(price_history.values())[key_id]) * amount_by_that_day)
            else:
                value = str(list(price_history.values())[key_id])
            price_history_objects.append({
                "timestamp": str(last_date.timestamp()),
                "value": value
            })
            key_id += 1
        elif key_id < len(price_history.values()):
            if collection_adding_history is not None:
                amount_by_that_day = await get_amount_history_for_date(collection_adding_history, last_date.date())
                if amount_by_that_day == 0:
                    value = '0'
                elif convert_to_usd_last_date is not None and do_convert:
                    if str(last_date.date()) \
                            != list(convert_to_usd_last_date.keys())[0]:
                        convert_to_usd = \
                            await convert_to_usd_exchange_rate(datetime.datetime.fromtimestamp(float(
                                last_date.timestamp()),
                                tz=pytz.timezone(
                                    tz)).date())
                    else:
                        convert_to_usd = convert_to_usd_last_date[list(convert_to_usd_last_date.keys())[0]]
                    value = str((((list(price_history.values())[key_id]) * amount_by_that_day) / convert) *
                                convert_to_usd)
                else:
                    value = str((list(price_history.values())[key_id]) * amount_by_that_day)
            else:
                value = str(list(price_history.values())[key_id])
            price_history_objects.append({
                "timestamp": str(last_date.timestamp()),
                "value": value
            })

        else:
            price_history_objects.append({
                "value": '0',
                "timestamp": str(last_date.timestamp())
            })
        last_date = last_date - datetime.timedelta(days=1)

    max_price = int(max([int(float(d['value'])) for d in price_history_objects]))

    for elem in price_history_objects:
        percent = int("{:.0%}".format(int(float(elem['value'])) / max_price)[:-1]) if max_price != 0 else 0
        if collection_adding_history is not None and convert_to_usd_last_date is not None:
            value = float("{:10.4f}".format(int(float(elem['value']))))
            if str(value)[-2:] == '.0':
                elem['value'] = str(int(value))
            else:
                elem['value'] = str(value)

        else:
            value = float("{:10.4f}".format((int(elem['value']) / convert))) \
                if do_convert else float("{:10.4f}".format((int(elem['value']))))
            if str(value)[-2:] == '.0':
                elem['value'] = str(int(value))
            else:
                elem['value'] = str(value)
        elem['percent'] = percent
    list_ = list()
    for item in range(5):
        elem = str("%.4f" % float((item * max_price / 4) / convert)).split('.') \
            if do_convert else str("%.4f" % float(item * max_price / 4)).split('.')
        elem = float(elem[0] + '.' + elem[1][:4])
        if str(elem).split('.')[1] == '0':
            elem = str(int(elem))
        else:
            elem = str(elem)
        list_.append(elem)
    return {
        "items": price_history_objects[::-1],
        "brake_points": list_
    }


async def get_price_history_for_time_as_zero(days: int, tz: str):
    last_date = datetime.datetime.now(tz=pytz.timezone(tz))
    separator = 1
    price_history_objects = list()
    for i in range(0, days, separator):
        price_history_objects.append({
            "timestamp": str(last_date.timestamp()),
            "value": 0,
            "percent": 0
        })
        last_date = last_date - datetime.timedelta(days=1)

    return {
        "items": price_history_objects[::-1],
        "brake_points": [
            "0",
            "0",
            "0",
            "0",
            "0"
        ]
    }


async def get_amount_history_for_time_simply(history: dict, days: int, tz: str, convert: Optional[bool] = False):
    last_date = datetime.datetime.now(tz=pytz.timezone(tz))
    separator = 1
    if days == 0:
        days = (last_date.date() - datetime.datetime.strptime(list(history.keys())[-1],
                                                              '%Y-%m-%d').date()).days
        if days > 30:
            separator = days // 30
        else:
            days = 30
    history_objects = list()
    key_id = 0
    for i in range(0, days, separator):
        if str(last_date.date()) in history:
            history_objects.append({
                "date": last_date.replace(hour=0, minute=0, second=0, microsecond=0),
                "value": list(history.values())[key_id] / (1000000000000000000000000 if convert else 1)
            })
            key_id += 1
        else:
            history_objects.append({
                "value": 0,
                "date": last_date.replace(hour=0, minute=0, second=0, microsecond=0)
            })
        last_date = last_date - datetime.timedelta(days=1)

    return history_objects[::-1]


async def get_amount_history_for_time(history: dict, days: int, tz: str,
                                      history_in_standart_view: Optional[dict] = None):
    last_date = datetime.datetime.now(tz=pytz.timezone(tz))
    separator = 1
    if days == 0:
        days = (last_date.date() - datetime.datetime.strptime(list(history.keys())[-1],
                                                              '%Y-%m-%d').date()).days
        if days > 30:
            separator = days // 30
        else:
            days = 30
    history_objects = list()
    key_id = 0
    for i in range(0, days, separator):
        if str(last_date.date()) in history:
            history_objects.append({
                "timestamp": str(last_date.timestamp()),
                "value": str(list(history.values())[key_id])
            })
            key_id += 1
        else:
            history_objects.append({
                "value": '0',
                "timestamp": str(last_date.timestamp())
            })
        last_date = last_date - datetime.timedelta(days=1)

    max_value = int(max([int(d['value']) for d in history_objects]))

    for elem in history_objects:
        percent = int("{:.0%}".format(int(elem['value']) / max_value)[:-1]) if max_value != 0 else 0
        elem['percent'] = percent
    if history_in_standart_view is None:
        return {
            "items": history_objects[::-1],
            "brake_points": [str(int(item * max_value // 4)) for item in range(5)]
        }
    else:
        history = list()
        for item in history_in_standart_view.items():
            if datetime.datetime.strptime(item[0], '%Y-%m-%d').date() >= last_date.date():
                for key in item[1].keys():
                    if key not in history:
                        history.append(key)
        return {
            "amount_in_all": len(history),
            "items": history_objects[::-1],
            "brake_points": [str(int(item * max_value // 4)) for item in range(5)]
        }


async def get_amount_history_for_time_without_changing(history: dict, days: int, tz: str,
                                                       history_in_standart_view: Optional[dict] = None):
    last_date = datetime.datetime.now(tz=pytz.timezone(tz))
    separator = 1
    if days == 0:
        days = (last_date.date() - datetime.datetime.strptime(list(history.keys())[-1],
                                                              '%Y-%m-%d').date()).days
        if days > 30:
            separator = days // 30
        else:
            days = 30
    history_objects = list()
    key_id = 0
    for i in range(0, days, separator):
        if str(last_date.date()) in history:
            history_objects.append({
                "timestamp": str(last_date.timestamp()),
                "value": str(list(history.values())[key_id])
            })
            key_id += 1
        elif key_id < len(history.values()):
            history_objects.append({
                "value": str(list(history.values())[key_id]),
                "timestamp": str(last_date.timestamp())
            })
        else:
            history_objects.append({
                "value": '0',
                "timestamp": str(last_date.timestamp())
            })
        last_date = last_date - datetime.timedelta(days=1)

    max_value = int(max([int(d['value']) for d in history_objects]))

    for elem in history_objects:
        percent = int("{:.0%}".format(int(elem['value']) / max_value)[:-1]) if max_value != 0 else 0
        elem['percent'] = percent
    if history_in_standart_view is None:
        return {
            "items": history_objects[::-1],
            "brake_points": [str(int(item * max_value // 4)) for item in range(5)]
        }
    else:
        history = list()
        for item in history_in_standart_view.items():
            if datetime.datetime.strptime(item[0], '%Y-%m-%d').date() >= last_date.date():
                for key in item[1].keys():
                    if key not in history:
                        history.append(key)
        return {
            "amount_in_all": len(history),
            "items": history_objects[::-1],
            "brake_points": [str(int(item * max_value // 4)) for item in range(5)]
        }


async def get_listed_nft_amount_for_time(history: dict, days: int, tz: str,
                                         collection_adding_history: dict):
    last_date = datetime.datetime.now(tz=pytz.timezone(tz))
    separator = 1
    if days == 0:
        days = (last_date.date() - datetime.datetime.strptime(list(history.keys())[-1],
                                                              '%Y-%m-%d').date()).days
        if days > 30:
            separator = days // 30
        else:
            days = 30
    history_objects = list()
    key_id = 0
    for i in range(0, days, separator):
        if str(last_date.date()) in history:
            amount_by_that_day = await get_amount_history_for_date(collection_adding_history, last_date.date())
            if amount_by_that_day == 0:
                percent = 0
                value = '0/0'
                percent = int("{:.0%}".format(float(percent))[:-1])
            else:
                percent = str((list(history.values())[key_id]) / amount_by_that_day)
                value = f'{list(history.values())[key_id]}/{amount_by_that_day}'
                percent = int("{:.0%}".format(float(percent))[:-1])
            history_objects.append({
                "timestamp": str(last_date.timestamp()),
                "value": value,
                "percent": percent
            })
            key_id += 1
        elif key_id < len(history.values()):
            amount_by_that_day = await get_amount_history_for_date(collection_adding_history, last_date.date())
            if amount_by_that_day == 0:
                percent = 0
                value = '0/0'
                percent = int("{:.0%}".format(float(percent))[:-1])
            else:
                percent = str((list(history.values())[key_id]) / amount_by_that_day)
                value = f'{list(history.values())[key_id]}/{amount_by_that_day}'
                percent = int("{:.0%}".format(float(percent))[:-1])
            history_objects.append({
                "timestamp": str(last_date.timestamp()),
                "value": value,
                "percent": percent
            })
        else:
            amount_by_that_day = await get_amount_history_for_date(collection_adding_history, last_date.date())
            history_objects.append({
                "value": f'0/{amount_by_that_day}',
                "percent": 0,
                "timestamp": str(last_date.timestamp())
            })
        last_date = last_date - datetime.timedelta(days=1)
    return {
        "items": history_objects[::-1],
        "brake_points": ['0%', '25%', '50%', '75%', '100%']
    }


async def get_statistics_for_collection(collection_dict: dict, tz_dict):
    if 'main_statistics' in collection_dict:
        collection_dict['statistics'] = collection_dict['main_statistics']
        collection_dict['max_price'] = collection_dict['statistics']['max_price']
        collection_dict['floor_price'] = collection_dict['statistics']['floor_price']
        collection_dict['market_cap'] = collection_dict['statistics']['market_cap']
        collection_dict['total_owners'] = collection_dict['statistics']['total_owners']
        collection_dict['total_volume'] = collection_dict['statistics']['total_volume']
        collection_dict['total_items'] = len(collection_dict['items'])
        return collection_dict
    else:
        update_queries = dict(collections=list())
        statistics = (await get_statistics_for_main_collection(collection_dict, {"tz": "UTC"}))['statistics']

        update_queries['collections'].append(dict(
            type='update_one',
            find_query={"_id": collection_dict['_id']},
            update_query={
                "$set": {
                    "main_statistics": statistics
                }
            }
        )
        )
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
                        for elem in elem['history']:
                            if elem['type'] == 'collection_adding':
                                config.db.collections.update_one(
                                    {"_id": elem['collection_id']},
                                    {"$push": {
                                        "items": {
                                            "token_id": elem['_id']},
                                        "history": {
                                            "token_id": elem['_id'],
                                            "activity_id": elem['activity_id']}}})
                                break
                    return elem
        collection_dict['statistics'] = statistics
        collection_dict['max_price'] = collection_dict['statistics']['max_price']
        collection_dict['floor_price'] = collection_dict['statistics']['floor_price']
        collection_dict['market_cap'] = collection_dict['statistics']['market_cap']
        collection_dict['total_owners'] = collection_dict['statistics']['total_owners']
        collection_dict['total_volume'] = collection_dict['statistics']['total_volume']
        collection_dict['total_items'] = len(collection_dict['items'])
        return collection_dict


async def get_statistics_for_main_collection(collection_dict: dict, tz_dict):
    tz = 'UTC'
    if 'tz' in tz_dict:
        tz = tz_dict['tz']

    convert = 1000000000000000000000000
    listed_nfts = {}
    purchase_price_summary = {}
    resolve_purchase_history = {}
    floor_price = {}
    owners_history = {}
    sellers_history = {}
    buyers_history = {}
    date_asked = datetime.datetime.now(tz=pytz.timezone(tz)).date()
    max_price = {date_asked: 0}
    collection_dict['total_volume'] = 0.0
    covert_to_usd_last_date = {str(date_asked): await convert_to_usd_exchange_rate(date_asked)}
    collection_adding_history = {}
    history_of_collection_tokens = list()
    for elem in collection_dict['items']:
        for in_elem in elem['history']:
            inn = in_elem.copy()
            inn.update({"token_id": elem['_id']})
            history_of_collection_tokens.append(inn)

    d = {}
    to_send = list()

    for elem in collection_dict['history']:
        if elem['token_id'] not in d:
            d[elem['token_id']] = list()
        d[elem['token_id']].append(elem['activity_id'])
        to_send.append({"_id": elem['token_id'], "history.activity_id": elem['activity_id']})
    if len(to_send) != 0:
        for elem in sorted(list(
                config.db.tokens.aggregate([
                    {
                        "$match": {"$or": to_send}
                    },
                    {"$project": {"history": 1}},
                    {
                        "$unwind": "$history"
                    },
                ])
        ), key=lambda item: datetime.datetime.fromtimestamp(float(item['history']['timestamp']),
                                                            tz=pytz.timezone(tz))):
            in_elem = elem['history']
            if in_elem['activity_id'] not in d[elem["_id"]]:
                continue
            in_elem['token_id'] = str(elem['_id'])
            if in_elem.get('type') == 'collection_adding':
                date_ = str(datetime.datetime.fromtimestamp(float(in_elem.get("timestamp")),
                                                            tz=pytz.timezone(tz)).date())
                if date_ not in collection_adding_history:
                    last_date_ = list(collection_adding_history.keys())
                    if len(last_date_) > 0:
                        last_date_ = last_date_[-1]
                        collection_adding_history[date_] = collection_adding_history[last_date_] + 1
                    else:
                        collection_adding_history[date_] = 1
                else:
                    collection_adding_history[date_] += 1
            elif in_elem.get('type') == 'collection_deleting':
                date_ = str(datetime.datetime.fromtimestamp(float(in_elem.get("timestamp")),
                                                            tz=pytz.timezone(tz)).date())
                if date_ not in collection_adding_history:
                    last_date_ = list(collection_adding_history.keys())
                    if len(last_date_) > 0:
                        last_date_ = last_date_[-1]
                        collection_adding_history[date_] = collection_adding_history[last_date_] - 1
                    else:
                        collection_adding_history[date_] = 0
                else:
                    collection_adding_history[date_] -= 1
            else:
                print(in_elem)

    history_of_collection_tokens = sorted(
        history_of_collection_tokens,
        key=lambda item: datetime.datetime.fromtimestamp(float(item['timestamp']),
                                                         tz=pytz.timezone(tz)))

    async def iterator_func_1(x):
        date_not_str = datetime.datetime.fromtimestamp(float(x.get("timestamp")), tz=pytz.timezone(tz)).date()
        date = str(date_not_str)
        if x.get('type') in ['add_market_data', 'item_creating']:
            if date not in owners_history:
                last_date = list(owners_history.keys())
                if len(last_date) > 0:
                    owners_history[date] = copy.deepcopy(owners_history[last_date[-1]])
                    if x.get('owner_id') not in owners_history[date]:
                        owners_history[date][x.get('owner_id')] = [x.get('token_id')]
                    elif x.get('token_id') not in owners_history[date][x.get('owner_id')]:
                        owners_history[date][x.get('owner_id')].append(x.get('token_id'))
                else:
                    owners_history[date] = dict()
                    owners_history[date][x.get('owner_id')] = [x.get('token_id')]
            elif x.get('owner_id') not in owners_history[date]:
                owners_history[date][x.get('owner_id')] = [x.get('token_id')]
            elif x.get('token_id') not in owners_history[date][x.get('owner_id')]:
                owners_history[date][x.get('owner_id')].append(x.get('token_id'))

        if x.get('type') in ['resolve_purchase', 'refresh_metadata_owner_and_price_update', 'nft_transfer']:
            #######################################################################
            if date not in owners_history:
                last_date = list(owners_history.keys())[-1]
                owners_history[date] = copy.deepcopy(owners_history[last_date])

            if x.get('owner_id') in owners_history[date] and x.get('buyer_id') not in owners_history[date]:
                owners_history[date][x.get('buyer_id')] = [x.get('token_id')]
                if x.get('token_id') in owners_history[date][x.get('owner_id')]:
                    owners_history[date][x.get('owner_id')].remove(x.get('token_id'))
                if len(owners_history[date][x.get('owner_id')]) == 0:
                    del owners_history[date][x.get('owner_id')]
            elif x.get('owner_id') in owners_history[date] and x.get('buyer_id') in owners_history[date]:
                owners_history[date][x.get('buyer_id')].append(x.get('token_id'))
                if x.get('token_id') in owners_history[date][x.get('owner_id')]:
                    owners_history[date][x.get('owner_id')].remove(x.get('token_id'))
                if len(owners_history[date][x.get('owner_id')]) == 0:
                    del owners_history[date][x.get('owner_id')]
            else:
                owners_history[date][x.get('buyer_id')] = [x.get('token_id')]

        if x.get("type") in ['add_market_data', 'refresh_metadata_price_update',
                             'refresh_metadata_owner_and_price_update'] and isinstance(x.get('price'), str):
            if x.get('price') is not None:
                if date not in floor_price:
                    last_date = list(floor_price.keys())
                    if len(last_date) > 0:
                        floor_price[date] = copy.deepcopy(floor_price[last_date[-1]])
                    else:
                        floor_price[date] = dict()
                floor_price[date][x.get('token_id')] = int(x.get('price'))

            if date not in listed_nfts:
                last_date = list(listed_nfts.keys())
                if len(last_date) > 0:
                    listed_nfts[date] = copy.deepcopy(listed_nfts[last_date[-1]])
                else:
                    listed_nfts[date] = dict()
            listed_nfts[date][x.get('token_id')] = int(x.get('price'))
        elif x.get('type') == 'update_market_data':
            if x.get('price') is not None:
                if date not in floor_price:
                    last_date = list(floor_price.keys())
                    if len(last_date) > 0:
                        floor_price[date] = copy.deepcopy(floor_price[last_date[-1]])
                if x.get('token_id') in floor_price[date]:
                    floor_price[date][x.get('token_id')] = int(x.get('price'))

        elif x.get('type') == 'resolve_purchase':
            if date_not_str != date_asked:
                collection_dict['total_volume'] += float("{:10.4f}".format((int(x.get('price')) / convert) *
                                                                           await convert_to_usd_exchange_rate(
                                                                               date_not_str)))
            else:
                collection_dict['total_volume'] += float("{:10.4f}".format((int(x.get('price')) / convert) *
                                                                           covert_to_usd_last_date[
                                                                               str(date_asked)]))

            if int(x.get('price')) > list(max_price.values())[0]:
                del max_price[list(max_price.keys())[0]]
                max_price[date_not_str] = int(x.get('price'))

            if date not in sellers_history:
                sellers_history[date] = dict()
                sellers_history[date][x.get('owner_id')] = [x.get('token_id')]
            elif x.get("owner_id") not in sellers_history[date]:
                sellers_history[date][x.get('owner_id')] = [x.get('token_id')]
            else:
                sellers_history[date][x.get('owner_id')].append(x.get('token_id'))

            if date not in buyers_history:
                buyers_history[date] = dict()
                buyers_history[date][x.get('buyer_id')] = [x.get('token_id')]
            elif x.get("buyer_id") not in buyers_history[date]:
                buyers_history[date][x.get('buyer_id')] = [x.get('token_id')]
            else:
                buyers_history[date][x.get('buyer_id')].append(x.get('token_id'))

            if date not in purchase_price_summary:
                purchase_price_summary[date] = int(x.get('price'))
                resolve_purchase_history[date] = 1
            else:
                purchase_price_summary[date] += int(x.get('price'))
                resolve_purchase_history[date] += 1

            if date not in floor_price:
                last_date = list(floor_price.keys())
                if len(last_date) > 0:
                    floor_price[date] = copy.deepcopy(floor_price[last_date[-1]])
                    if x.get('token_id') in floor_price[date]:
                        del floor_price[date][x.get('token_id')]
            else:
                if x.get('token_id') in floor_price[date]:
                    del floor_price[date][x.get('token_id')]

            if date not in listed_nfts:
                last_date = list(listed_nfts.keys())
                if len(last_date) > 0:
                    listed_nfts[date] = copy.deepcopy(listed_nfts[last_date[-1]])
                    if x.get('token_id') in listed_nfts[date]:
                        del listed_nfts[date][x.get('token_id')]
            else:
                if x.get('token_id') in listed_nfts[date]:
                    del listed_nfts[date][x.get('token_id')]

        elif x.get('type') in ['refresh_metadata_owner_and_price_update', 'delete_market_data',
                               'refresh_metadata_price_update']:
            if date not in floor_price:
                last_date = list(floor_price.keys())
                if len(last_date) > 0:
                    floor_price[date] = copy.deepcopy(floor_price[last_date[-1]])
                    if x.get('token_id') in floor_price[date]:
                        del floor_price[date][x.get('token_id')]
            else:
                if x.get('token_id') in floor_price[date]:
                    del floor_price[date][x.get('token_id')]

            if date not in listed_nfts:
                last_date = list(listed_nfts.keys())
                if len(last_date) > 0:
                    listed_nfts[date] = copy.deepcopy(listed_nfts[last_date[-1]])
                    if x.get('token_id') in listed_nfts[date]:
                        del listed_nfts[date][x.get('token_id')]
            else:
                if x.get('token_id') in listed_nfts[date]:
                    del listed_nfts[date][x.get('token_id')]

    [await iterator_func_1(elem_) for elem_ in history_of_collection_tokens]

    owners_history = dict(reversed(list(owners_history.items())))
    listed_nfts = dict(reversed(list(listed_nfts.items())))
    sellers_history = dict(reversed(list(sellers_history.items())))
    buyers_history = dict(reversed(list(buyers_history.items())))
    floor_price = dict(reversed(list(floor_price.items())))
    average_price = dict()
    keys = list(purchase_price_summary.keys())
    for key_id in range(len(keys)):
        base_sum = 0
        summary = 0
        for key_internal_id in range(0, key_id):
            key = keys[key_internal_id]
            base_sum += purchase_price_summary[key]
            summary += resolve_purchase_history[key]
        key = keys[key_id]
        average_price[key] = round((base_sum + purchase_price_summary[key]) / (summary + resolve_purchase_history[key]))

    purchase_price_summary = dict(reversed(list(purchase_price_summary.items())))
    resolve_purchase_history = dict(reversed(list(resolve_purchase_history.items())))
    average_price = dict(reversed(list(average_price.items())))

    # print(f'listed_nfts: {listed_nfts}')
    # print(f'owners_history: {owners_history}')
    # print(f'sellers_history: {sellers_history}')
    # print(f'buyers_history: {buyers_history}')
    # print(f'floor_price: {floor_price}')
    # print(f'purchase_price_summary: {purchase_price_summary}')
    # print(f'average_price: {average_price}')
    # print(f'resolve_purchase_history: {resolve_purchase_history}')
    # print(f'collection_adding_history: {collection_adding_history}')
    # print(f'max_price: {max_price}')

    async def get_total_volume_from_paras(collection_id: str):
        for i in range(5):
            try:
                async with aiohttp.ClientSession() as client:
                    async with client.get(
                            f'https://api-v2-mainnet.paras.id/collection-stats?collection_id={collection_id}',
                            timeout=15.0) as resp:
                        if resp.status == 200:
                            response = await resp.json()
                            if 'data' in response and 'results' in response['data'] \
                                    and 'volume' in response['data']['results']:
                                return response['data']['results']['volume']
                await asyncio.sleep(0.9)
            except Exception as e:
                print(e)
        return '0'

    collection_dict['statistics'] = dict()
    collection_dict['statistics']['max_price'] = None
    collection_dict['statistics']['floor_price'] = None
    collection_dict['statistics']['market_cap'] = None
    collection_dict['statistics']['total_owners'] = None
    collection_dict['statistics']['total_items'] = len(collection_dict['items'])
    if list(max_price.values())[0] != 0:
        value = float(
            "{:10.4f}".format(list(max_price.values())[0])) / convert
        collection_dict['statistics']['max_price'] = str(value)

    try:
        collection_dict['total_volume'] += float("{:10.4f}".format(
            (int(await get_total_volume_from_paras(collection_dict['contract_address'])) / convert) *
            covert_to_usd_last_date[
                str(date_asked)]))
    except Exception as e:
        print(f'get_total_volume_from_paras err: {e}')

    if str(collection_dict['total_volume'])[-2:] == '.0':
        collection_dict['statistics']['total_volume'] = str(int(collection_dict['total_volume']))
    else:
        collection_dict['statistics']['total_volume'] = str(collection_dict['total_volume'])
    collection_dict['statistics']["listed_nfts_amount_dict"] = dict()
    collection_dict['statistics']["market_cap_history_dict"] = dict()
    collection_dict['statistics']["resolve_purchase_history_dict"] = dict()
    collection_dict['statistics']["owners_history_dict"] = dict()
    collection_dict['statistics']["sellers_history_dict"] = dict()
    collection_dict['statistics']["buyers_history_dict"] = dict()
    collection_dict['statistics']["price"] = dict()

    empty = False
    try:
        collection_dict['statistics']['market_cap_history_dict'].update({
            'average_price': {
                "week": await get_price_history_for_time_without_changing(average_price, 7, tz,
                                                                          collection_adding_history,
                                                                          covert_to_usd_last_date),
                "month": await get_price_history_for_time_without_changing(average_price, 30, tz,
                                                                           collection_adding_history,
                                                                           covert_to_usd_last_date),
                "all_time": await get_price_history_for_time_without_changing(average_price, 0, tz,
                                                                              collection_adding_history,
                                                                              covert_to_usd_last_date)
            }
        })
        collection_dict['statistics']['market_cap'] = \
            collection_dict['statistics']['market_cap_history_dict']["average_price"]["week"]['items'][-1]['value']
    except Exception as e:
        empty = True
        print(f'market_cap_history_1 avg error: {e}')
        collection_dict['statistics']['market_cap_history_dict'].update({
            'average_price': {
                "week": await get_price_history_for_time_as_zero(7, tz),
                "month": await get_price_history_for_time_as_zero(30, tz),
                "all_time": await get_price_history_for_time_as_zero(0, tz)
            }
        })

    try:
        new_floor_price_history = dict()
        for key in floor_price.keys():
            if len(list(floor_price[key].values())) > 0:
                new_floor_price_history[key] = min(list(floor_price[key].values()) or 0)
            else:
                new_floor_price_history[key] = 0
        collection_dict['statistics']['market_cap_history_dict'].update({"floor_price": {
            "week": await get_price_history_for_time_without_changing(new_floor_price_history, 7, tz,
                                                                      collection_adding_history,
                                                                      covert_to_usd_last_date),
            "month": await get_price_history_for_time_without_changing(new_floor_price_history, 30, tz,
                                                                       collection_adding_history,
                                                                       covert_to_usd_last_date),
            "all_time": await get_price_history_for_time_without_changing(new_floor_price_history, 0, tz,
                                                                          collection_adding_history,
                                                                          covert_to_usd_last_date)
        }
        })
    except Exception as e:
        print(f'market_cap_history_1 floor error: {e}')
        if not empty:
            collection_dict['statistics']['market_cap_history_dict'].update({
                'floor_price': {
                    "week": await get_price_history_for_time_as_zero(7, tz),
                    "month": await get_price_history_for_time_as_zero(30, tz),
                    "all_time": await get_price_history_for_time_as_zero(0, tz)
                }
            })
        else:
            collection_dict['statistics']['market_cap_history_dict'] = dict()

    try:
        new_listed_nfts_history = dict()
        for key in listed_nfts.keys():
            if len(list(listed_nfts[key].values())) > 0:
                new_listed_nfts_history[key] = len(list(listed_nfts[key].values()))
            else:
                new_listed_nfts_history[key] = 0
        print(new_listed_nfts_history)
        collection_dict['statistics']['listed_nfts_amount_dict'] = {
            "week": await get_listed_nft_amount_for_time(new_listed_nfts_history, 7, tz, collection_adding_history),
            "month": await get_listed_nft_amount_for_time(new_listed_nfts_history, 30, tz, collection_adding_history),
            "all_time": await get_listed_nft_amount_for_time(new_listed_nfts_history, 0, tz, collection_adding_history)
        }
    except Exception as e:
        print(f'listed_nfts error: {e}')

    try:
        collection_dict['statistics']["resolve_purchase_history_dict"] = {
            "week": await get_amount_history_for_time(resolve_purchase_history, 7, tz),
            "month": await get_amount_history_for_time(resolve_purchase_history, 30, tz),
            "all_time": await get_amount_history_for_time(resolve_purchase_history, 0, tz)
        }
    except Exception as e:
        print(f'transactions_history error: {e}')

    try:
        new_sellers_history = dict()
        for key in sellers_history.keys():
            new_sellers_history[key] = len(list(sellers_history[key].values()))
        collection_dict['statistics']['sellers_history_dict'] = {
            "week": await get_amount_history_for_time(new_sellers_history, 7, tz, sellers_history),
            "month": await get_amount_history_for_time(new_sellers_history, 30, tz, sellers_history),
            "all_time": await get_amount_history_for_time(new_sellers_history, 0, tz, sellers_history)
        }
    except Exception as e:
        print(f'sellers_history error: {e}')

    try:
        new_buyers_history = dict()
        for key in buyers_history.keys():
            new_buyers_history[key] = len(list(buyers_history[key].values()))
        collection_dict['statistics']['buyers_history_dict'] = {
            "week": await get_amount_history_for_time(new_buyers_history, 7, tz, buyers_history),
            "month": await get_amount_history_for_time(new_buyers_history, 30, tz, buyers_history),
            "all_time": await get_amount_history_for_time(new_buyers_history, 0, tz, buyers_history)
        }
    except Exception as e:
        print(f'buyers_history error: {e}')

    try:
        new_owners_history = dict()
        for key in owners_history.keys():
            new_owners_history[key] = len(list(owners_history[key].values()))
        print(new_owners_history)
        collection_dict['statistics']['owners_history_dict'] = {
            "week": await get_amount_history_for_time_without_changing(new_owners_history, 7, tz,
                                                                       owners_history),
            "month": await get_amount_history_for_time_without_changing(new_owners_history, 30, tz,
                                                                        owners_history),
            "all_time": await get_amount_history_for_time_without_changing(new_owners_history, 0, tz,
                                                                           owners_history)
        }
        collection_dict['statistics']['total_owners'] = \
            collection_dict['statistics']['owners_history_dict']['week']['items'][-1]['value']
    except Exception as e:
        print(e)

    empty = False
    try:
        collection_dict['statistics']['price'].update({
            'average_price':
                {
                    "week": await get_price_history_for_time_without_changing(average_price, 7, tz),
                    "month": await get_price_history_for_time_without_changing(average_price, 30, tz),
                    "all_time": await get_price_history_for_time_without_changing(average_price, 0, tz)
                }
        })
    except Exception as e:
        print(f'avg price error: {e}')
        empty = True
        collection_dict['statistics']['price'].update({
            'average_price': {
                "week": await get_price_history_for_time_as_zero(7, tz),
                "month": await get_price_history_for_time_as_zero(30, tz),
                "all_time": await get_price_history_for_time_as_zero(0, tz)
            }
        })

    try:
        new_floor_price_history = dict()
        for key in floor_price.keys():
            if len(list(floor_price[key].values())) > 0:
                new_floor_price_history[key] = min(list(floor_price[key].values()) or 0)
            else:
                new_floor_price_history[key] = 0
        print(f'new_floor_price_history: {new_floor_price_history}')
        collection_dict['statistics']['price'].update({
            "floor_price":
                {
                    "week": await get_price_history_for_time_without_changing(new_floor_price_history, 7, tz),
                    "month": await get_price_history_for_time_without_changing(new_floor_price_history, 30, tz),
                    "all_time": await get_price_history_for_time_without_changing(new_floor_price_history, 0, tz)
                }
        })
        value = float("{:10.4f}".format((new_floor_price_history[
            list(new_floor_price_history.keys())[0]
        ]))) / convert
        collection_dict['statistics']['floor_price'] = str(value)

    except Exception as e:
        print(f'floor price error: {e}')
        if not empty:
            collection_dict['statistics']['price'].update({
                'floor_price': {
                    "week": await get_price_history_for_time_as_zero(7, tz),
                    "month": await get_price_history_for_time_as_zero(30, tz),
                    "all_time": await get_price_history_for_time_as_zero(0, tz)
                }
            })
        else:
            collection_dict['statistics']['price'] = dict()

    return collection_dict
