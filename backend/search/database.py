from data.tools import *


class SearchDB(BaseDB):
    def __init__(self, d):
        super().__init__(d, 'search')

    def log_find(self, uid: int, **kwargs) -> list:
        return find_many(self.col, {'uid': uid}, **kwargs)

    def log_insert(self, uid: int, key: str):
        auto_time_insert(self.col, {'uid': uid, "key": key})
