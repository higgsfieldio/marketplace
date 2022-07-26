import config
import datetime
from bson import ObjectId, Decimal128
from utils import main as main_additional_funcs
from pymongo import ReturnDocument
import aiohttp


async def push_json_notification_transfer(new_token: dict, type_: str, timestamp: datetime, user_id: ObjectId,
                                          buyer_id: ObjectId):
    name = new_token["metadata"]['title']

    if "reference" in new_token and new_token["reference"] is not None:
        if "name" in new_token["reference"]:
            name = new_token["reference"]["name"]
    json_ = {
        "user_id": user_id,
        "timestamp": timestamp,
        "viewed": False,
        "type": type_,
        "buyer_id": buyer_id,
        "token": {
            "token_id": new_token["_id"],
            "preview_url": new_token['preview']['size0'],
            "name": name
        }
    }
    new_json = json_.copy()
    del new_json['timestamp']
    return await main_additional_funcs.delete_object_ids_from_dict(
        config.db.notifications.find_one_and_update(new_json, {"$set": json_}, upsert=True,
                                                    return_document=ReturnDocument.AFTER)
    )


async def push_json_notification(new_token: dict, log: dict, timestamp: datetime, user_id: ObjectId,
                                 buyer_id: ObjectId):
    name = new_token["metadata"]['title']

    if "reference" in new_token and new_token["reference"] is not None:
        if "name" in new_token["reference"]:
            name = new_token["reference"]["name"]
    json_ = {
        "user_id": user_id,
        "timestamp": timestamp,
        "viewed": False,
        "type": log['type'],
        "price": log["params"]['price'],
        "buyer_id": buyer_id,
        "token": {
            "token_id": new_token["_id"],
            "preview_url": new_token['preview']['size0'],
            "name": name
        }
    }
    new_json = json_.copy()
    del new_json['timestamp']
    return await main_additional_funcs.delete_object_ids_from_dict(
        config.db.notifications.find_one_and_update(new_json, {"$set": json_}, upsert=True,
                                                    return_document=ReturnDocument.AFTER)
    )


async def push_json_notification_new_level(prev_level: int, new_level: int,
                                           timestamp: datetime, user_id: ObjectId):
    json_ = {
        "user_id": user_id,
        "timestamp": timestamp,
        "viewed": False,
        "type": 'new_referral_level',
        "prev_level": prev_level,
        "new_level": new_level
    }
    new_json = json_.copy()
    del new_json['timestamp']
    return await main_additional_funcs.delete_object_ids_from_dict(
        config.db.notifications.find_one_and_update(new_json, {"$set": json_}, upsert=True,
                                                    return_document=ReturnDocument.AFTER)
    )


async def send_notification(json_: dict):
    async with aiohttp.ClientSession() as client:
        headers = {config.FAST_API_KEY_NAME: config.FAST_API_KEY}
        await client.post(config.server_link + '/ws/push_notification', json=json_, headers=headers)


async def add_market_data(log: dict, transaction_hash: str, nft_contract_id: str):
    timestamp = str(datetime.datetime.now().timestamp())
    activity_id = ObjectId()
    new_token = config.db.tokens.find_one_and_update(
        {"token_id": log["params"]['token_id'],
         "contract_id": log["params"]['nft_contract_id'],
         "history.transaction_hash": {"$ne": transaction_hash}},
        {"$push": {"history": {"price": log["params"]['price'],
                               "type": log['type'],
                               "transaction_hash": transaction_hash,
                               "owner_id": log["params"]['owner_id'],
                               "timestamp": timestamp,
                               "activity_id": activity_id
                               }
                   },
         "$set": {"price": log["params"]['price'],
                  "recent_change": timestamp}
         },
        return_document=ReturnDocument.AFTER)
    if new_token is not None:
        config.db.users.update_one({"user_wallet": log["params"]['owner_id']},
                                   {"$push": {"activities": {"activity_id": activity_id,
                                                             "token_id": new_token["_id"]}}})
    return new_token


