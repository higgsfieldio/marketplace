from fastapi import APIRouter, HTTPException, Depends
from utils import main as main_additional_funcs
from utils import search as search_additional_funcs
from models import search as search_models
from fastapi_limiter.depends import RateLimiter
import config
import asyncio
from bson import ObjectId
import datetime

router = APIRouter(
    prefix=f"{config.root_path}/search",
    tags=["search"],
    responses={404: {"description": "Not found"}}
)


@router.post("/base", dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def search_for_base_items(search: search_models.Search):
    tokens_query = {
        "from": search.from_index,
        "size": search.limit,
        "query": {
            "match": {
                "name": {
                    "query":
                        search.text,
                    "analyzer": "standard"
                }
            }
        },
        "sort": [
            "_score", {
                "score": "desc"
            }
        ]
    }
    collections_query = {
        "from": search.from_index,
        "size": search.limit,
        "query": {
            "match": {
                "name": {
                    "query":
                        search.text,
                    "analyzer": "standard"
                }
            }
        },
        "sort": [
            "_score"
        ]
    }
    task_list = list()
    task_list.append(asyncio.create_task(search_additional_funcs.check_info_in_elasticsearch('tokens_mainnet_index',
                                                                                             tokens_query)))
    task_list.append(
        asyncio.create_task(search_additional_funcs.check_info_in_elasticsearch('collections_mainnet_index',
                                                                                collections_query)))
    possible_items = await asyncio.gather(*task_list)
    possible_tokens = possible_items[0]['sources']
    possible_collections = possible_items[1]['sources']

    categories = dict()
    users = list()
    collection_users = list()
    for token in possible_tokens:
        if 'category' in token and ObjectId(token['category']) not in categories:
            categories[ObjectId(token['category'])] = config.db.categories.find_one(
                {"_id": ObjectId(token['category'])})
        if token['owner_id'] not in users:
            users.append(token['owner_id'])

    for collection in possible_collections:
        if collection['creator_id'] not in users:
            collection_users.append(collection['creator_id'])
    dict_users = dict()
    [dict_users.update({elem['user_wallet']: elem, str(elem['_id']): elem})
     for elem in list(config.db.users.find({"user_wallet": {"$in": users}}))]
    [dict_users.update({str(elem['_id']): elem, elem['user_wallet']: elem})
     for elem in list(config.db.users.find({"_id": {"$in": collection_users}}))]
    for user in users:
        if user not in dict_users:
            dict_users[user] = None

    for token in possible_tokens:
        token['owner'] = None
        if token['owner_id'] in dict_users:
            user = dict_users[token['owner_id']]
        else:
            user = config.db.users.find_one({"user_wallet": token['owner_id']})
            dict_users.update({user['user_wallet']: user, str(user['_id']): user})
        if user is not None:
            token['owner'] = await main_additional_funcs.get_small_user_object(user)
        token['likes'] = len(token['likes'])

    for collection in possible_collections:
        collection['creator'] = None
        if collection['creator_id'] in dict_users:
            user = dict_users[collection['creator_id']]
        else:
            user = config.db.users.find_one({"_id": ObjectId(collection['creator_id'])})
            dict_users.update({user['user_wallet']: user, str(user['_id']): user})
        if user is not None:
            collection['creator'] = await main_additional_funcs.get_small_user_object(user)

        collection['likes'] = \
            list(config.db.tokens.aggregate([
                {"$match": {"collection_id": ObjectId(collection['_id'])}},
                {"$group": {"_id": None, "sum": {"$sum": {"$size": "$likes"}}}}]))[0]['sum']
        collection['items'] = list()
        for token in \
                config.db.tokens.find({"collection_id": ObjectId(collection['_id'])}).sort([("likes", -1)]).limit(5):
            collection['items'].append(await main_additional_funcs.fill_in_single_token_object(token, categories))

        collection['customURLorID'] = collection['_id'] if 'customURL' not in collection \
                                                           or collection['customURL'] is None \
            else collection['customURL']

        for to_delete in ['activities', 'bio', 'cover_url', 'date_create', 'explicitContent', 'history',
                          'is_on_popular', 'statistics', 'creator_id']:
            if to_delete in collection:
                del collection[to_delete]
    if possible_tokens is None and possible_collections is None:
        raise HTTPException(status_code=404, detail='No items found')
    return await main_additional_funcs.delete_object_ids_from_dict(
        dict(collections=possible_collections,
             collections_total=possible_items[1]['total'],
             tokens=possible_tokens,
             tokens_total=possible_items[0]['total']))


@router.get("/popular", dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def search_for_popular_items():
    task_list = list()
    task_list.append(asyncio.create_task(search_additional_funcs.get_popular_collections()))
    task_list.append(asyncio.create_task(search_additional_funcs.get_popular_categories()))
    resp_async = await asyncio.gather(*task_list)
    response = dict(collections=resp_async[0], categories=resp_async[1])
    return await main_additional_funcs.delete_object_ids_from_dict(response)


@router.post('/statistics', dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def search_for_statistics(search: search_models.SearchStatistics):
    collections = list(config.db.collections.find({
        "items.0": {"$exists": 1},
        f"statistics."
        f"{search.range if search.sort_name not in ['market_cap_average', 'average_price'] else 'hours_24'}."
        f"{search.sort_name}":
            {"$ne": None}})
                       .sort([
        (
            f"statistics."
            f"{search.range if search.sort_name not in ['market_cap_average', 'average_price'] else 'hours_24'}"
            f".{search.sort_name}", search.sort_order
        )])
                       .skip(search.from_index)
                       .limit(search.limit))
    for collection in collections:
        collection['items'] = len(collection['items'])
        collection['customURLorID'] = collection['_id'] if 'customURL' not in collection \
                                                           or collection['customURL'] is None \
            else collection['customURL']

        for to_delete in ['bio', 'cover_url', 'date_create', 'explicitContent', 'history',
                          'is_on_popular', 'creator_id']:
            if to_delete in collection:
                del collection[to_delete]

    return await main_additional_funcs.delete_object_ids_from_list(collections)


@router.post('/explore_collections', dependencies=[Depends(RateLimiter(times=config.max_req,
                                                                       seconds=config.timeout_req))])
async def explore_collections(search: search_models.SearchExploreCollections):
    ranges = {
        1: "statistics.hours_24.volume",
        7: "statistics.days_7.volume",
        30: "statistics.days_30.volume",
        1000: "statistics.all_time.volume",
    }
    if search.days not in ranges:
        raise HTTPException(status_code=400, detail='Days not in basic range')
    find_query = {"items.0": {"$exists": 1}}
    if search.volume_next is not None:
        find_query.update({ranges[search.days]: {"$lte": search.volume_next}})
    if search.next_id is not None:
        find_query.update({"_id": {"$gt": ObjectId(search.next_id)}})
    if search.name is not None:
        category = config.db.categories.find_one({"name": search.name})
        if category is not None:
            find_query["category_id"] = category['_id']
    collections = list(config.db.collections.find(find_query).sort([(ranges[search.days], -1), ("_id", 1)])
                       .limit(search.limit))
    creators = list()
    for collection in collections:
        if collection['creator_id'] not in creators:
            creators.append(collection['creator_id'])
    dict_users = dict()
    [dict_users.update({elem['_id']: elem})
     for elem in list(config.db.users.find({"_id": {"$in": creators}}))]
    for user in creators:
        if user not in dict_users:
            dict_users[user] = None
    tasks = list()
    for collection_id in range(len(collections)):
        tasks.append(asyncio.create_task(main_additional_funcs.get_collection_small_object(collections[collection_id],
                                                                                           dict_users,
                                                                                           ranges[search.days])))
    collections = await asyncio.gather(*tasks)

    return await main_additional_funcs.delete_object_ids_from_list(collections)


@router.post('/category', dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def get_category_items(search: search_models.SearchCategory):
    category = config.db.categories.find_one({"name": search.name.lower()})
    if category is None:
        raise HTTPException(status_code=400, detail='category not found')
    find_query = {"category": category['_id']}
    if search.next_id is not None:
        find_query["_id"] = {"$lt": ObjectId(search.next_id)}
    if search.is_only_on_sale:
        find_query['price'] = {"$ne": None}
    tokens = list()
    for token in list(config.db.tokens.find({"$query": find_query, "$orderby": {"$natural": -1}}).limit(search.limit)):
        token_ = await main_additional_funcs.fill_in_single_token_object(token)
        user = config.db.users.find_one({"user_wallet": token['owner_id']})
        token_['owner'] = await main_additional_funcs.get_small_user_object(user) if user is not None else None
        token_['likes'] = len(token['likes'])
        tokens.append(token_)

    return await main_additional_funcs.delete_object_ids_from_list(tokens)


@router.get('/main_statistics', dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def get_main_statistics():
    stats = list(
        config.db.statistics.find(
            {
                "name": {
                    "$in": [
                        "near_accounts_stats",
                        "near_transactions_stats",
                        "marketplace_purchase_near_stats",
                        "marketplace_purchase_amount_stats"
                    ]
                }
            }
        )
    )
    accounts_stats, transactions_stats, purchase_near, purchase_amount = None, None, None, None
    for elem in stats:
        if elem['name'] == 'near_accounts_stats':
            accounts_stats = elem
        elif elem['name'] == 'near_transactions_stats':
            transactions_stats = elem
        elif elem['name'] == 'marketplace_purchase_near_stats':
            purchase_near = elem
        elif elem['name'] == 'marketplace_purchase_amount_stats':
            purchase_amount = elem

    if None in [accounts_stats, transactions_stats, purchase_near, purchase_amount]:
        raise HTTPException(status_code=400, detail='Some stat returned None')

    return await main_additional_funcs.delete_object_ids_from_dict(
        {"near_accounts_stats": accounts_stats,
         "near_transactions_stats": transactions_stats,
         "marketplace_purchase_near_stats": await search_additional_funcs.prepare_for_stats(purchase_near),
         "marketplace_purchase_amount_stats": await search_additional_funcs.prepare_for_stats(purchase_amount),
         })


@router.on_event('startup')
async def creating_indexes():
    config.db.collections.create_index([("is_on_popular", 1)])
    config.db.collections.create_index([("date_create", -1)])
    config.db.tokens.create_index([("category", 1)])
    config.db.tokens.create_index([("likes", 1)])
    config.db.tokens.create_index([("collection_id", 1)])
    config.db.collections.create_index([("category_id", 1)])
    config.db.collections.create_index([("statistics.hours_24.market_cap_average", -1)])
    config.db.collections.create_index([("statistics.hours_24.volume", -1)])
    config.db.collections.create_index([("statistics.hours_24.floor_price", -1)])
    config.db.collections.create_index([("statistics.hours_24.average_price", -1)])
    config.db.collections.create_index([("statistics.days_7.volume", -1)])
    config.db.collections.create_index([("statistics.days_7.floor_price", -1)])
    config.db.collections.create_index([("statistics.days_7.average_price", -1)])
    config.db.collections.create_index([("statistics.days_30.volume", -1)])
    config.db.collections.create_index([("statistics.days_30.floor_price", -1)])
    config.db.collections.create_index([("statistics.days_30.average_price", -1)])
    config.db.collections.create_index([("statistics.all_time.volume", -1)])
