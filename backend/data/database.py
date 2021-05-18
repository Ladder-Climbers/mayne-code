import time
# from utils.logger import logger
from data.tools import *

from user.database import *
from session.database import *
from sync.database import *


class DataBase:
    # 用到的所有数据集合
    COLLECTIONS = [
        'user', 'user_uid', 'gbk_bug', 'session', 'session_disabled_token', 'sync'
    ]

    def __init__(self):
        self.client = None
        self.db = None
        self.user: UserDB = None
        self.session: SessionDB = None
        self.sync: SyncDB = None
        self.connect_init()
        self.init_parts()
        if Constants.RUN_REBASE:
            self.rebase()

    def init_parts(self):
        self.user = UserDB(self.db)
        self.session = SessionDB(self.db)
        self.sync = SyncDB(self.db)

    def rebase(self):
        for col in DataBase.COLLECTIONS:
            logger.info(f'Dropping {col}')
            self.db[col].drop()
        self.init_parts()
        uid = self.user.insert(Constants.USERS_DEFAULT)
        self.session.insert(uid=uid, password=Constants.USERS_DEFAULT_PASSWORD)

    def connect_init(self):
        if len(Constants.DATABASE_URI) > 0:
            self.client = pymongo.MongoClient(Constants.DATABASE_URI)
        else:
            self.client = pymongo.MongoClient()
        self.db = self.client[Constants.DATABASE_NAME]

    def error_report(self, error):
        self.db.gbk_bug.insert_one({'time': time.asctime(), 'error': error})


db = DataBase()