async def update_market_data(log: dict, transaction_hash: str, nft_contract_id: str):
    timestamp = str(datetime.datetime.now().timestamp())
    activity_id = ObjectId()
    new_token = config.db.tokens.find_one_and_update(
        {"token_id": log["params"]['token_id'],
         "contract_id": log["params"]['nft_contract_id'],
         "history.transaction_hash": {"$ne": transaction_hash}},
        {"$push": {"history": {"price": log["params"]['price'],
                               "type": log['type'],
                               "transaction_hash": transaction_hash,
                               "owner_id": log["params"]['owner_id'],
                               "timestamp": timestamp,
                               "activity_id": activity_id
                               }
                   },
         "$set": {"price": log["params"]['price'],
                  "recent_change": timestamp}
         },
        return_document=ReturnDocument.AFTER)
    if new_token is not None:
        config.db.users.update_one({"user_wallet": log["params"]['owner_id']},
                                   {"$push": {"activities": {"activity_id": activity_id,
                                                             "token_id": new_token["_id"]}}})
    return new_token


async def resolve_purchase(log: dict, transaction_hash: str):
    date_obj = datetime.datetime.now()
    timestamp = str(date_obj.timestamp())
    activity_id = ObjectId()
    new_token = config.db.tokens.find_one_and_update(
        {"token_id": log["params"]['token_id'],
         "contract_id": log["params"]['nft_contract_id'],
         "history.transaction_hash": {"$ne": transaction_hash}},
        {"$push": {"history": {"price": log["params"]['price'],
                               "type": log['type'],
                               "transaction_hash": transaction_hash,
                               "owner_id": log["params"]['owner_id'],
                               "buyer_id": log["params"]['buyer_id'],
                               "timestamp": timestamp,
                               "activity_id": activity_id
                               }
                   },
         "$set": {"price": None,
                  "owner_id": log["params"]['buyer_id'],
                  "recent_change": timestamp}
         },
        return_document=ReturnDocument.AFTER)
    if new_token is not None:
        config.db.statistics.update_one(
            {"name": "marketplace_purchase_near_stats",
             "stats": {"$elemMatch": {
                 "date": date_obj.replace(hour=0, minute=0, second=0, microsecond=0)}}},
            {"$inc": {
                "stats.$.value":
                    int(log["params"]['price']) / 1000000000000000000000000
                    if log["params"]['price'].isdigit() else 0}})
        config.db.statistics.update_one(
            {"name": "marketplace_purchase_amount_stats",
             "stats": {"$elemMatch": {
                 "date": date_obj.replace(hour=0, minute=0, second=0, microsecond=0)}}},
            {"$inc": {
                "stats.$.value": 1}})

        user = config.db.users.find_one_and_update({"user_wallet": log["params"]['owner_id']},
                                                   {"$pull": {"items_owned": {"token_id": new_token["_id"]}},
                                                    "$push": {"activities": {"activity_id": activity_id,
                                                                             "token_id": new_token["_id"]}}})
        buyer = config.db.users.find_one_and_update({"user_wallet": log["params"]['buyer_id']},
                                                    {"$push": {"items_owned": {"token_id": new_token["_id"]},
                                                               "activities": {"activity_id": activity_id,
                                                                              "token_id": new_token["_id"]}}})
        if buyer is not None:
            if 'referral' in buyer and 'father_referral_id' in buyer['referral']:
                father_referral = config.db.users.find_one({"_id": buyer['referral']['father_referral_id']})
                if father_referral is not None:
                    for elem in log['params']['treasury_fees']:
                        if elem[2] == 'referral':
                            profit = elem[1]
                            config.db.users.update_one({"_id": buyer['_id']},
                                                       {"$inc": {
                                                           "referral.child_traded_volume": Decimal128(
                                                               log["params"]['price']),
                                                           "referral.child_profit": Decimal128(profit)
                                                       }})
                            new_father_referral = config.db.users.find_one_and_update(
                                {"_id": father_referral['_id']},
                                {"$inc": {
                                    "referral.father_traded_volume": Decimal128(
                                        log["params"]['price']),
                                    "referral.father_profit": Decimal128(
                                        profit)
                                }}, return_document=True)
                            new_level = list(config.db.referral_levels.find(
                                {"volume_more": {
                                    "$lte": new_father_referral['referral']['father_traded_volume']}}).sort(
                                [('volume_more', -1)]).limit(1))
                            if len(new_level) != 0 and new_level[0]['level'] != father_referral['referral']['level']:
                                data = {
                                    "method": "update_level_referral_father",
                                    "params": {"father_referral": new_father_referral['user_wallet'],
                                               "new_level": new_level[0]['level']},

                                    "attached_gas": 300000000000000,
                                    "attached_tokens": 1
                                }
                                async with aiohttp.ClientSession() as client:
                                    await client.post(
                                        f'http://{config.main_server_host}:{config.api_tx_sing_port}/new-tx',
                                        json=data)
                            config.db.referral_links.update_one(
                                {"code": buyer['referral']['child_referral_code_connected_via']},
                                {'$inc': {
                                    "volume": Decimal128(log["params"]['price']),
                                    "profit": Decimal128(profit)
                                }})

            buyer_ = await main_additional_funcs.get_small_user_object(buyer)
            if user is not None:
                json_ = await push_json_notification(new_token, log, date_obj, user["_id"], buyer['_id'])
                json_['buyer'] = buyer_
                json_['timestamp'] = timestamp
                await send_notification(json_)

    return new_token


