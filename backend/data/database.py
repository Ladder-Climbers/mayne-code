import time
# from utils.logger import logger
from data.tools import *


class DataBase:
    # 用到的所有数据集合
    COLLECTIONS = [

    ]

    def __init__(self):
        self.client = None
        self.db = None
        self.connect_init()
        self.init_parts()
        if Constants.RUN_REBASE:
            self.rebase()

    def init_parts(self):
        pass

    def rebase(self):
        for col in DataBase.COLLECTIONS:
            logger.info(f'Dropping {col}')
            self.db[col].drop()
        self.init_parts()

    def connect_init(self):
        if len(Constants.DATABASE_URI) > 0:
            self.client = pymongo.MongoClient(Constants.DATABASE_URI)
        else:
            self.client = pymongo.MongoClient()
        self.db = self.client[Constants.DATABASE_NAME]

    def error_report(self, error):
        self.db.gbk_bug.insert_one({'time': time.asctime(), 'error': error})


db = DataBase()
