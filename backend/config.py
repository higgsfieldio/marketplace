import os

from pymongo import MongoClient
from dotenv import load_dotenv
import mailchimp_marketing
from bson import Decimal128

server_host = 'localhost'
# internal_server_host = 'localhost'
internal_server_host = '10.129.0.23'
port = 3001
# port = 3000
root_path = '/api/v1'
limit_concurrency = 10000

api_tx_sing_port = 3010

# server_link = 'http://localhost:3001/api/v1'
server_link = 'https://higgsfield.io/api/v1'
elasticsearch_link = 'http://10.129.0.23:9200'
# parser_link = 'localhost'
parser_link = 'http://51.250.111.63:3000/api'

max_req = 100
timeout_req = 5

# app_location = 'C:/Users/aleks/PycharmProjects/nft_higgsfield_backend'
app_location = '/home/near-server/near/python-fastapi-backend_mainnet'

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

MAILCHIMP_API_KEY = os.getenv('MAILCHIMP_API_KEY')
LIST_ID = os.getenv('LIST_ID')
FAST_API_KEY = os.getenv('FAST_API_KEY')
FAST_API_KEY_NAME = 'X-API-Key'

IPFS_API_KEYS = os.getenv('IPFS_API_KEYS')

# client = MongoClient(host="51.250.22.9", port=27017)
client = MongoClient(port=27017)
db = client.NFT_MAINNET
near_usd_db = client.NEAR_USD_HISTORY

base_categories = ["art", "collectables", "games", "metaverses"]
available_categories = ["art"]
base_socials_for_calendar = ["facebook", "instagram", "twitter", "reddit", "discord",
                             "telegram", "medium", "github", "site"]

ai_fields = ['users']

referral_levels = [
    {
        "level": 0,
        "percent": 500,
        "name": "Photon",
        "volume_more": Decimal128('0'),
        "can_create_custom_links": False,
        "image_link": "https://prod.spline.design/0o1OpIR5ymhHr66m/scene.splinecode"
    },
    {
        "level": 1,
        "percent": 700,
        "name": "Neutrino",
        "volume_more": Decimal128('50000000000000000000000000'),
        "can_create_custom_links": False,
        "image_link": "https://prod.spline.design/crruRjTLQ4OdqRIu/scene.splinecode"
    },
    {
        "level": 2,
        "percent": 1000,
        "name": "Up Quark",
        "volume_more": Decimal128('120000000000000000000000000'),
        "can_create_custom_links": True,
        "image_link": "https://prod.spline.design/nUSD4jtCkLjnvyro/scene.splinecode"
    },
    {
        "level": 3,
        "percent": 1500,
        "name": "Muon",
        "volume_more": Decimal128('220000000000000000000000000'),
        "can_create_custom_links": True,
        "image_link": "https://prod.spline.design/DR124-Jy49MK8g82/scene.splinecode"
    },
    {
        "level": 4,
        "percent": 2000,
        "name": "Charm Quark",
        "volume_more": Decimal128('370000000000000000000000000'),
        "can_create_custom_links": True,
        "image_link": "https://prod.spline.design/cGm3KEVGWa3mueMy/scene.splinecode"
    },
    {
        "level": 5,
        "percent": 3000,
        "name": "Tau",
        "volume_more": Decimal128('570000000000000000000000000'),
        "can_create_custom_links": True,
        "image_link": "https://prod.spline.design/8VBygynjDJW23j1Z/scene.splinecode"
    },
    {
        "level": 6,
        "percent": 4000,
        "name": "Bottom Quark",
        "volume_more": Decimal128('870000000000000000000000000'),
        "can_create_custom_links": True,
        "image_link": "https://prod.spline.design/YBPlQZIl6xnMZGht/scene.splinecode"
    },

    {
        "level": 7,
        "percent": 5000,
        "name": "Higgs Boson",
        "volume_more": Decimal128('1270000000000000000000000000'),
        "can_create_custom_links": True,
        "image_link": "https://prod.spline.design/aOPzcKcdAUqQY5tn/scene.splinecode"
    }
]

mailchimp_client = mailchimp_marketing.Client()
mailchimp_client.set_config({
    "api_key": MAILCHIMP_API_KEY
})
