import os

from pymongo import MongoClient
from dotenv import load_dotenv

root_path = '/api'

# server_host = 'localhost'
server_host = '10.129.0.9'
main_server_host = '51.250.22.9'
port = 3000
api_tx_sing_port = 3010

server_link = 'https://higgsfield.io/api/v1'

timeout_req = 5

# app_location = 'C:/Users/aleks/PycharmProjects/pythonProject12'
app_location = '/home/near-server/near/fastapi-python-parser'

load_dotenv(dotenv_path='.env')

wamp_type = {
    "mainnet": "1713",
    "testnet": "9jqg"
}

avatar_sizes = {"size0": (36, 36), "size1": (40, 40), "size2": (49, 49), "size3": (120, 120),
                "size4": (300, 300), "size5": (500, 500), "size6": (1000, 1000)}
cover_sizes = {"size0": (1520, 320)}
item_sizes = {"size0": (36, 36), "size1": (40, 40), "size2": (120, 120)}

development = os.getenv('DEVELOPMENT')
market_contract = os.getenv('MARKET_CONTRACT')
nft_contract = os.getenv('NFT_CONTRACT')
main_near_link = f'https://rpc.{development}.near.org'
main_near_archival_link = f'https://archival-rpc.{development}.near.org'
main_near_helper_link = f'https://helper.{development}.near.org'

timeout_for_getting_json_token = 5
tries_for_getting_json_token = 7

FAST_API_KEY = os.getenv('FAST_API_KEY')
FAST_API_KEY_NAME = 'X-API-Key'

client = MongoClient(host="51.250.22.9", port=27017)
db = client.NFT_MAINNET
near_usd_db = client.NEAR_USD_HISTORY

base_socials_for_calendar = ["facebook", "instagram", "twitter", "reddit", "discord",
                             "telegram", "medium", "github", "site"]

available_categories = ["art"]

base_staking_account = ['staking.paras.near', 'nearton-staking.near']
