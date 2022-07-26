from utils import main as main_additional_funcs
import config
import aiohttp
import json


async def prepare_for_stats(info: dict):
    if info['stats'][-2]['value'] != 0:
        volume_percent = float(
            "{:.0%}".format((info['stats'][-1]['value'] - info['stats'][-2]['value'])
                            / info['stats'][-2]['value'])[:-1])
    elif info['stats'][-1]['value'] != 0 and info['stats'][-2]['value'] == 0:
        volume_percent = 100.0
    else:
        volume_percent = 0.0
    info['volume_percent'] = volume_percent
    max_value = max([int(d['value']) for d in info['stats']])
    info['stats'] = [
        {
            'value': int(elem['value']),
            'date': str(elem['date']),
            'percent': int("{:.0%}".format(int(elem['value']) / max_value)[:-1])
            if max_value != 0 else 0
        }
        for elem in info['stats'].copy()]
    return info


async def check_info_in_elasticsearch(index: str, query: dict):
    async with aiohttp.ClientSession() as client:
        async with client.get(f'{config.elasticsearch_link}/{index}/_search?pretty=true', json=query) as resp:
            if resp.status == 200:
                response = json.loads(await resp.text())
                sources = list()
                total = response['hits']['total']['value']
                for source in response['hits']['hits']:
                    new_source = source["_source"]
                    new_source['_id'] = source["_id"]
                    if index == 'tokens_mainnet_index' and 'price' not in new_source:
                        new_source['price'] = None
                    sources.append(new_source)
                return dict(total=total, sources=sources)
    return dict(total=0, sources=[])


async def get_popular_collections():
    collections_on_popular = list(config.db.collections.find({"items.0": {"$exists": 1}, "is_on_popular": True}))
    collections = list(config.db.collections.find({"items.0": {"$exists": 1},
                                                   "statistics.hours_24.volume": {"$ne": None}, "is_on_popular": False})
                       .sort([(f"statistics.hours_24.volume", -1)])
                       .limit(6 - len(collections_on_popular)))

    creators = list()
    for collection in collections:
        if collection['creator_id'] not in creators:
            creators.append(collection['creator_id'])

    for collection in collections_on_popular:
        if collection['creator_id'] not in creators:
            creators.append(collection['creator_id'])

    dict_users = dict()
    [dict_users.update({elem['_id']: elem})
     for elem in list(config.db.users.find({"_id": {"$in": creators}}))]

    for user in creators:
        if user not in dict_users:
            dict_users[user] = None

    for collection_id in range(len(collections)):
        collections[collection_id] = await main_additional_funcs.get_collection_small_object(collections[collection_id],
                                                                                             dict_users)

    for collection_id in range(len(collections_on_popular)):
        collections_on_popular[collection_id] \
            = await main_additional_funcs.get_collection_small_object(collections_on_popular[collection_id], dict_users)

    return collections_on_popular + collections


async def get_popular_categories():
    elem = config.db.statistics.find_one({"name": "categories_stats"})
    if elem is not None and 'categories' in elem:
        return elem['categories']
    categories = dict()
    for name in config.base_categories:
        category = config.db.categories.find_one({"name": name})
        categories[name] = {
            "_id": category['_id'],
            'name': name,
            'purchase_summary': 0.0,
            'items': 0
        }
    return categories
