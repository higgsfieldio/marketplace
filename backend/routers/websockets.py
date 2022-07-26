from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.requests import Request
from typing import Dict
from models import websockets as websockets_models
from middlewares import auth
from bson import ObjectId
import config


router = APIRouter(
    prefix=f"{config.root_path}/ws",
    tags=["ws"],
    responses={404: {"description": "Not found"}}
)


class Notifier:
    def __init__(self):
        self.connections: Dict[WebSocket, str] = {}
        self.generator = self.get_notification_generator()

    async def get_notification_generator(self):
        while True:
            new_notification = yield
            await self._notify(new_notification)

    async def push(self, new_notification: dict):
        await self.generator.asend(new_notification)

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.connections[websocket] = user_id

    async def disconnect(self, websocket: WebSocket):
        if websocket in self.connections:
            del self.connections[websocket]

    async def _notify(self, new_notification: dict):
        living_connections = {}
        while len(self.connections) > 0:
            # Looping like this is necessary in case a disconnection is handled
            # during await websocket.send_text(message)
            items = self.connections.popitem()
            websocket = items[0]
            if items[1] == new_notification['user_id']:
                await websocket.send_json(new_notification)
            living_connections[websocket] = items[1]
        self.connections = living_connections


class NotifierComments:
    def __init__(self):
        self.connections: Dict[WebSocket, str] = {}
        self.generator = self.get_notification_generator()

    async def get_notification_generator(self):
        while True:
            new_comment = yield
            await self._notify(new_comment)

    async def push(self, new_comment: dict):
        await self.generator.asend(new_comment)

    async def connect(self, websocket: WebSocket, token_id: str):
        await websocket.accept()
        self.connections[websocket] = token_id

    async def disconnect(self, websocket: WebSocket):
        if websocket in self.connections:
            del self.connections[websocket]

    async def _notify(self, new_comment: dict):
        living_connections = {}
        while len(self.connections) > 0:
            # Looping like this is necessary in case a disconnection is handled
            # during await websocket.send_text(message)
            items = self.connections.popitem()
            websocket = items[0]
            if items[1] == new_comment['token_id']:
                await websocket.send_json(new_comment)
            living_connections[websocket] = items[1]
        self.connections = living_connections


notifier_comments = NotifierComments()
notifier = Notifier()


@router.websocket(f"{config.root_path}/ws" + "/comments/{token_id}")
async def websocket_endpoint(websocket: WebSocket, token_id: str):
    if not ObjectId.is_valid(token_id) or config.db.tokens.find_one({"_id": ObjectId(token_id)}) is None:
        return dict(status_code=400, detail='Not valid ObjectId or token does not exist')
    await notifier_comments.connect(websocket, token_id)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        await notifier_comments.disconnect(websocket)


@router.websocket(f"{config.root_path}/ws" + "/notifications/{auth_header}")
async def websocket_endpoint(websocket: WebSocket, auth_header: str):
    user_wallet = await auth.get_authorize_header_check_token(auth_header)
    user = config.db.users.find_one_and_update({"user_wallet": user_wallet}, {"$set": {"was_logged_in": True}})
    if user is None:
        return dict(status_code=404, detail='User not found')
    await notifier.connect(websocket, str(user['_id']))
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        await notifier.disconnect(websocket)


@router.post("/push_comment", dependencies=[auth.Security(auth.get_api_key)])
async def push_comment_to_connected_websockets(new_comment: websockets_models.Comment):
    await notifier_comments.push(new_comment.dict())


@router.post("/push_notification", dependencies=[auth.Security(auth.get_api_key)])
async def push_notification_to_connected_websockets(new_notification: dict):
    await notifier.push(new_notification)


@router.on_event("startup")
async def startup():
    # Prime the push notification generator
    await notifier_comments.generator.asend(None)
    await notifier.generator.asend(None)
