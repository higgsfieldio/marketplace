import config
from fastapi import HTTPException


async def get_next_id(collection_name: str):
    obj = config.db.autoIncrement.find_one_and_update(
        {"field_name": collection_name},
        {'$inc': {'id': 1}}
    )
    if obj is None:
        raise HTTPException(status_code=500, detail='Could not find ai_field')
    return obj['id']


async def get_created_items(creator_id: str):
    tokens = list(config.db.tokens.find({"creator_id": creator_id}))
    return [dict(token_id=token['_id']) for token in tokens]
