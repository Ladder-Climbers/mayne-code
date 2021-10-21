import pymongo

# from spider.items import DoubanItem
from spider_utils.constants import Constants
from spider_utils.db_tools import auto_time_update, find_one, find_many


class Database:
    def __init__(self, col_name: str = 'undefined'):
        self.client = pymongo.MongoClient(Constants.DATABASE_URI)
        self.db = self.client[Constants.DATABASE_NAME]
        self.col = self.db[col_name]


class DoubanDB(Database):
    def __init__(self):
        super(DoubanDB, self).__init__(col_name='spider_douban')
        self.col_tags = self.db['spider_douban_tags']
        self.col_details = self.db['spider_douban_details']

    def set_details_finish(self, douban_id: int, finished: bool = True):
        auto_time_update(self.col_details, {"details_finish_mark": True, "douban_id": douban_id},
                         {"details_finish_mark": True, "douban_id": douban_id, 'finished': finished})

    def get_details_finish(self, douban_id: int) -> bool:
        data = find_one(self.col_details, {"details_finish_mark": True, 'douban_id': douban_id})
        if data is None:
            return False
        return data.get('finished')

    def update_tags(self, tags: list, sort_type):
        auto_time_update(self.col_tags, {'tags_mark': True, 'sort_type': sort_type}, {'tags_mark': True, "tags": tags})

    def get_tags(self, sort_type: str) -> dict:
        data = find_one(self.col_tags, {'tags_mark': True, 'sort_type': sort_type})
        if data is None:
            return {}
        return data.get('tags', {})

    def set_tag_max(self, tag: str, max_start: int, sort_type: str):
        auto_time_update(self.col_tags, {"tags_max": True, "tag": tag, 'sort_type': sort_type},
                         {"tags_max": True, "tag": tag, "max_start": max_start, 'sort_type': sort_type})

    def get_tag_max(self, tag: str, sort_type: str) -> int:
        data = find_one(self.col_tags, {"tags_max": True, "tag": tag, 'sort_type': sort_type})
        if data is None:
            return 1000
        return data.get('max_start')

    def set_tag_finish(self, tag: str, start: int, finished: bool = True, sort_type: str = ''):
        auto_time_update(self.col_tags, {"tags_finish_mark": True, "tag": tag, "start": start, 'sort_type': sort_type},
                         {"tags_finish_mark": True, "tag": tag, "finished": finished, "start": start,
                          'sort_type': sort_type})

    def get_tag_finish_set(self, tag: str, sort_type: str = '') -> set:
        filter_dict = {"tags_finish_mark": True, 'tag': tag, 'sort_type': sort_type}
        data = find_many(self.col_tags, filter_dict=filter_dict)
        if data is None:
            return set({})
        # data_set = {f"{d.get('sort_type')}_{d.get('start')}" for d in data if d.get('finished')}
        data_set = {(d.get('sort_type'), d.get('start')) for d in data if d.get('finished')}
        return data_set

    def get_items(self, *args, **kwargs):
        return find_many(self.col, *args, **kwargs)

    def update_item(self, item):
        item_dict = item
        if not isinstance(item_dict, dict):
            item_dict = dict(item)
        auto_time_update(self.col, {'douban_id': item_dict.get('douban_id')}, item_dict)

    def update_details(self, details: dict):
        details_dict = details
        if not isinstance(details_dict, dict):
            details_dict = dict(details)
        auto_time_update(self.col_details, {'douban_id': details_dict.get('douban_id')}, details_dict)

    def get_douban_ids(self) -> list:
        data = self.col.find({"douban_id": {"$exists": True}}, {"douban_id": 1, "_id": 0})
        data = [d.get('douban_id') for d in data]
        list.sort(data)
        return data

    def set_douban_id_cnt(self, douban_id: int):
        auto_time_update(self.col, {"douban_id_cnt": {"$exists": True}}, {"douban_id_cnt": douban_id})

    def get_douban_id_cnt(self) -> int:
        data = find_one(self.col_details, {"douban_id_cnt": {"$exists": True}})
        if data is None:
            return -1
        return data.get('douban_id_cnt')

    def get_douban_details_finished(self) -> set:
        data = list(self.col_details.find({"douban_id": {"$exists": True}}, {"douban_id": 1, "_id": 0}))
        data = [d.get('douban_id', 0) for d in data]
        return set(data)


douban_db = DoubanDB()
