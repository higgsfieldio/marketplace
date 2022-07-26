import config
import asyncio
import datetime
from utils import near as near_additional_funcs
from utils import main as main_additional_funcs


async def get_near_items_semaphore(sem, sem_send_to_main_serv, user):
    async with sem:
        try:
            config.db.users.update_one({"_id": user["_id"]},
                                       {"$set": {"recent_metadata_change":
                                                 str(datetime.datetime.now().timestamp())}})
            update_queries = await near_additional_funcs.get_items(user['user_wallet'], sem_send_to_main_serv)
            await main_additional_funcs.update_queries_in_db_after_refresh(
                update_queries,
                user['user_wallet'],
                [token["token_id"] for token in user['items_owned']]
            )
            config.db.users.update_one({"_id": user["_id"]},
                                       {"$set": {"recent_metadata_change":
                                                 str(datetime.datetime.now().timestamp())}})
        except Exception as e:
            print(e)


async def update_refresh_metadata():
    task_list = list()
    sem = asyncio.Semaphore(25)
    sem_send_to_main_serv = asyncio.Semaphore(10)
    for user in list(config.db.users.find()):
        if datetime.datetime.fromtimestamp(float(user['recent_metadata_change'])) \
                + datetime.timedelta(minutes=30) < datetime.datetime.now():
            task_list.append(asyncio.create_task(get_near_items_semaphore(sem, sem_send_to_main_serv, user)))
    await asyncio.gather(*task_list)
