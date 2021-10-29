from utils.api_tools import *
import json
import asyncio
from search.rpcs import rpcs_search
import sys
import importlib

sys.path.append("../modules/spider/")
sys.path.append("../modules/spider/spider_utils/")

douban_db = None
try:
    douban_database = importlib.import_module('douban_database')
    douban_db = douban_database.douban_db
except ImportError as e:
    logger.error(f"cannot import douban_db")


class SearchAPI(Resource):
    """
    搜索API
    """
    args_search = reqparse.RequestParser() \
        .add_argument("srcs", type=str, help="搜索来源[a,b,c]", required=False, location=["args", ]) \
        .add_argument("src", type=str, help="搜索来源", required=False, location=["args", ],
                      choices=list(Constants.SEARCH_SRC.keys())) \
        .add_argument("key", type=str, help="搜索关键词", required=True, location=["args", ]) \
        .add_argument("page", type=int, help="跳页页数", required=False, location=["args", ]) \
        .add_argument("specific", type=bool, help="指定确定信息", required=False, location=["args", ])

    @staticmethod
    def remove_punctuations(key: str) -> str:
        punctuations = [
            "。", "，", "“", "”", "‘", "’"
        ]
        for p in punctuations:
            key = key.replace(p, "")
        return key

    @staticmethod
    def remove_key_wrapper(key: str) -> str:
        prefix = [
            "书名叫", "书名是", "书的名字是", "名字是", "叫"
        ]
        for p in prefix:
            if key.startswith(p):
                key = key[len(p):]
        return key

    @args_required_method(args_search)
    @auth_required_method
    def get(self, uid: int):
        """
        搜索功能
        """
        args = self.args_search.parse_args()
        key: str = args.get('key')
        if key is None:
            key = ''
        key = self.remove_key_wrapper(key)
        key = self.remove_punctuations(key)
        page: int = args.get('page', 0)
        specific = args.get('specific', False)
        if specific is None:
            specific = False
        if page is None:
            page = 0
        src: str = args.get('src')
        srcs: str = args.get('srcs')
        if not specific:
            db.search.log_insert(uid, key)
        try:
            srcs = json.loads(srcs)
            if not isinstance(srcs, list):
                raise ValueError
        except (TypeError, ValueError, json.decoder.JSONDecodeError):
            srcs = None
        if srcs is None:
            if src is None:
                srcs = [Constants.SEARCH_DEFAULT, ]
            else:
                srcs = [src, ]
        if src == 'local_database':
            # 建立数据库后：
            # db.adminCommand({setParameter:true,textSearchEnabled:true})
            # db.spider_douban.createIndex({title:"text"})
            if specific:
                data = douban_db.get_items({'title': key})
                if len(data) == 0:
                    return make_result(data={'search': {'local_database': {'books': [], 'count': 0}}})
                return make_result(data={'search': {'local_database': {'books': data, 'count': 0}}})
            else:
                if key is None or (isinstance(key, str) and len(key) == 0):
                    data = douban_db.get_items({'douban_id': {"$exists": True}}, offset=page * Constants.FIND_LIMIT,
                                               limit=Constants.FIND_LIMIT)
                else:
                    data = douban_db.get_items({'douban_id': {"$exists": True}, "$text": {"$search": key}},
                                               offset=page * Constants.FIND_LIMIT, limit=Constants.FIND_LIMIT)
                return make_result(data={'search': {"local_database": {"books": data, "count": len(data)}}})
        loop = asyncio.get_event_loop()
        logger.warning(f"rpcs_search: {key}")
        resp = loop.run_until_complete(rpcs_search(key, page=page, srcs=srcs))
        # return make_result(data={'search': resp['result']['books']})
        if resp is None:
            return make_result(500, message='got null data')
        return make_result(data={'search': resp})

    def patch(self):
        """
        获取搜索信息
        """
        return make_result(data={'search_info': Constants.SEARCH_SRC})

    @auth_required_method
    def put(self, uid: int):
        return make_result(data={'search_logs': db.search.log_find(uid, sort_by="created_at", reverse=True, limit=5)})
