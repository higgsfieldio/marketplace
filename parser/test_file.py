from back_cycles.update_refresh_metadata import get_near_items_semaphore
import asyncio
import config


async def update_refresh_metadata():
    task_list = list()
    sem = asyncio.Semaphore(25)
    sem_send_to_main_serv = asyncio.Semaphore(15)
    for user in list(config.db.tokens.aggregate(
            [{"$match": {"price": {"$ne": None}}}, {"$group": {"_id": None, "fieldN": {"$addToSet": "$owner_id"}}},
             {"$unwind": "$fieldN"}, {"$lookup": {
                "from": 'users',
                "localField": 'fieldN',
                "foreignField": 'user_wallet',
                "as": 'user'
            }}])):
        if len(user['user']) == 1:
            task_list.append(asyncio.create_task(get_near_items_semaphore(sem, sem_send_to_main_serv, user['user'][0])))
    await asyncio.gather(*task_list)


if __name__ == '__main__':
    loop = asyncio.new_event_loop()
    loop.run_until_complete(update_refresh_metadata())
