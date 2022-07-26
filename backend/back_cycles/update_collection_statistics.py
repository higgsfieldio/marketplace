import datetime
from utils.statistics import convert_to_usd_exchange_rate, get_price_history_for_time_without_changing
from utils.main import update_queries_in_db
import config
import copy


async def get_floor_minimum_price(floor_price: dict, period: int):
    try:
        new_floor_price_history = dict()
        for key in floor_price.keys():
            if len(list(floor_price[key].values())) > 0:
                new_floor_price_history[key] = min(list(floor_price[key].values()) or 0)
            else:
                new_floor_price_history[key] = 0
        v = (await get_price_history_for_time_without_changing(new_floor_price_history, period, 'UTC'))
        items = [v for v in v['items']]
        min_value = None
        for elem in items:
            if elem['value'] != '0' and (min_value is None or float(elem['value']) < min_value):
                min_value = float(elem['value'])
                min_timestamp = float(elem['timestamp'])
        if min_value is None:
            raise ValueError('min_value is None')
        mid_value_date = datetime.datetime.fromtimestamp(min_timestamp).date()
    except Exception as e:
        print(e)
        min_value = 0
        mid_value_date = 0
    return min_value, mid_value_date


async def update_statistics_for_all_collections():
    last_timestamp = datetime.datetime.now()
    covert_to_usd_last_date = await convert_to_usd_exchange_rate(last_timestamp.date())
    collections = list(config.db.collections.find({"items.0": {"$exists": True}}))
    convert = 1000000000000000000000000
    update_queries = dict(collections=list())
    for collection in collections:
        floor_price = {}
        purchase_price_summary = {}
        purchase_price_summary_dollars = {}
        resolve_purchase_history = {}
        collection_adding_history = {}
        volume = 0.0
        volume_24_hours = 0.0
        volume_24_hours_dollars = 0.0
        volume_24_hours_yesterday = 0.0
        count_24_hours = 0
        volume_7_days = 0.0
        volume_7_days_dollars = 0.0
        volume_7_days_yesterday = 0.0
        count_7_days = 0
        volume_30_days = 0.0
        volume_30_days_dollars = 0.0
        volume_30_days_yesterday = 0.0
        count_30_days = 0
        history_of_collection_tokens = list()
        for elem in config.db.tokens.find({"_id": {"$in": [elem['token_id'] for elem in collection['items']]}}):
            for in_elem in elem['history']:
                in_elem['token_id'] = str(elem['token_id'])
                history_of_collection_tokens.append(in_elem)
        history_of_collection_tokens = sorted(
            history_of_collection_tokens,
            key=lambda item: datetime.datetime.fromtimestamp(float(item['timestamp'])))

        d = {}
        to_send = list()

        for elem in collection['history']:
            if elem['token_id'] not in d:
                d[elem['token_id']] = list()
            d[elem['token_id']].append(elem['activity_id'])
            to_send.append({"_id": elem['token_id'], "history.activity_id": elem['activity_id']})

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
        ), key=lambda item: datetime.datetime.fromtimestamp(float(item['history']['timestamp']))):
            in_elem = elem['history']
            if in_elem['activity_id'] not in d[elem["_id"]]:
                continue
            in_elem['token_id'] = str(elem['_id'])
            if in_elem.get('type') == 'collection_adding':
                date_ = str(datetime.datetime.fromtimestamp(float(in_elem.get("timestamp"))).date())
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
                date_ = str(datetime.datetime.fromtimestamp(float(in_elem.get("timestamp"))).date())
                if date_ not in collection_adding_history:
                    last_date_ = list(collection_adding_history.keys())
                    if len(last_date_) > 0:
                        last_date_ = last_date_[-1]
                        collection_adding_history[date_] = collection_adding_history[last_date_] - 1
                    else:
                        collection_adding_history[date_] = 0
                else:
                    collection_adding_history[date_] -= 1

        for history_elem in history_of_collection_tokens:
            timestamp = datetime.datetime.fromtimestamp(float(history_elem["timestamp"]))
            if history_elem['type'] in ['add_market_data', 'refresh_metadata_price_update',
                                        'refresh_metadata_owner_and_price_update'] \
                    and isinstance(history_elem.get('price'), str):
                if history_elem['price'] is not None:
                    if str(timestamp.date()) not in floor_price:
                        last_date = list(floor_price.keys())
                        if len(last_date) > 0:
                            floor_price[str(timestamp.date())] = \
                                copy.deepcopy(floor_price[last_date[-1]])
                        else:
                            floor_price[str(timestamp.date())] = dict()
                    floor_price[str(timestamp.date())][str(history_elem['token_id'])] = \
                        int(history_elem['price'])
            elif history_elem['type'] == 'update_market_data':
                if history_elem['price'] is not None:
                    if str(timestamp.date()) not in floor_price:
                        last_date = list(floor_price.keys())
                        if len(last_date) > 0:
                            floor_price[str(timestamp.date())] = \
                                copy.deepcopy(floor_price[last_date[-1]])
                    if str(history_elem['token_id']) in floor_price[str(timestamp.date())]:
                        floor_price[str(timestamp.date())][str(history_elem['token_id'])] \
                            = int(history_elem['price'])

            elif history_elem['type'] in ['resolve_purchase',
                                          'refresh_metadata_owner_and_price_update',
                                          'delete_market_data',
                                          'refresh_metadata_price_update']:
                if str(timestamp.date()) not in floor_price:
                    last_date = list(floor_price.keys())
                    if len(last_date) > 0:
                        floor_price[str(timestamp.date())] = \
                            copy.deepcopy(floor_price[last_date[-1]])
                        if str(history_elem['token_id']) in floor_price[str(timestamp.date())]:
                            del floor_price[str(timestamp.date())][str(history_elem['token_id'])]
                else:
                    if str(history_elem['token_id']) in floor_price[str(timestamp.date())]:
                        del floor_price[str(timestamp.date())][str(history_elem['token_id'])]

            if history_elem['type'] == 'resolve_purchase':
                date = str(timestamp.date())
                if date not in purchase_price_summary:
                    purchase_price_summary[date] = int(history_elem.get('price'))
                    purchase_price_summary_dollars[date] \
                        = (int(history_elem['price']) / convert) * \
                          await convert_to_usd_exchange_rate(timestamp.date()) \
                        if last_timestamp != timestamp else covert_to_usd_last_date
                    resolve_purchase_history[date] = 1
                else:
                    purchase_price_summary[date] += int(history_elem.get('price'))
                    purchase_price_summary_dollars[date] \
                        += (int(history_elem['price']) / convert) * \
                           await convert_to_usd_exchange_rate(timestamp.date()) \
                        if last_timestamp != timestamp else covert_to_usd_last_date
                    resolve_purchase_history[date] += 1

        for history_elem in history_of_collection_tokens:
            timestamp = datetime.datetime.fromtimestamp(float(history_elem["timestamp"]))
            if history_elem['type'] != 'resolve_purchase':
                continue

            volume += (int(history_elem['price']) / convert)

            if timestamp > last_timestamp - datetime.timedelta(days=1):
                volume_24_hours += (int(history_elem['price']) / convert)
                count_24_hours += 1
                if timestamp.date() == last_timestamp.date():
                    volume_24_hours_dollars += \
                        (int(history_elem['price']) / convert) * await convert_to_usd_exchange_rate(timestamp.date()) \
                            if last_timestamp != timestamp else covert_to_usd_last_date
                else:
                    volume_24_hours_dollars += \
                        (int(history_elem['price']) / convert) * \
                        await convert_to_usd_exchange_rate(timestamp.date())
            elif timestamp >= last_timestamp - datetime.timedelta(days=2):
                volume_24_hours_yesterday += (int(history_elem['price']) / convert)

            ###############################################################

            if timestamp > last_timestamp - datetime.timedelta(days=7):
                volume_7_days += (int(history_elem['price']) / convert)
                count_7_days += 1
                if timestamp.date() == last_timestamp.date():
                    volume_7_days_dollars += \
                        (int(history_elem['price']) / convert) * \
                        await convert_to_usd_exchange_rate(timestamp.date()) \
                            if last_timestamp != timestamp else covert_to_usd_last_date
                else:
                    volume_7_days_dollars += \
                        (int(history_elem['price']) / convert) * \
                        await convert_to_usd_exchange_rate(timestamp.date())
            elif timestamp >= last_timestamp - datetime.timedelta(days=14):
                volume_7_days_yesterday += (int(history_elem['price']) / convert)

            ###############################################################

            if timestamp > last_timestamp - datetime.timedelta(days=30):
                volume_30_days += (int(history_elem['price']) / convert)
                count_30_days += 1
                if timestamp.date() == last_timestamp.date():
                    volume_30_days_dollars += \
                        (int(history_elem['price']) / convert) * await convert_to_usd_exchange_rate(timestamp.date()) \
                            if last_timestamp != timestamp else covert_to_usd_last_date
                else:
                    volume_30_days_dollars += \
                        (int(history_elem['price']) / convert) * \
                        await convert_to_usd_exchange_rate(timestamp.date())
            elif timestamp >= last_timestamp - datetime.timedelta(days=60):
                volume_30_days_yesterday += (int(history_elem['price']) / convert)

        floor_price = dict(reversed(list(floor_price.items())))

        floor_for_24_hours, floor_24_date = await get_floor_minimum_price(floor_price, 1)
        if floor_24_date == last_timestamp.date():
            floor_for_24_hours_dollars = \
                floor_for_24_hours * covert_to_usd_last_date
        elif floor_for_24_hours != 0:
            floor_for_24_hours_dollars = \
                floor_for_24_hours * \
                await convert_to_usd_exchange_rate(floor_24_date)
        else:
            floor_for_24_hours_dollars = 0

        ###############################################

        floor_for_7_days, floor_7_days = await get_floor_minimum_price(floor_price, 7)
        if floor_7_days == last_timestamp.date():
            floor_for_7_days_dollars = \
                floor_for_7_days * covert_to_usd_last_date
        elif floor_for_7_days != 0:
            floor_for_7_days_dollars = \
                floor_for_7_days * \
                await convert_to_usd_exchange_rate(floor_7_days)
        else:
            floor_for_7_days_dollars = 0

        ##############################################

        floor_for_30_days, floor_30_date = await get_floor_minimum_price(floor_price, 30)
        if floor_30_date == last_timestamp.date():
            floor_for_30_days_dollars = \
                floor_for_30_days * covert_to_usd_last_date
        elif floor_for_30_days != 0:
            floor_for_30_days_dollars = \
                floor_for_30_days * \
                await convert_to_usd_exchange_rate(floor_30_date)
        else:
            floor_for_30_days_dollars = 0

        average_price = dict()
        average_price_dollars = dict()
        keys = list(purchase_price_summary.keys())
        for key_id in range(len(keys)):
            base_sum = 0
            base_sum_dollars = 0
            summary_tokens = 0
            for key_internal_id in range(0, key_id):
                key = keys[key_internal_id]
                base_sum += purchase_price_summary[key]
                base_sum_dollars += purchase_price_summary_dollars[key]
                summary_tokens += resolve_purchase_history[key]
            key = keys[key_id]
            average_price[key] = round((base_sum + purchase_price_summary[key])
                                       / (summary_tokens + resolve_purchase_history[key]))
            average_price_dollars[key] = \
                round((base_sum_dollars + purchase_price_summary_dollars[key])
                      / (summary_tokens + resolve_purchase_history[key]))
        average_price = dict(reversed(list(average_price.items())))

        market_cap_average_dollars = float((
                                               await get_price_history_for_time_without_changing(
                                                   average_price, 1, 'UTC',
                                                   collection_adding_history,
                                                   {str(last_timestamp.date()): covert_to_usd_last_date})
                                           )['items'][0]['value'])

        market_cap_average = float((
                                       await get_price_history_for_time_without_changing(
                                           average_price, 1, 'UTC',
                                           collection_adding_history)
                                   )['items'][0]['value'])

        if volume_24_hours_yesterday != 0.0:
            volume_percent_24_hours = float(
                "{:.0%}".format((volume_24_hours - volume_24_hours_yesterday)
                                / volume_24_hours_yesterday)[:-1])
        elif volume_24_hours != 0.0 and volume_24_hours_yesterday == 0.0:
            volume_percent_24_hours = 100.0
        else:
            volume_percent_24_hours = 0.0

        if volume_7_days_yesterday != 0.0:
            volume_percent_7_days = float(
                "{:.0%}".format((volume_7_days - volume_7_days_yesterday)
                                / volume_7_days_yesterday)[:-1])
        elif volume_7_days != 0.0 and volume_7_days_yesterday == 0.0:
            volume_percent_7_days = 100.0
        else:
            volume_percent_7_days = 0.0

        if volume_30_days_yesterday != 0.0:
            volume_percent_30_days = float(
                "{:.0%}".format((volume_30_days - volume_30_days_yesterday)
                                / volume_30_days_yesterday)[:-1])
        elif volume_30_days != 0.0 and volume_30_days_yesterday == 0.0:
            volume_percent_30_days = 100.0
        else:
            volume_percent_30_days = 0.0

        average_24_hours = float("{:10.4f}".format(
            sum([float(elem['value']) for elem in (await get_price_history_for_time_without_changing(
                average_price, 1, 'UTC'))['items']]) / 1))

        average_7_days = float("{:10.4f}".format(
            sum([float(elem['value']) for elem in (await get_price_history_for_time_without_changing(
                average_price, 7, 'UTC'))['items']]) / 7))

        average_30_days = float("{:10.4f}".format(
            sum([float(elem['value']) for elem in (await get_price_history_for_time_without_changing(
                average_price, 30, 'UTC'))['items']]) / 30))

        average_24_hours_dollars = float("{:10.4f}".format(
            sum([float(elem['value']) for elem in (await get_price_history_for_time_without_changing(
                average_price_dollars, 1, 'UTC', do_convert=False))['items']]) / 1))

        average_7_days_dollars = float("{:10.4f}".format(
            sum([float(elem['value']) for elem in (await get_price_history_for_time_without_changing(
                average_price_dollars, 7, 'UTC', do_convert=False))['items']]) / 7))

        average_30_days_dollars = float("{:10.4f}".format(
            sum([float(elem['value']) for elem in (await get_price_history_for_time_without_changing(
                average_price_dollars, 30, 'UTC', do_convert=False))['items']]) / 30))

        update_queries['collections'].append(dict(
            type='update_one',
            find_query={"_id": collection['_id']},
            update_query={
                "$set": {
                    "statistics": {
                        "hours_24": {
                            "market_cap_average":
                                market_cap_average,
                            "market_cap_average_dollars": market_cap_average_dollars,
                            "volume": volume_24_hours,
                            "volume_dollars": float("{:10.4f}".format(volume_24_hours_dollars)),
                            "volume_percent": volume_percent_24_hours,
                            "average_price": average_24_hours,
                            "average_price_dollars": average_24_hours_dollars,
                            "floor_price": float("{:10.4f}".format(floor_for_24_hours)),
                            "floor_price_dollars": float("{:10.4f}".format(floor_for_24_hours_dollars))
                        },
                        "days_7": {
                            "volume": volume_7_days,
                            "volume_dollars": float("{:10.4f}".format(volume_7_days_dollars)),
                            "volume_percent": volume_percent_7_days,
                            "average_price": average_7_days,
                            "average_price_dollars": average_7_days_dollars,
                            "floor_price": float("{:10.4f}".format(floor_for_7_days)),
                            "floor_price_dollars": float("{:10.4f}".format(floor_for_7_days_dollars))
                        },
                        "days_30": {
                            "volume": volume_30_days,
                            "volume_dollars": float("{:10.4f}".format(volume_30_days_dollars)),
                            "volume_percent": volume_percent_30_days,
                            "average_price": average_30_days,
                            "average_price_dollars": average_30_days_dollars,
                            "floor_price": float("{:10.4f}".format(floor_for_30_days)),
                            "floor_price_dollars": float("{:10.4f}".format(floor_for_30_days_dollars))
                        },
                        "all_time": {
                            "volume": volume
                        }
                    }
                }
            }

        )
        )
    await update_queries_in_db(update_queries)
