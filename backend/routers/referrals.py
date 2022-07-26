from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi_limiter.depends import RateLimiter
import config
from middlewares import auth
from utils import main as main_additional_funcs
from models import referrals as referrals_models
from typing import Optional
import datetime
import random
import string
from bson import Decimal128, ObjectId

router = APIRouter(
    prefix=f"{config.root_path}/referrals",
    tags=["referrals"],
    responses={404: {"description": "Not found"}}
)


def parse_value(value: Decimal128):
    convert = 1000000000000000000000000
    value = value.to_decimal() / convert
    value = float("{:10.4f}".format(value))
    if str(value)[-2:] == '.0':
        value = str(int(value))
    return str(value)


@router.post('/create_link', dependencies=[Depends(RateLimiter(times=1, seconds=4))])
async def create_link(request: Request, referral: referrals_models.CreateLink):
    user_wallet = await auth.get_authorize_header_check(request)
    user = config.db.users.find_one_and_update({"user_wallet": user_wallet}, {"$set": {"was_logged_in": True}})

    if user is None:
        raise HTTPException(status_code=404, detail='User not found')

    await main_additional_funcs.check_code_in_request(request, user_wallet, user['was_logged_in'])

    if 'referral' not in user or 'father_traded_volume' not in user['referral']:
        raise HTTPException(status_code=400, detail='User is not connected to referral system')
    elif referral.customName is not None and config.db.referral_levels.find_one(
            {"level": user['referral']['level'], 'can_create_custom_links': True}) is None:
        raise HTTPException(status_code=400, detail='With that referral level you are unable to create customLinks')
    if referral.customName is None:
        data = {
            "name": referral.name,
            "tag_1": referral.tag_1,
            "tag_2": referral.tag_2,
            "connected_via": Decimal128('0'),
            "volume": Decimal128('0'),
            "profit": Decimal128('0'),
            "date_created": datetime.datetime.now(),
            "creator_id": user['_id']
        }
        for i in range(20):
            code = \
                ''.join(random.SystemRandom().choice(string.ascii_uppercase + string.ascii_lowercase + string.digits)
                        for _ in range(7))
            if not await main_additional_funcs.check_text_in_black_list(code):
                continue
            data['code'] = code
            n = config.db.referral_links.update_one({"code": code}, {"$setOnInsert": data}, upsert=True)
            if 'upserted' in n.raw_result:
                data['_id'] = n.raw_result['upserted']
                data['volume'] = parse_value(data['volume'])
                data['profit'] = parse_value(data['profit'])
                return await main_additional_funcs.delete_object_ids_from_dict(data)
    else:
        code = referral.customName
        if not await main_additional_funcs.check_text_in_black_list(code):
            raise HTTPException(status_code=400, detail='Validation code failed')
        data = {
            "name": referral.name,
            "code": code,
            "tag_1": referral.tag_1,
            "tag_2": referral.tag_2,
            "connected_via": Decimal128('0'),
            "volume": Decimal128('0'),
            "profit": Decimal128('0'),
            "date_created": datetime.datetime.now(),
            "creator_id": user['_id']
        }
        n = config.db.referral_links.update_one({"code": code}, {"$setOnInsert": data}, upsert=True)
        if 'upserted' in n.raw_result:
            data['_id'] = n.raw_result['upserted']
            data['volume'] = parse_value(data['volume'])
            data['profit'] = parse_value(data['profit'])
            return await main_additional_funcs.delete_object_ids_from_dict(data)
    raise HTTPException(status_code=400, detail='Could not create link')


