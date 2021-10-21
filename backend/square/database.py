import copy

from data.tools import *
import datetime


# from utils.logger import logger


class SquareDB(BaseDB):
    def __init__(self, d, name: str):
        self.action = name
        super().__init__(d, 'square')


class SquareAllDB(SquareDB):
    def __init__(self, d):
        super(SquareAllDB, self).__init__(d, 'all')

    def find(self, filter_dict: dict = None, **kwargs):
        if filter_dict is None:
            filter_dict = {}
        return find_many(self.col, filter_dict, **kwargs)


class SquareCommentsDB(SquareDB):
    def __init__(self, d):
        super(SquareCommentsDB, self).__init__(d, 'comments')

    def add(self, uid: int, book_title: str, content: str, rating: float = None):
        auto_time_insert(self.col, {"action": self.action, "uid": uid, "book_title": book_title, "content": content,
                                    'rating': rating})

    def find(self, book_title: str, uid: int = None, **kwargs) -> list:
        filter_dict = {"action": self.action, 'book_title': book_title}
        if uid is not None:
            filter_dict['uid'] = uid
        data = find_many(self.col, filter_dict, **kwargs)
        return data


class SquareBookListDB(SquareDB):
    def __init__(self, d):
        super(SquareBookListDB, self).__init__(d, 'book_list')

    def add(self, uid: int, book_title: str, list_name: str):
        auto_time_update(self.col, {"action": self.action, 'uid': uid, 'list_name': list_name},
                         {"action": self.action, 'uid': uid, 'list_name': list_name, 'book_title': book_title})

    def find_lists(self, uid: int, **kwargs) -> list:
        data = find_many(self.col, {'action': self.action, 'uid': uid}, **kwargs)
        return data

    def find(self, uid: int, list_name: str, **kwargs) -> list:
        data = find_many(self.col, {"action": self.action, 'uid': uid, 'list_name': list_name}, **kwargs)
        return data


class SquareMessagesDB(SquareDB):
    def __init__(self, d):
        super(SquareMessagesDB, self).__init__(d, 'messages')

    def add(self, uid: int, to_uid: int, content: str):
        auto_time_insert(self.col, {"action": self.action, 'uid': uid, 'to_uid': to_uid, 'content': content})

    def find(self, uid: int, **kwargs) -> dict:
        received = find_many(self.col, {"action": self.action, 'to_uid': uid}, **kwargs)
        sent = find_many(self.col, {"action": self.action, 'uid': uid}, **kwargs)
        return {'received': received, 'sent': sent}


class SquareRelationsDB(SquareDB):
    def __init__(self, d):
        super(SquareRelationsDB, self).__init__(d, 'relations')

    # 关注（单向）
    def add(self, uid: int, to_uid: int, is_friends: bool = True):
        auto_time_update(self.col, {"action": self.action, 'uid': uid, 'to_uid': to_uid},
                         {"action": self.action, 'uid': uid, 'to_uid': to_uid, 'is_friends': is_friends})

    def find_one(self, uid: int, to_uid: int, **kwargs) -> bool:
        data = find_one(self.col, {"action": self.action, 'uid': uid, 'to_uid': to_uid}, **kwargs)
        if data is None:
            return False
        return data.get('is_friends', False)

    def find(self, uid: int, **kwargs) -> list:
        data = find_many(self.col, {'action': self.action, 'uid': uid}, **kwargs)
        return data


class SquareShareDB(SquareDB):
    def __init__(self, d):
        super(SquareShareDB, self).__init__(d, 'share')

    def add(self, uid: int, book_title: str, share_comments: str = None):
        insert_dict = {"action": self.action, 'uid': uid, 'book_title': book_title}
        if share_comments is not None:
            insert_dict['share_comments'] = share_comments
        auto_time_insert(self.col, insert_dict)


class SquareDynamicDB(SquareDB):
    def __init__(self, d):
        super(SquareDynamicDB, self).__init__(d, 'dynamic')

    def add(self, uid: int, dynamic: str):
        auto_time_insert(self.col, {'action': self.action, 'uid': uid, 'dynamic': dynamic})

    def find(self, uid: int, **kwargs):
        find_many(self.col, {'action': self.action, 'uid': uid}, **kwargs)


class SquareLogsDB(SquareDB):
    def __init__(self, d):
        super(SquareLogsDB, self).__init__(d, 'logs')

    def add(self, uid: int, type_: str, content: str):
        auto_time_insert(self.col, {'action': self.action, 'uid': uid, 'type': type_, 'content': content})

    def find(self, uid: int, **kwargs):
        find_many(self.col, {'action': self.action, 'uid': uid}, **kwargs)
