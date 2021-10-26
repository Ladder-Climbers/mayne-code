from utils.rpc_type import *
from data.config import Constants, Statics


def get_search_params(src: str, key: str, page: int = 0):
    if src not in Constants.SEARCH_SRC:
        return None
    params_type = Constants.SEARCH_SRC[src]['params_type']
    if params_type == 'kwargs':
        return {"key": key, "page": page}
    if params_type == 'rpc':
        return [key, page]
    if params_type == 'rpc_smart_search':
        return [{
            'type': 'request',
            'keyword': key,
            'count': Constants.FIND_LIMIT // 5
            # 'count': 3
        }]
