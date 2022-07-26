from utils.statistics import get_statistics_for_main_collection
from utils.main import update_queries_in_db
import config


async def update_main_statistics_for_all_collections():
    collections = list(config.db.collections.find())
    update_queries = dict(collections=list())
    for collection in collections:
        collection['items'] \
            = list(config.db.tokens.find({"_id": {"$in": [elem["token_id"] for elem in collection['items']]}}))
        statistics = (await get_statistics_for_main_collection(collection, {"tz": "UTC"}))['statistics']
        update_queries['collections'].append(dict(
            type='update_one',
            find_query={"_id": collection['_id']},
            update_query={
                "$set": {
                    "main_statistics": statistics
                }
            }
            )
        )
    await update_queries_in_db(update_queries)
