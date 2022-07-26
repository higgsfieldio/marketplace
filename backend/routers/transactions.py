from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi_limiter.depends import RateLimiter
from models import transactions as transactions_models
from utils import main as main_additional_funcs
from utils import near as near_additional_funcs

from middlewares import auth
import config


router = APIRouter(
    prefix=f"{config.root_path}/transactions",
    tags=["transactions"],
    responses={404: {"description": "Not found"}}
)


@router.patch("/check_hash", dependencies=[Depends(RateLimiter(times=config.max_req, seconds=config.timeout_req))])
async def check_hash(request: Request, transaction: transactions_models.TransactionHash):
    user_wallet = await auth.get_authorize_header_check(request)
    user = config.db.users.find_one_and_update({"user_wallet": user_wallet}, {"$set": {"was_logged_in": True}})

    if user is None:
        raise HTTPException(status_code=404, detail='User not found')

    await main_additional_funcs.check_code_in_request(request, user_wallet, user['was_logged_in'])

    for transaction_hash in transaction.transaction_hashes:
        token = config.db.tokens.find_one({'history.transaction_hash': transaction_hash})
        if token is not None:
            return await main_additional_funcs.get_token_for_market_page(token, request.headers)
        elem = config.db.users.find_one({'history.transaction_hash': transaction_hash})
        if elem is not None:
            return await main_additional_funcs.fill_in_user_object(elem)
    try:
        elem = None
        for transaction_hash in transaction.transaction_hashes:
            elem = await near_additional_funcs.check_transaction(transaction_hash, user['user_wallet'])
        if elem is not None:
            if 'token_id' in elem:
                return await main_additional_funcs.get_token_for_market_page(elem, request.headers)
            else:
                return await main_additional_funcs.fill_in_user_object(elem)
        else:
            for transaction_hash in transaction.transaction_hashes:
                token = config.db.tokens.find_one({'history.transaction_hash': transaction_hash})
                if token is not None:
                    return await main_additional_funcs.get_token_for_market_page(token, request.headers)
                elem = config.db.users.find_one({'history.transaction_hash': transaction_hash})
                if elem is not None:
                    return await main_additional_funcs.fill_in_user_object(elem)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=e)
    raise HTTPException(status_code=400, detail='Hashes are already up-to-date')
