import asyncio

import aiohttp
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import FileResponse, StreamingResponse
from fastapi_limiter import FastAPILimiter
import aioredis
from uvicorn import Config, Server
from routers import email_sub, users, tokens, transactions, \
    collections, websockets, notifications, search, calendar, ipfs, collections_admin, referrals
from fastapi.middleware.cors import CORSMiddleware
import aioschedule as schedule
import os
from back_cycles.update_collection_statistics import update_statistics_for_all_collections
from back_cycles.update_main_collection_statistics import update_main_statistics_for_all_collections
from back_cycles.update_near_and_market_statistics \
    import update_near_and_market_statistics, delete_last_date, add_new_date
from back_cycles.update_nft_exchange_db import update_usd_exchange, get_missing_dates
from middlewares import auth
from back_cycles.delete_notification import delete_notification
import urllib.request as req
import config

origins_web = [
    "localhost:3000",
    "higgsfield.io",
    "higgsfield-frontend.netlify.app",
    'higgsfield-testnet.netlify.app',
    "192.168.1.42:3000",
    "192.168.0.42:3000"]

default_mask = ["http://", "https://", "http://www.", "https://www."]

origins = []

[[origins.append(mask + web) for mask in default_mask] for web in origins_web]

app = FastAPI(docs_url=None, openapi_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(email_sub.router)
app.include_router(tokens.router)
app.include_router(users.router)
app.include_router(transactions.router)
app.include_router(collections.router)
app.include_router(websockets.router)
app.include_router(notifications.router)
app.include_router(search.router)
app.include_router(calendar.router)
app.include_router(ipfs.router)
app.include_router(collections_admin.router)
app.include_router(referrals.router)


async def fix_collection_adding_and_deleting():
    coll = config.db.collections.find({"contract_address": {"$ne": None}})
    for c in coll:
        seen = list()
        items = list(
            config.db.tokens.find(
                {
                    "$or": [
                        {"_id": elem['token_id'], "history.activity_id": elem['activity_id']} for elem in c['history']
                    ],
                    "history.activity_id": {"$in": [elem['activity_id'] for elem in c['history']]}
                },
                {"history.$": 1}
            )
        )
        [x for x in c['history']
         if x in [{"token_id": elem['_id'], "activity_id": elem['history'][0]['activity_id']}
                  for elem in items] or seen.append(x)]

        config.db.collections.update_one({"_id": c["_id"]},
                                         {"$pull": {"history": {"activity_id": {"$in": [
                                             elem['activity_id'] for elem in seen
                                         ]}}}})

        for elem in config.db.tokens.find({"_id": {"$in": [elem['token_id'] for elem in seen]}}):
            history_simple = list()
            for in_elem in elem['history']:
                in_elem['token_id'] = elem['_id']
                in_elem_ = in_elem.copy()
                for d in ['activity_id', 'timestamp', 'owner_id']:
                    if d in in_elem_:
                        del in_elem_[d]
                if in_elem['type'] in ['collection_adding', 'collection_deleting'] and in_elem_ not in history_simple:
                    history_simple.append(in_elem_)
                    if in_elem['type'] == 'collection_adding':
                        config.db.collections.update_one({"_id": elem['collection_id'],
                                                          "items.token_id": {"$nin": [elem["_id"]]}},
                                                         {"$push": {
                                                             "items": {
                                                                 "token_id": elem['_id']}}})
                        config.db.collections.update_one({"_id": elem['collection_id'],
                                                          "history": {"$not": {"$elemMatch": {"token_id": elem['_id'],
                                                                                              "activity_id": in_elem[
                                                                                                  'activity_id']}}}},
                                                         {"$push": {
                                                             "history": {
                                                                 "token_id": elem['_id'],
                                                                 "activity_id": in_elem['activity_id']}}})
                    if in_elem['type'] == 'collection_deleting':
                        config.db.tokens.update_one({"_id": elem["_id"]},
                                                    {"$pull": {
                                                        "history": {
                                                            "activity_id": in_elem['activity_id']
                                                        }
                                                    }})
                        config.db.collections.update_one({"_id": elem['collection_id']},
                                                         {"$pull": {
                                                             "history": {
                                                                 "token_id": elem['_id'],
                                                                 "activity_id": in_elem['activity_id']}}})
                elif in_elem['type'] in ['collection_adding', 'collection_deleting']:
                    config.db.tokens.update_one({"_id": elem['_id']},
                                                {"$pull": {"history": {"activity_id": in_elem['activity_id']}}})
                    config.db.collections.update_one({"_id": in_elem['collection_id']},
                                                     {"$pull": {
                                                         "history": {
                                                             "token_id": elem['_id'],
                                                             "activity_id": in_elem['activity_id']}}})

        for elem in items:
            if elem['history'][0]['type'] == 'collection_deleting':
                config.db.tokens.update_one({"_id": elem["_id"]},
                                            {"$pull": {
                                                "history": {
                                                    "activity_id": elem['history'][0]['activity_id']
                                                }
                                            }})
                config.db.collections.update_one({"_id": c['_id']},
                                                 {"$pull": {
                                                     "history": {
                                                         "token_id": elem['_id'],
                                                         "activity_id": elem['history'][0]['activity_id']}}})
                config.db.collections.update_one({"_id": elem['history'][0]['collection_id']},
                                                 {"$pull": {
                                                     "history": {
                                                         "token_id": elem['_id'],
                                                         "activity_id": elem['history'][0]['activity_id']}}})

        for elem in config.db.tokens.find({"contract_id": c['contract_address']}):
            history_simple = list()
            for in_elem in elem['history']:
                in_elem['token_id'] = elem['_id']
                in_elem_ = in_elem.copy()
                for d in ['activity_id', 'timestamp', 'owner_id']:
                    if d in in_elem_:
                        del in_elem_[d]
                if in_elem['type'] in ['collection_adding', 'collection_deleting'] and in_elem_ not in history_simple:
                    history_simple.append(in_elem_)
                    if in_elem['type'] == 'collection_adding':
                        config.db.collections.update_one({"_id": elem['collection_id'],
                                                          "items.token_id": {"$nin": [elem["_id"]]}},
                                                         {"$push": {
                                                             "items": {
                                                                 "token_id": elem['_id']}}})
                        config.db.collections.update_one({"_id": elem['collection_id'],
                                                          "history": {"$not": {"$elemMatch": {"token_id": elem['_id'],
                                                                                              "activity_id": in_elem[
                                                                                                  'activity_id']}}}},
                                                         {"$push": {
                                                             "history": {
                                                                 "token_id": elem['_id'],
                                                                 "activity_id": in_elem['activity_id']}}})
                    if in_elem['type'] == 'collection_deleting':
                        config.db.tokens.update_one({"_id": elem["_id"]},
                                                    {"$pull": {
                                                        "history": {
                                                            "activity_id": in_elem['activity_id']
                                                        }
                                                    }})
                        config.db.collections.update_one({"_id": elem['collection_id']},
                                                         {"$pull": {
                                                             "history": {
                                                                 "token_id": elem['_id'],
                                                                 "activity_id": in_elem['activity_id']}}})
                elif in_elem['type'] in ['collection_adding', 'collection_deleting']:
                    config.db.tokens.update_one({"_id": elem['_id']},
                                                {"$pull": {"history": {"activity_id": in_elem['activity_id']}}})
                    config.db.collections.update_one({"_id": in_elem['collection_id']},
                                                     {"$pull": {
                                                         "history": {
                                                             "token_id": elem['_id'],
                                                             "activity_id": in_elem['activity_id']}}})

    print('Done')


async def scheduler():
    try:
        await get_missing_dates()
    except Exception as e:
        print(e)

    try:
        await update_usd_exchange()
    except Exception as e:
        print(e)

    try:
        await update_statistics_for_all_collections()
    except Exception as e:
        print(e)

    try:
        await update_main_statistics_for_all_collections()
    except Exception as e:
        print(e)

    try:
        await update_near_and_market_statistics()
    except Exception as e:
        print(e)

    try:
        await delete_notification()
    except Exception as e:
        print(e)

    schedule.every().hour.do(update_usd_exchange)
    schedule.every().hour.do(update_statistics_for_all_collections)
    schedule.every().hour.do(update_main_statistics_for_all_collections)
    schedule.every().hour.do(update_near_and_market_statistics)
    schedule.every().hour.do(delete_notification)
    schedule.every().day.at('23:55').do(add_new_date)
    schedule.every().day.at('00:05').do(delete_last_date)
    while True:
        await schedule.run_pending()
        await asyncio.sleep(60)


@app.get(f"{config.root_path}" + "/{folder}/get_file/{filename}")
async def get_file(folder: str, filename: str):
    if not os.path.exists(config.app_location + f'/files/{folder}/' + filename):
        raise HTTPException(status_code=404, detail="Not found")
    try:
        return FileResponse(config.app_location + f'/files/{folder}/' + filename)
    except Exception:
        raise HTTPException(status_code=400, detail="Could not load file")


@app.post(f"{config.root_path}" + "/{folder}/upload", dependencies=[auth.Security(auth.get_api_key)])
async def upload_file(folder, file: UploadFile = File(None)):
    with open(config.app_location + f'/files/{folder}/' + req.url2pathname(file.filename), 'wb') as fp:
        fp.write(await file.read())


@app.on_event('startup')
async def on_start():
    asyncio.create_task(scheduler())
    config.db.users.create_index([("user_wallet", -1)])
    config.db.tokens.create_index([("owner_id", -1)])
    config.db.tokens.create_index([("contract_id", -1)])
    config.db.tokens.create_index([("token_id", -1)])
    config.db.users.create_index([("customURL", -1)])
    config.db.collections.create_index([("customURL", -1)])
    config.db.ipfs_keys.create_index([("uses", 1)])
    config.db.tokens.create_index([("reference.score", -1)])
    redis = await aioredis.from_url(f"redis://{config.internal_server_host}", encoding="utf8")
    await FastAPILimiter.init(redis)

    for ai_field in config.ai_fields:

        ai_collection_users = list(config.db.autoIncrement.find({"field_name": ai_field}))

        if len(ai_collection_users) == 0:
            config.db.autoIncrement.insert_one({"field_name": ai_field,
                                                "id": 0})
        elif len(ai_collection_users) != 1:
            raise ValueError('found two identical ai_collection_fields, remove one')

    for elem in config.base_categories:
        if config.db.categories.find_one({"name": elem}) is None:
            config.db.categories.insert_one({"name": elem})

    for elem in config.IPFS_API_KEYS.split(','):
        if config.db.ipfs_keys.find_one({"key": elem}) is None:
            config.db.ipfs_keys.insert_one({"key": elem,
                                            "uses": 0})

    for elem in config.referral_levels:
        if config.db.referral_levels.find_one({"level": elem['level']}) is None:
            async with aiohttp.ClientSession() as client:
                async with client.get(elem['image_link']) as resp:
                    if resp.status == 200:
                        filename = f'level_{elem["level"]}.splinecode'
                        filepath = f'files/referral_levels/{filename}'
                        file_read = await resp.read()
                        with open(filepath,
                                  'wb') as file:
                            file.write(file_read)
                        elem['image_link'] = filename
                        config.db.referral_levels.insert_one(elem)

    # base_user = config.db.users.find_one()
    # del base_user['_id']
    # for i in range(20):
    #     base_user['user_id'] = f'id{i+1}'
    #     base_user['user_wallet'] = str(i)
    #     config.db.users.update_one({"user_wallet": str(i)}, {"$set": base_user}, upsert=True)

    # asyncio.create_task(fix_collection_adding_and_deleting())

    # coll = config.db.collections.distinct("contract_address")
    # for c in coll:
    #     category = config.db.collections.find_one({"contract_address": c})['category_id']
    #     config.db.tokens.update_many({"contract_id": c},
    #                                  {"$set": {"category": category}})
    # category = config.db.categories.find_one({"name": "art"})['_id']
    # config.db.tokens.update_many({"contract_id": {"$nin": coll}},
    #                              {"$set": {"category": category}})
    # for token in config.db.tokens.find({"price": {"$ne": None}}):
    #     price = Decimal128(token['price'])
    #     config.db.tokens.update_one({"_id": token['_id']},
    #                                 {"$set": {"price": price}})


@app.on_event("shutdown")
async def shutdown():
    await FastAPILimiter.close()


if __name__ == "__main__":
    loop_main = asyncio.new_event_loop()
    config_server = Config(app=app, loop=loop_main, host=config.server_host, port=config.port,
                           limit_concurrency=config.limit_concurrency)
    server = Server(config_server)
    loop_main.run_until_complete(server.serve())
