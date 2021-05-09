import pymongo
from utils.utils import logger


class Config:
    DB_NAME = 'gbk'
    COL_NAME = 'config'
    VERSION = "0.2.0"
    VERSION_API = "v2"

    def __init__(self):
        self.data_default = {
            "version": Config.VERSION,
            "version_api": Config.VERSION_API,
            'port': 8080,
            'host': '0.0.0.0',
            "api_server": {
                "upgradable": True,
                "api_prefix": f"/api/{Config.VERSION_API}"
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
        client = pymongo.MongoClient()
        db = client[Config.DB_NAME]
        col = db[Config.COL_NAME]
        result = col.find_one({'version': {'$exists': True}}, {'_id': 0})
        if result is None:
            col.insert_one(self.data)
        else:
            col.update_one({'version': {'$exists': True}}, {'$set': self.data})

    def load(self):
        client = pymongo.MongoClient()
        db = client[Config.DB_NAME]
        col = db[Config.COL_NAME]
        result = col.find_one({'version': {'$exists': True}}, {'_id': 0})
        if result is None:
            logger.warning('loading default config data...')
            self.data = self.data_default
        else:
            # TODO: 数据库升级操作
            self.data = result
        self.save()


config = Config()
