import os
import pymongo
from utils.logger import logger
import secrets
from itsdangerous import TimedJSONWebSignatureSerializer as TJWSS
from utils.rpc_type import *
from pytz import utc
import platform


class Constants:
    # Version info
    VERSION = "0.2.0"
    ADMIN = "chiro"
    EMAIL = "Chiro2001@163.com"
    # Environment
    ENVIRONMENT = os.environ.get("ENV") if os.environ.get("ENV") is not None else (
        "release" if platform.system() == 'Linux' else "dev")
    # Find
    FIND_LIMIT = 30
    # FIND_LIMIT = 8
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
    USERS_DEFAULT_PASSWORD = secrets.SECRET_OWNER_PASSWORD
    USERS_DEFAULT_USERNAME = 'chiro'
    USERS_DEFAULT_NICK = 'Chiro'
    USERS_DEFAULT_GITHUB = 'chiro2001'
    USERS_DEFAULT = {
        'username': USERS_DEFAULT_USERNAME,
        'nick': USERS_DEFAULT_NICK,
        'state': 'normal',
        'profile': {
            'contact': {
                'github': USERS_DEFAULT_GITHUB
            }
        }
    }
    # API config
    API_PATH = '/api/v1'
    # SSL
    # SSL_CONTEXT = ("./keys/pc.chiro.work.pem", "./keys/pc.chiro.work.key")
    # SSL_CONTEXT = ("./keys/mayne.chiro.work.pem", "./keys/mayne.chiro.work.key")
    # SSL_CONTEXT = None
    SSL_CONTEXT = ("./keys/mayne.chiro.work.pem", "./keys/mayne.chiro.work.key") if ENVIRONMENT == 'dev' else None
    # Running config
    RUN_LISTENING = "0.0.0.0"
    RUN_PORT = int(os.environ.get("PORT", 8980)) if SSL_CONTEXT is None else 443
    RUN_USE_RELOAD = False
    RUN_FRONTEND_PROXY = False
    # RUN_REBASE = True
    RUN_REBASE = False
    # Request API
    REQUEST_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:86.0) Gecko/20100101 Firefox/86.0"
    # Modules
    MODULES_PATH = "../modules/"
    MODULES = {
        'DoubSearch': None,
        # "bookFinder": "go run main.go"
        "bookFinder": None
    }
    # 模块遇到错误是否重启重新执行n次
    MODULES_RUN_RETRY = 3
    # 是否模块退出了仍然执行该模块
    MODULES_RUN_FOREVER = True
    # Search
    SEARCH_DEFAULT = "smart_search"
    SEARCH_SRC = {
        'smart_search': {
            'type': 'rpc',
            'params_type': 'rpc_smart_search',
            # 'call_name': 'BookFinder.FindBook',
            'call_name': 'BookFinder.GetBookTitles',
            'call_name2': 'BookFinder.GetDoubanItems',
            'name': '智能搜索'
        },
        'bing': {
            'type': 'function',
            'params_type': 'kwargs',
            'name': 'bing搜索'
        },
        'douban': {
            'type': 'rpc',
            'params_type': "rpc",
            'call_name': 'search',
            'name': '豆瓣搜索'
        },
        'szdnet': {
            'type': 'function',
            'params_type': 'kwargs',
            'name': '深圳文献港搜索'
        },
        'local_database': {
            'type': 'database',
            'params_type': 'kwargs',
            'name': '自有数据库搜索'
        }
    }
    # Dismiss rebase for multiprocessing
    DISMISS_REBASE = 'MAYNE_RUNNING_PID'
    # Spider
    # Proxy
    PROXY_POOL_API = 'http://shimamura.chiro.work:5010/' if ENVIRONMENT == 'dev' else 'http://127.0.0.1:5010/'
    PROXY_POOL_SIZE = 10
    # AI
    AI_BOT_ID = "2d46dead-fbdc-476d-b738-35910ca0c725"
    AI_BOT_ENV = "dev"


class Statics:
    tjw_access_token = TJWSS(Constants.JWT_SECRET_KEY, Constants.JWT_ACCESS_TIME)
    tjw_refresh_token = TJWSS(Constants.JWT_SECRET_KEY, Constants.JWT_REFRESH_TIME)
    rpcs = {
        'smart_search': RPCTarget('127.0.0.1', 9091, path='rpc/v1/bookfinder'),
        'douban': RPCTarget('127.0.0.1', 9092)
    }


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