async def delete_market_data(log: dict, transaction_hash: str, nft_contract_id: str):
    timestamp = str(datetime.datetime.now().timestamp())
    activity_id = ObjectId()
    new_token = config.db.tokens.find_one_and_update(
        {"token_id": log["params"]['token_id'],
         "contract_id": log["params"]['nft_contract_id'],
         "history.transaction_hash": {"$ne": transaction_hash}},
        {"$push": {"history": {"type": log['type'],
                               "price": None,
                               "transaction_hash": transaction_hash,
                               "owner_id": log["params"]['owner_id'],
                               "timestamp": timestamp,
                               "activity_id": activity_id
                               }
                   },
         "$set": {"price": None,
                  "recent_change": timestamp}
         },
        return_document=ReturnDocument.AFTER)
    if new_token is not None:
        config.db.users.update_one({"user_wallet": log["params"]['owner_id']},
                                   {"$push": {"activities": {"activity_id": activity_id,
                                                             "token_id": new_token["_id"]}}})
    return new_token


async def nft_transfer(log: dict, transaction_hash: str, nft_contract_id: str):
    date_obj = datetime.datetime.now()
    timestamp = str(date_obj.timestamp())
    activity_id = ObjectId()
    new_token = config.db.tokens.find_one_and_update(
        {"token_id": log['token_ids'][0],
         "contract_id": nft_contract_id,
         "history.transaction_hash": {"$ne": transaction_hash}},
        {"$push": {"history": {"type": 'nft_transfer',
                               "price": None,
                               "transaction_hash": transaction_hash,
                               "owner_id": log['old_owner_id'],
                               "buyer_id": log['new_owner_id'],
                               "timestamp": timestamp,
                               "activity_id": activity_id
                               }
                   },
         "$set": {"price": None,
                  "owner_id": log['new_owner_id'],
                  "recent_change": timestamp}
         },
        return_document=ReturnDocument.AFTER)
    if new_token is not None:

        user = config.db.users.find_one_and_update(
            {"user_wallet": log['old_owner_id']},
            {"$pull": {"items_owned": {"token_id": new_token["_id"]}},
             "$push": {"activities": {"activity_id": activity_id,
                                      "token_id": new_token["_id"]}}})
        buyer = config.db.users.find_one_and_update(
            {"user_wallet": log['new_owner_id']},
            {"$push": {"items_owned": {"token_id": new_token["_id"]},
                       "activities": {"activity_id": activity_id,
                                      "token_id": new_token["_id"]}}})

        if buyer is not None:
            if user is not None:
                user_ = await main_additional_funcs.get_small_user_object(user)
                json_ = await push_json_notification_transfer(new_token, 'nft_transfer', date_obj,
                                                              buyer["_id"], user['_id'])
                json_['buyer'] = user_
                json_['timestamp'] = timestamp
                await send_notification(json_)

    return new_token


