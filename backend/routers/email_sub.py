from fastapi import APIRouter, HTTPException
from models import email_sub
from middlewares import auth
import ast
import config
from mailchimp_marketing.api_client import ApiClientError


router = APIRouter(
    prefix=f"{config.root_path}/email",
    tags=["email"],
    responses={404: {"description": "Not found"}}
)


@router.post("/member/add")
async def adding_member(data: email_sub.MemberEmail):
    try:
        config.mailchimp_client.lists.add_list_member(
            config.LIST_ID,
            {"email_address": data.email_address, "status": "subscribed"})
        return dict(member_added=True)
    except ApiClientError as error:
        raise HTTPException(status_code=error.status_code, detail=ast.literal_eval(error.text)['detail'])


@router.delete("/member/delete", dependencies=[auth.Security(auth.get_api_key)])
async def deleting_member(data: email_sub.MemberEmail):
    try:
        response = config.mailchimp_client.lists.delete_list_member(
            config.LIST_ID, data.email_address)
        return dict(member_deleted=True, response=response)
    except ApiClientError as error:
        raise HTTPException(status_code=error.status_code, detail=ast.literal_eval(error.text)['detail'])


@router.get("/member/get", dependencies=[auth.Security(auth.get_api_key)])
async def getting_member():
    try:
        response = config.mailchimp_client.lists.get_list_members_info(
            config.LIST_ID)
        return dict(member_deleted=True, response=response)
    except ApiClientError as error:
        raise HTTPException(status_code=error.status_code, detail=ast.literal_eval(error.text)['detail'])
