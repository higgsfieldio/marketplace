from pydantic import BaseModel
from fastapi import Form
from typing import List


class Notification(BaseModel):
    notification_id: str = Form(..., min_length=24, max_length=24)


class NotificationList(BaseModel):
    notifications: List[Notification]