@router.get('/leaders', dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def get_leaders(request: Request):
    try:
        user_wallet = await auth.get_authorize_header_check(request)
        user = config.db.users.find_one_and_update({"user_wallet": user_wallet}, {"$set": {"was_logged_in": True}})
    except HTTPException:
        user = None

    if user is not None:
        await main_additional_funcs.check_code_in_request(request, user['user_wallet'], user['was_logged_in'])

    leaders = \
        list(config.db.users.aggregate([
            {"$setWindowFields": {
                "partitionBy": None,
                "sortBy": {"referral.father_traded_volume": -1},
                "output": {
                    "documentNumberForState": {
                        "$documentNumber": {}
                    }
                }
            }},
            {"$match": {"referral.father_traded_volume": {"$ne": None}}},
            {"$limit": 10}
        ]))
    if len(leaders) == 0:
        raise HTTPException(status_code=400, detail='Leaders not found')

    if user is None or user['_id'] in [elem['_id'] for elem in leaders] or 'referral' not in user \
            or 'father_traded_volume' not in user['referral']:
        new_leaders = list()
        for leader in leaders:
            leader_small = await main_additional_funcs.get_small_user_object(leader)
            leader_base = leader['referral']
            leader_base['user_wallet'] = leader['user_wallet']
            leader_base['father_profit'] = parse_value(leader_base['father_profit'])
            leader_base['father_traded_volume'] = parse_value(leader_base['father_traded_volume'])
            leader_base['documentNumberForState'] = leader['documentNumberForState']
            leader_base.update(leader_small)
            new_leaders.append(leader_base)
        return await main_additional_funcs.delete_object_ids_from_list(new_leaders)
    else:
        user_doc_number_in_leaders = \
            list(config.db.users.aggregate([
                {"$setWindowFields": {
                    "partitionBy": None,
                    "sortBy": {"referral.father_traded_volume": -1},
                    "output": {
                        "documentNumberForState": {
                            "$documentNumber": {}
                        }
                    }
                }},
                {"$match": {"_id": user['_id'], "referral.father_traded_volume": {"$ne": None}}},
                {"$limit": 1}
            ]))
        if len(user_doc_number_in_leaders) == 1:
            leaders = leaders[:9] + user_doc_number_in_leaders
    new_leaders = list()
    for leader in leaders:
        leader_small = await main_additional_funcs.get_small_user_object(leader)
        leader_base = leader['referral']
        leader_base['user_wallet'] = leader['user_wallet']
        leader_base['father_profit'] = parse_value(leader_base['father_profit'])
        leader_base['father_traded_volume'] = parse_value(leader_base['father_traded_volume'])
        leader_base['documentNumberForState'] = leader['documentNumberForState']
        leader_base.update(leader_small)
        new_leaders.append(leader_base)
    return await main_additional_funcs.delete_object_ids_from_list(new_leaders)


@router.get('/check_custom_link_availability',
            dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def check_custom_link_availability(code: str):
    if not (5 <= len(code) <= 7):
        raise HTTPException(status_code=400, detail='Code should be gte 5 and lte 7')
    if config.db.referral_links.find_one({"code": code}) is not None:
        raise HTTPException(status_code=400, detail='Code is not available')
    return dict(data=True)


@router.get('/links', dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def get_links(request: Request, last_id: Optional[str] = None, limit: Optional[int] = 10):
    if last_id is not None and not ObjectId.is_valid(last_id):
        raise HTTPException(status_code=400, detail='Not valid ObjectId')
    user_wallet = await auth.get_authorize_header_check(request)
    user = config.db.users.find_one_and_update({"user_wallet": user_wallet}, {"$set": {"was_logged_in": True}})
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')

    await main_additional_funcs.check_code_in_request(request, user_wallet, user['was_logged_in'])

    if 'referral' not in user or 'father_traded_volume' not in user['referral']:
        raise HTTPException(status_code=400, detail='User is not connected to referral system')
    pipeline = [
        {"$match": {"creator_id": user['_id']}},
        {"$sort": {"date_created": -1}},
        {"$limit": limit}
    ]
    if last_id is not None:
        pipeline.insert(2, {"$match": {"_id": {"$lt": ObjectId(last_id)}}})
    links = list(
        config.db.referral_links.aggregate(pipeline)
    )
    new_links = list()
    for link in links:
        link['volume'] = parse_value(link['volume'])
        link['profit'] = parse_value(link['profit'])
        new_links.append(link)
    return await main_additional_funcs.delete_object_ids_from_list(new_links)


@router.get('/referrals', dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def get_referrals(request: Request, last_id: Optional[str] = None, limit: Optional[int] = 10):
    if last_id is not None and not ObjectId.is_valid(last_id):
        raise HTTPException(status_code=400, detail='Not valid ObjectId')
    user_wallet = await auth.get_authorize_header_check(request)
    user = config.db.users.find_one_and_update({"user_wallet": user_wallet}, {"$set": {"was_logged_in": True}})
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')

    await main_additional_funcs.check_code_in_request(request, user_wallet, user['was_logged_in'])

    if 'referral' not in user or 'father_traded_volume' not in user['referral']:
        raise HTTPException(status_code=400, detail='User is not connected to referral system')
    pipeline = [
        {"$match": {"referral.father_referral_id": user['_id']}},
        {"$sort": {"referral.child_traded_volume": -1}},
        {"$limit": limit}
    ]
    if last_id is not None:
        pipeline.insert(2, {"$match": {"_id": {"$gt": ObjectId(last_id)}}})
    referrals = list(
        config.db.users.aggregate(pipeline)
    )
    new_referrals = list()
    for referral in referrals:
        referral_small = await main_additional_funcs.get_small_user_object(referral)
        referral_base = referral['referral']
        referral_base['user_wallet'] = referral['user_wallet']
        referral_base['child_traded_volume'] = parse_value(referral_base['child_traded_volume'])
        referral_base['child_profit'] = parse_value(referral_base['child_profit'])
        referral_base.update(referral_small)
        new_referrals.append(referral_base)
    return await main_additional_funcs.delete_object_ids_from_list(new_referrals)


@router.get('/dashboard', dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def get_dashboard(request: Request):
    user_wallet = await auth.get_authorize_header_check(request)
    user = config.db.users.find_one_and_update({"user_wallet": user_wallet}, {"$set": {"was_logged_in": True}})
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')

    await main_additional_funcs.check_code_in_request(request, user_wallet, user['was_logged_in'])

    if 'referral' not in user or 'father_traded_volume' not in user['referral']:
        raise HTTPException(status_code=400, detail='User is not connected to referral system')
    level = list(config.db.referral_levels.find({"level": {"$gte": user['referral']['level']}}).limit(2))
    if len(level) == 0:
        raise HTTPException(status_code=400, detail='Level not found in db')
    main_level = level[0]
    main_level['volume_more'] = parse_value(level[0]['volume_more'])
    main_level['volume_less'] = parse_value(level[1]['volume_more']) if len(level) > 1 else None
    data = {
        "total_volume": parse_value(user['referral']['father_traded_volume']),
        "referrals_amount": config.db.users.count_documents({"referral.father_referral_id": user['_id']}),
        "profit": parse_value(user['referral']['father_profit']),
        "level": main_level
    }
    return await main_additional_funcs.delete_object_ids_from_dict(data)


@router.on_event('startup')
async def on_start():
    config.db.referral_links.create_index([('date_created', -1)])
    config.db.referral_levels.create_index([('level', 1)])
    config.db.users.create_index([('referral.father_traded_volume', -1)])
    config.db.users.create_index([('referral.father_profit', -1)])
    config.db.users.create_index([('referral.child_traded_volume', -1)])
    config.db.users.create_index([('referral.child_profit', -1)])
