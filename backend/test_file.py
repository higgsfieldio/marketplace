import asyncio
import pymongo
import config
import datetime
from bson import ObjectId
from pprint import pprint
from utils.main import get_collection_for_market_page
from utils.statistics import get_statistics_for_collection
from models.tokens import TokensWithRarity, TokensWithoutRarity


async def shutdown(loop):
    print('stopped loop')
    tasks = [task for task in asyncio.all_tasks() if task is not
             asyncio.tasks.current_task()]
    list(map(lambda task: task.cancel(), tasks))
    results = await asyncio.gather(*tasks, return_exceptions=True)
    print('finished awaiting cancelled tasks, results: {0}'.format(results))
    loop.stop()


async def missed2(contract_id):
    ex = [str(elem) for elem in range(1, 1999 + 1)]
    client = pymongo.MongoClient(port=27017)
    db = client.NFT_MAINNET
    for token in db.tokens.find({"contract_id": contract_id}):
        if token['token_id'] in ex:
            ex.remove(token['token_id'])
    print(ex)


async def missed3():
    client = pymongo.MongoClient(port=27017)
    db = client.NFT_MAINNET
    print(f'start timestamp: {datetime.datetime.now().timestamp()}')

    l = list(db.tokens.aggregate([
        {"$match": {}},
        {"$group": {"_id": None, "sum": {"$sum": "$views"}}}]))
    print(f'end timestamp: {datetime.datetime.now().timestamp()}')

    print(l)


async def missed4(contract_address):
    # client = pymongo.MongoClient(port=27017)
    # db = client.NFT_MAINNET
    # col = db.collections.find_one({"_id": ObjectId('6255887f0ac14e3c20a90b71')})
    # print(f'start timestamp: {datetime.datetime.now().timestamp()}')
    # l = list(config.db.tokens.aggregate([{"$unwind": "$history"},
    #                                      {"$match": {"$or": [
    #                                          {"_id": elem['token_id'], "history.activity_id": elem['activity_id']} for
    #                                          elem in col['history']]}}]))
    # print(f'end timestamp: {datetime.datetime.now().timestamp()}')

    d = {}
    tokens = list(config.db.tokens.find({"contract_id": contract_address}))
    print(len(tokens))
    attributes = [dict(attributes=elem['reference']['attributes']) for elem in tokens]
    first_copy = dict(tokens=attributes)
    without_rarity = False
    with_rarity = False
    try:
        TokensWithoutRarity(**first_copy)
        without_rarity = True
    except Exception as e:
        print(f'TokensWithoutRarity err: {e}')
    if not without_rarity:
        try:
            TokensWithRarity(**first_copy)
            with_rarity = True
        except Exception as e:
            print(f'TokensWithoutRarity err: {e}')
    if not without_rarity and not with_rarity:
        raise ValueError('Tokens should be either with rarity attrs or without it')
    for elem in tokens:
        for elem2 in (elem['reference']['attributes']).copy():
            if elem2['value'] == 'None':
                elem['reference']['attributes'].remove(elem2)
                continue
            if with_rarity:
                continue
            if elem2['trait_type'] not in d:
                d[elem2['trait_type']] = dict()
            if elem2['value'] in d[elem2['trait_type']]:
                d[elem2['trait_type']][elem2['value']] += 1
            else:
                d[elem2['trait_type']][elem2['value']] = 1
        attributes_length = len(elem['reference']['attributes'])
        if 'length' not in d:
            d['length'] = dict()
        if attributes_length in d['length']:
            d['length'][attributes_length] += 1
        else:
            d['length'][attributes_length] = 1
    new_d = {}
    for elem in list(d.keys()):
        new_d[elem] = {}
        sum1 = sum(d[elem].values())
        for in_elem in list(d[elem].keys()):
            percent = d[elem][in_elem] * 10 ** (2 + 5) / sum1 / 10 ** 5
            s = "{1:.{0}f}".format(2, percent)
            new_d[elem][in_elem] = s.rstrip('0').rstrip('.') + '%' if '.' in s else s + '%'
            s = 1 / (round(percent, 5) / 100)
            d[elem][in_elem] = s

    for elem in list(d.keys()):
        for in_elem in list(d[elem].keys()):
            config.db.tokens.update_many(
                {
                    "contract_id": contract_address,
                    "reference.attributes": {
                        "$elemMatch": {
                            "trait_type": elem,
                            "value": in_elem}
                    },
                    "attributes": {
                        "$nin": [
                            {
                                "trait_type": elem,
                                "value": in_elem,
                                "rarity": d[elem][in_elem]
                            }
                        ]
                    }
                },
                {
                    "$push": {
                        "attributes": {
                            "trait_type": elem,
                            "value": in_elem,
                            "rarity": d[elem][in_elem]
                        }
                    }
                }
            )
    if without_rarity:
        for token in config.db.tokens.find({"contract_id": contract_address}):
            attrs = token['attributes']
            score = d['length'][len(attrs)]
            for elem in attrs.copy():
                if elem['value'] == 'None':
                    attrs.remove(elem)
                    continue
                score += elem['rarity']
                elem['rarity'] = new_d[elem['trait_type']][elem['value']]

            attrs.append(dict(trait_type="Attributes Count", value=len(attrs), rarity=new_d['length'][len(attrs)]))
            config.db.tokens.update_one({"_id": token['_id']}, {"$set": {"score": score,
                                                                         "attributes": attrs}})
    else:
        for token in config.db.tokens.find({"contract_id": contract_address}):
            attrs = token['reference']['attributes']
            score = d['length'][len(attrs)]
            for elem in attrs.copy():
                if elem['value'] == 'None':
                    attrs.remove(elem)
                    continue
                elem['rarity'] = elem['rarity'].replace(',', '.')
                s = 1 / (round(float(elem['rarity'].strip('%')), 5) / 100)
                score += s
            attrs.append(dict(trait_type="Attributes Count", value=len(attrs), rarity=new_d['length'][len(attrs)]))
            config.db.tokens.update_one({"_id": token['_id']}, {"$set": {"score": score,
                                                                         "attributes": attrs}})

    min_rank = 1
    last_score = None
    for elem in config.db.tokens.find({"contract_id": contract_address}).sort([("score", -1)]):
        if last_score is None:
            last_score = elem['score']
            rank = min_rank
        else:
            if last_score == elem['score']:
                rank = min_rank
            else:
                min_rank += 1
                rank = min_rank
        config.db.tokens.update_one({"_id": elem["_id"]},
                                    {"$set": {"rank": rank}})
    collection = config.db.collections.find_one({"contract_address": contract_address})
    collection['items'] \
        = list(config.db.tokens.find({"_id": {"$in": [elem["token_id"] for elem in collection['items']]}}))

    return await get_collection_for_market_page(
        await get_statistics_for_collection(collection,
                                            'UTC'
                                            )
    )


