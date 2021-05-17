import os
import pymongo
from utils.logger import logger
import secrets
from itsdangerous import TimedJSONWebSignatureSerializer as TJWSS
from utils.rpc_tools import *
from pytz import utc


class Constants:
    # Version info
    VERSION = "0.2.0"
    OWNER = "Chiro"
    EMAIL = "Chiro2001@163.com"
    # Find
    FIND_LIMIT = 30
    # JWT config
    JWT_SECRET_KEY = secrets.SECRET_WORDS
    JWT_HEADER_TYPE = ""
    JWT_HEADER_NAME = "Authorization"
    JWT_LOCATIONS = ['headers', ]
    JWT_MESSAGE_401 = f"Authorization required in {', '.join([location for location in JWT_LOCATIONS])}"
    # JWT_ACCESS_TIME = 60 * 5
    JWT_ACCESS_TIME = 60 * 50 * 100
    # JWT_ACCESS_TIME = 1
    JWT_REFRESH_TIME = 60 * 60 * 24 * 30 * 100
    # JWT_REFRESH_TIME = 1
    # Database
    DATABASE_URI = secrets.SECRET_MONGO_URI
    DATABASE_NAME = DATABASE_URI.split('/')[-1]
    DATABASE_COL_NAME = 'config'
    # Email
    EMAIL_SENDER = "LanceLiang2018@163.com"
    EMAIL_SMTP_PASSWORD = secrets.SECRET_EMAIL_SMTP_PASSWORD
    EMAIL_ERROR_TITLE = "chiblog errors"
    EMAIL_SMTP_SSL = 'smtp.163.com'
    EMAIL_SMTP_PORT = 465
    # Users
    USERS_OWNER_PASSWORD = secrets.SECRET_OWNER_PASSWORD
    USERS_OWNER_USERNAME = 'chiro'
    USERS_OWNER_NICK = 'Chiro'
    USERS_OWNER_GITHUB = 'chiro2001'
    USERS_OWNER = {
        'username': USERS_OWNER_USERNAME,
        'nick': USERS_OWNER_NICK,
        'state': 'normal',
        'profile': {
            'contact': {
                'github': USERS_OWNER_GITHUB
            }
        }
    }
    # API config
    API_PATH = '/api/v1'
    # Running config
    RUN_LISTENING = "0.0.0.0"
    RUN_PORT = int(os.environ.get("PORT", 8080))
    RUN_USE_RELOAD = False
    # RUN_REBASE = True
    RUN_REBASE = False
    # Request API
    REQUEST_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0"
    # Modules
    MODULES_PATH = "../modules/"
    MODULES = {
        'DoubSearch': None,
        "bookFinder": "go run main.go"
    }


class Statics:
    tjw_access_token = TJWSS(Constants.JWT_SECRET_KEY, Constants.JWT_ACCESS_TIME)
    tjw_refresh_token = TJWSS(Constants.JWT_SECRET_KEY, Constants.JWT_REFRESH_TIME)
    rpc_spider_go = RPCTarget('127.0.0.1', 9091)
    rpc_spider_nodejs = RPCTarget('127.0.0.1', 9092)


class Config:
    def __init__(self):
        self.data_default = {
            "version": Constants.VERSION,
            "api_server": {
                "upgradable": True,
                "api_prefix": Constants.API_PATH
            },
            # 调试的时候用
            "file_server": {
                "upgradable": True,
                "static_path": "./public",
                "index": "index.html",
                "routers": []
            }
        }
        self.data = self.data_default
        self.load()

    # 这存取数据库单独处理不用database
    # 防止循环引用
    def save(self):
        client = pymongo.MongoClient(Constants.DATABASE_URI)
        db = client[Constants.DATABASE_NAME]
        col = db[Constants.DATABASE_COL_NAME]
        result = col.find_one({'version': {'$exists': True}}, {'_id': 0})
        if result is None:
            col.insert_one(self.data)
        else:
            col.update_one({'version': {'$exists': True}}, {'$set': self.data})
        client.close()

    def load(self):
        client = pymongo.MongoClient(Constants.DATABASE_URI)
        db = client[Constants.DATABASE_NAME]
        col = db[Constants.DATABASE_COL_NAME]
        result = col.find_one({'version': {'$exists': True}}, {'_id': 0})
        if result is None:
            logger.warning('loading default config data...')
            self.data = self.data_default
        else:
            # TODO: 数据库升级操作
            self.data = result
        self.save()
        client.close()


config = Config()
