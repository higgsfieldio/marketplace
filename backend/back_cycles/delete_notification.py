import config
import datetime


async def delete_notification():
    config.db.notifications.delete_many({"viewed": True,
                                         "timestamp": {"$lt": datetime.datetime.now() - datetime.timedelta(days=15)}})