async def check_for_reps(contract_address):
    client = pymongo.MongoClient(host="51.250.22.9", port=27017)
    db = client.NFT_MAINNET
    tokens = [elem['token_id'] for elem in list(db.tokens.find({"collection_id": ObjectId('628e4e3d09e21c782d93edd7')}))]
    print(len(tokens))
    l = [str(elem) for elem in range(2026)]
    for elem in tokens:
        if elem in l:
            l.remove(elem)
    print(len(l))
    print([{"token_id": elem} for elem in l])
    # token_ids = list()
    # for token in db.tokens.find({"contract_id": contract_address}):
    #     token_ids.append(token['token_id'])
    # seen = set()
    # dupes = [x for x in token_ids if x in seen or seen.add(x)]
    # print(dupes)
    # seen = set()
    # uniq = [x for x in token_ids if x not in seen and not seen.add(x)]
    # print(len(uniq))


async def aggr(contract_address):
    for elem in list(config.db.tokens.find()):
        history = list()
        history_simple = list()
        repeated_simple = list()
        repeated = list()
        for in_elem in elem['history']:
            in_elem['token_id'] = elem['_id']
            in_elem_ = in_elem.copy()
            del in_elem_['activity_id']
            del in_elem_['timestamp']
            del in_elem_['type']
            if in_elem_ not in history_simple and 'transaction_hash' in in_elem \
                    and len([1 for elem in elem['history']
                             if 'transaction_hash' in elem
                                and elem['transaction_hash'] == in_elem['transaction_hash']]) == 1:
                history_simple.append(in_elem_)
                history.append(in_elem)
            elif 'transaction_hash' in in_elem:
                repeated_simple.append(in_elem_)
                repeated.append(in_elem)
        for repeat in repeated:
            config.db.tokens.update_one({"_id": repeat['token_id']},
                                      {"$pull": {"history": {"activity_id": repeat['activity_id']}}})
            if repeat['type'] in ['nft_transfer', 'resolve_purchase', 'refresh_metadata_owner_and_price_update']:
                config.db.users.update_one({"user_wallet": repeat['owner_id']},
                                                     {"$pull": {"activities": {"activity_id": repeat['activity_id'],
                                                                               "token_id": repeat['token_id']}}})
                config.db.users.update_one({"user_wallet": repeat['buyer_id']},
                                                     {"$pull": {"activities": {"activity_id": repeat['activity_id'],
                                                                               "token_id": repeat['token_id']}}})
            else:
                updated = config.db.users.update_one({"user_wallet": repeat['owner_id']},
                                         {"$pull": {"activities": {"activity_id": repeat['activity_id'],
                                                                   "token_id": repeat['token_id']}}})
    # print(f'start timestamp: {datetime.datetime.now().timestamp()}')
    #
    # items = list(
    #     db.tokens.aggregate(
    #         [
    #             {
    #                 "$match": {
    #                     "_id": {
    #                         "$in": [
    #                             elem['token_id']
    #                             for elem in collection['history']
    #                         ]
    #                     },
    #                     "history.activity_id": {
    #                         "$in": [
    #                             elem['activity_id']
    #                             for elem in collection['history']
    #                         ]
    #                     }
    #                 }
    #             },
    #             {
    #                 "$unwind": "$history"
    #             },
    #
    #         ]
    #     )
    # )
    # print(f'end timestamp: {datetime.datetime.now().timestamp()}')
    # print(f'start timestamp: {datetime.datetime.now().timestamp()}')
    #
    # for item in collection["history"]:
    #     token = list(config.db.tokens.aggregate([{"$unwind": "$history"},
    #                                              {"$match": {"_id": item['token_id'],
    #                                                          "history.activity_id": item["activity_id"]}}]))
    #
    # print(f'end timestamp: {datetime.datetime.now().timestamp()}')


if __name__ == "__main__":
    # db.tokens.create_index([("reference.rank", -1)])
    loop_main = asyncio.new_event_loop()
    # loop_main.run_until_complete(missed2('tigeracademy.near'))
    # loop_main.run_until_complete(missed4('tigeracademy.near'))
    # loop_main.run_until_complete(check_for_reps('asac.near'))
    loop_main.run_until_complete(check_for_reps('asac.near'))
    # loop_main.run_until_complete(main('asac.near'))
