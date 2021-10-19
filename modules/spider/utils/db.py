import pymongo

from spider.items import DoubanItem
from utils.constants import Constants
from utils.db_tools import auto_time_update, find_one


class Database:
    def __init__(self, col_name: str = 'undefined'):
        self.client = pymongo.MongoClient(Constants.DATABASE_URI)
        self.db = self.client[Constants.DATABASE_NAME]
        self.col = self.db[col_name]


class DoubanDB(Database):
    def __init__(self):
        super(DoubanDB, self).__init__(col_name='spider_douban')
        self.col_tags = self.db['spider_douban_tags']

    def update_tags(self, tags: list):
        auto_time_update(self.col_tags, {'tags_mark': True}, {'tags_mark': True, "tags": tags})

    def get_tags(self) -> dict:
        data = find_one(self.col_tags, {'tags_mark': True})
        if data is None:
            return {}
        return data.get('tags', {})

    def set_tag_max(self, tag: str, max_start: int):
        auto_time_update(self.col_tags, {"tags_max": True, "tag": tag},
                         {"tags_max": True, "tag": tag, "max_start": max_start})

    def get_tag_max(self, tag: str) -> int:
        data = find_one(self.col_tags, {"tags_max": True, "tag": tag})
        if data is None:
            return 1000
        return data.get('max_start')

    def set_tag_finish(self, tag: str, start: int, finished: bool):
        auto_time_update(self.col_tags, {"tags_finish_mark": True, "tag": tag, "start": start},
                         {"tags_finish_mark": True, "tag": tag, "finished": finished, "start": start})

    def get_tag_finish(self, tag: str, start: int) -> bool:
        data = find_one(self.col_tags, {"tags_finish_mark": True, "tag": tag, "start": start})
        if data is None:
            return False
        return data.get('finished')

    def update_item(self, item: DoubanItem):
        item_dict = item
        if not isinstance(item_dict, dict):
            item_dict = dict(item)
        auto_time_update(self.col, {'douban_id': item_dict.get('douban_id')}, item_dict)


douban_db = DoubanDB()