async def storage_referral_deposit(log: dict, transaction_hash: str, nft_contract_id: str):
    timestamp = str(datetime.datetime.now().timestamp())
    activity_id = ObjectId()
    user = config.db.users.find_one_and_update(
        {"user_wallet": log["params"]['father_referral'], "history.transaction_hash": {"$ne": transaction_hash}},
        {"$set": {"referral.level": log["params"]['new_level'],
                  "referral.father_profit": Decimal128('0'), "referral.father_traded_volume": Decimal128('0')},
         "$push": {"history": {"type": log['type'],
                               "transaction_hash": transaction_hash,
                               "timestamp": timestamp,
                               "activity_id": activity_id
                               }
                   }
         },
        return_document=True
    )
    return user


async def add_new_child_referral_to_father(log: dict, transaction_hash: str, nft_contract_id: str):
    timestamp = str(datetime.datetime.now().timestamp())
    activity_id = ObjectId()
    father_referral = config.db.users.find_one({"user_wallet": log["params"]['father_referral']})
    if father_referral is None:
        return None
    n = config.db.users.update_one(
        {"user_wallet": log["params"]['child_referral'], "history.transaction_hash": {"$ne": transaction_hash}},
        {
            "$push": {
                "history": {
                    "type": log['type'],
                    "transaction_hash": transaction_hash,
                    "timestamp": timestamp,
                    "activity_id": activity_id
                }
            },
            "$set": {
                "referral.child_referral_code_connected_via": log["params"]['code'],
                "referral.father_referral_id": father_referral['_id']
            },
            "$inc": {
                "referral.child_traded_volume": Decimal128('0'),
                "referral.child_profit": Decimal128('0')
            }
        })
    if n.raw_result['n'] != 0:
        config.db.referral_links.update_one({"code": log["params"]['code']},
                                            {"$inc": {
                                                "connected_via": Decimal128('1')
                                            }})
        referral = config.db.users.find_one_and_update(
            {"_id": father_referral['_id'], "history.transaction_hash": {"$ne": transaction_hash}},
            {
                "$push": {
                    "history": {
                        "type": log['type'],
                        "transaction_hash": transaction_hash,
                        "timestamp": timestamp,
                        "activity_id": activity_id
                    }
                }
            },
            return_document=True
        )
        return referral
    return None


async def update_level_referral_father(log: dict, transaction_hash: str, nft_contract_id: str):
    date_obj = datetime.datetime.now()
    timestamp = str(date_obj.timestamp())
    activity_id = ObjectId()
    referral = config.db.users.find_one_and_update(
        {"user_wallet": log["params"]['father_referral'],
         "history.transaction_hash": {"$ne": transaction_hash}},
        {
            "$push": {
                "history": {
                    "type": log['type'],
                    "transaction_hash": transaction_hash,
                    "timestamp": timestamp,
                    "activity_id": activity_id
                }
            },
            "$set": {
                "referral.level": log["params"]['new_level']
            }
        },
        return_document=False
    )
    if referral is not None:
        json_ = await push_json_notification_new_level(referral['referral']['level'], log["params"]['new_level'],
                                                       date_obj, referral["_id"])
        json_['timestamp'] = timestamp
        await send_notification(json_)
    return referral
