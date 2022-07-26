from fastapi import APIRouter, HTTPException, Form, UploadFile, File, Depends
from fastapi_limiter.depends import RateLimiter
import config
from middlewares import auth
from utils import main as main_additional_funcs
import os
import json
import datetime


router = APIRouter(
    prefix=f"{config.root_path}/calendar",
    tags=["calendar"],
    responses={404: {"description": "Not found"}}
)


async def check_timestamp(timestamp: str):
    try:
        date_obj = datetime.datetime.fromtimestamp(float(timestamp))
        return date_obj
    except Exception as e:
        raise HTTPException(status_code=400, detail='date error: ' + str(e))


async def check_socials(obj: str):
    try:
        obj = json.loads(obj)
        keys = list(obj.keys())
        print(obj)
        if len(keys) <= 3 \
                and next((key for key in keys if key not in config.base_socials_for_calendar), None) is None:
            return obj
        raise ValueError('not a valid json')
    except Exception as e:
        raise HTTPException(status_code=400, detail='json error: ' + str(e))


@router.post('/add', dependencies=[auth.Security(auth.get_api_key)])
async def add_item_to_calendar(
        items: str = Form(...),
        price: str = Form(...),
        title: str = Form(...),
        description: str = Form(...),
        timestamp: str = Form(...),
        featured: str = Form('false'),
        socials: str = Form("null"),
        avatar: UploadFile = File(...)
):
    data = dict()

    if featured not in ['true', 'false']:
        raise HTTPException(status_code=404, detail='featured can be only true or false')

    if items.isdigit():
        data["items"] = int(items)
    else:
        raise HTTPException(status_code=400, detail='items value should be isdigit True')

    data["price"] = price

    if socials.lower() != 'null':
        data["socials"] = await check_socials(socials)
    else:
        data["socials"] = None

    data["timestamp"] = await check_timestamp(timestamp)
    data["title"] = title
    data["description"] = description
    data["featured"] = bool(featured == 'true')

    if avatar is not None and avatar.content_type.split('/')[0] == 'image':
        new_avatar = dict()
        file_read = await avatar.read()
        timestamp = str(datetime.datetime.now().timestamp())
        with open(f'files/calendar/avatar-{timestamp}.{avatar.filename.split(".")[-1]}', 'wb') as doc:
            doc.write(file_read)
        for size_key in config.avatar_sizes.keys():
            new_path = await main_additional_funcs.save_new_images(avatar.filename, avatar.content_type, timestamp,
                                                                   config.avatar_sizes[size_key], 'avatar',
                                                                   'calendar')
            new_avatar[size_key] = new_path
        os.remove(f'files/calendar/avatar-{timestamp}.{avatar.filename.split(".")[-1]}')
        data['avatar_url'] = new_avatar
    else:
        raise HTTPException(status_code=400, detail='Only content-type image are available')

    config.db.calendar.insert_one(data)
    return await main_additional_funcs.delete_object_ids_from_dict(data)


@router.get("/get", dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def get_calendar():
    timestamp = datetime.datetime.now()
    upcoming = list(config.db.calendar.find({"timestamp": {"$gt": timestamp}}))
    past = list(config.db.calendar.find({"timestamp": {"$lte": timestamp}}))
    upcoming_to_return = list()
    used_dates = list()
    for elem in upcoming:
        date = str(int(datetime.datetime.combine(elem['timestamp'].date(), datetime.time.min).timestamp()))
        if date in used_dates:
            elem['timestamp'] = str(int(elem['timestamp'].timestamp()))
            upcoming_to_return[-1]['items'].insert(0, elem)
        else:
            used_dates.append(date)
            elem['timestamp'] = str(int(elem['timestamp'].timestamp()))
            upcoming_to_return.append(dict(date=date, items=[elem]))

    past_to_return = list()
    used_dates = list()
    for elem in past:
        date = str(int(datetime.datetime.combine(elem['timestamp'].date(), datetime.time.min).timestamp()))
        if date in used_dates:
            elem['timestamp'] = str(int(elem['timestamp'].timestamp()))
            past_to_return[-1]['items'].append(elem)
        else:
            used_dates.append(date)
            elem['timestamp'] = str(int(elem['timestamp'].timestamp()))
            past_to_return.append(dict(date=date, items=[elem]))

    return_dict = {"featured": upcoming[-2:][::-1],
                   "upcoming": upcoming_to_return[::-1],
                   "past": past_to_return}
    return await main_additional_funcs.delete_object_ids_from_dict(return_dict)


@router.get("/main_page", dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def get_calendar():
    timestamp = datetime.datetime.now()
    upcoming = list(config.db.calendar.find({"timestamp": {"$gt": timestamp}}).sort([("timestamp", 1)]).limit(4))
    for elem in upcoming:
        elem['timestamp'] = str(int(elem['timestamp'].timestamp()))
    return_dict = {"upcoming": upcoming}
    return await main_additional_funcs.delete_object_ids_from_dict(return_dict)


@router.on_event('startup')
async def creating_indexes():
    config.db.calendar.create_index([("timestamp", -1)])
