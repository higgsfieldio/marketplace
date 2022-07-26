from fastapi import APIRouter, HTTPException, Depends
from fastapi_limiter.depends import RateLimiter
from fastapi.requests import Request
from models import notifications as notifications_models
from middlewares import auth
from bson import ObjectId
import config
from utils import main as main_additional_funcs


router = APIRouter(
    prefix=f"{config.root_path}/notifications",
    tags=["notifications"],
    responses={404: {"description": "Not found"}}
)


@router.post("/viewed", dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def push_comment_to_connected_websockets(request: Request, notifications: notifications_models.NotificationList):
    user_wallet = await auth.get_authorize_header_check(request)
    user = config.db.users.find_one_and_update({"user_wallet": user_wallet}, {"$set": {"was_logged_in": True}})
    if user is None:
        raise HTTPException(status_code=404, detail='User not found')

    await main_additional_funcs.check_code_in_request(request, user_wallet, user['was_logged_in'])

    config.db.notifications.update_many(
        {"_id": {"$in": [ObjectId(elem.notification_id) for elem in notifications.notifications]},
         "user_id": user['_id']},
        {"$set": {"viewed": True}})

    return dict(update_viewed=True)

