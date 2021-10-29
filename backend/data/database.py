import time
import traceback
import os
# from utils.logger import logger
from data.tools import *
from search.database import SearchDB
from square.database import *

from user.database import *
from session.database import *
from sync.database import *


class DataBase:
    # 用到的所有数据集合
    COLLECTIONS = [
        'user', 'user_uid', 'mayne_bug', 'session', 'session_disabled_token', 'sync', 'square', 'search'
    ]

    def __init__(self, dismiss_rebase=False):
        self.client = None
        self.db = None
        self.user: UserDB = None
        self.session: SessionDB = None
        self.sync: SyncDB = None
        self.square_comments: SquareCommentsDB = None
        self.square_book_list: SquareBookListDB = None
        self.square_messages: SquareMessagesDB = None
        self.square_relations: SquareRelationsDB = None
        self.square_share: SquareShareDB = None
        self.square_dynamic: SquareDynamicDB = None
        self.square_logs: SquareLogsDB = None
        self.square_all: SquareAllDB = None
        self.search: SearchDB = None
        self.connect_init()
        self.init_parts()
        if Constants.RUN_REBASE and not dismiss_rebase:
            self.rebase()

    def init_parts(self):
        self.user = UserDB(self.db)
        self.session = SessionDB(self.db)
        self.sync = SyncDB(self.db)
        self.square_comments = SquareCommentsDB(self.db)
        self.square_dynamic = SquareDynamicDB(self.db)
        self.square_share = SquareShareDB(self.db)
        self.square_logs = SquareLogsDB(self.db)
        self.square_relations = SquareRelationsDB(self.db)
        self.square_book_list = SquareBookListDB(self.db)
        self.square_messages = SquareMessagesDB(self.db)
        self.square_all = SquareAllDB(self.db)
        self.search = SearchDB(self.db)

    def rebase(self):
        logger.warning('Rebasing...')
        for col in DataBase.COLLECTIONS:
            # logger.info(f'Dropping {col}')
            self.db[col].drop()
        # # Square 还有自建 Collections
        # for col in SquareDB.recorded_col_name:
        #     self.db[col].drop()
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
        self.db.mayne_bug.insert_one({'time': time.asctime(), 'error': error})


# 由主进程启动的进程不重新初始化数据库
if os.getenv(Constants.DISMISS_REBASE) is None:
    os.environ.setdefault(Constants.DISMISS_REBASE, f"{os.getpid()}")

db = DataBase(dismiss_rebase=os.getenv(Constants.DISMISS_REBASE) == f"{os.getppid()}")
