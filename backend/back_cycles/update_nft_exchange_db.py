import datetime
import aiohttp
import config
import json
import time


async def update_usd_exchange():
    date_obj = datetime.datetime.now().date()
    date = str(date_obj)
    date_to_send = date_obj.strftime("%d-%m-%Y")
    convert = config.near_usd_db.dates.find_one({"date": date})
    if convert is not None:
        return convert['value']
    else:
        try:
            timeout_float = 5.0
            timeout = aiohttp.ClientTimeout(timeout_float)
            async with aiohttp.ClientSession(timeout=timeout) as client:
                async with client.get(f'https://api.coingecko.com/api/v3/coins/near/history?date={date_to_send}',
                                      timeout=timeout_float) as resp:
                    if resp.status == 200:
                        response = json.loads(await resp.text())
                        config.near_usd_db.dates.insert_one({"date": date,
                                                             "timestamp_utc": str(time.mktime(date_obj.timetuple())),
                                                             "value": response['market_data']['current_price']['usd']})
                    else:
                        print(resp.status, await resp.json())
        except Exception as e:
            print(e)


async def get_missing_dates():
    last_date = list(config.near_usd_db.dates.find())[-1]['date']
    date = datetime.datetime.strptime(last_date, '%Y-%m-%d').date()
    now_date = datetime.datetime.now().date()
    while date != now_date:
        date = date + datetime.timedelta(days=1)
        if config.near_usd_db.dates.find_one({"date": str(date)}) is not None:
            continue
        try:
            timeout_float = 5.0
            timeout = aiohttp.ClientTimeout(timeout_float)
            date_to_send = date.strftime("%d-%m-%Y")
            async with aiohttp.ClientSession(timeout=timeout) as client:
                async with client.get(f'https://api.coingecko.com/api/v3/coins/near/history?date={date_to_send}',
                                      timeout=timeout_float) as resp:
                    if resp.status == 200:
                        response = json.loads(await resp.text())
                        config.near_usd_db.dates.insert_one({"date": str(date),
                                                             "timestamp_utc": str(time.mktime(date.timetuple())),
                                                             "value": response['market_data']['current_price']['usd']})
                    else:
                        print(resp.status, await resp.json())
        except Exception as e:
            print(e)
