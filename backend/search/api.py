from utils.api_tools import *
import json
import asyncio
from search.rpcs import rpcs_search


class SearchAPI(Resource):
    """
    搜索API
    """
    args_search = reqparse.RequestParser() \
        .add_argument("srcs", type=str, help="搜索来源[a,b,c]", required=False, location=["args", ]) \
        .add_argument("src", type=str, help="搜索来源", required=False, location=["args", ],
                      choices=list(Constants.SEARCH_SRC.keys())) \
        .add_argument("key", type=str, help="搜索关键词", required=True, location=["args", ]) \
        .add_argument("page", type=int, help="跳页页数", required=False, location=["args", ])

    @args_required_method(args_search)
    def get(self):
        """
        搜索功能
        """
        args = self.args_search.parse_args()
        key: str = args.get('key')
        page: int = args.get('page', 0)
        src: str = args.get('src')
        srcs: str = args.get('srcs')
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
        loop = asyncio.get_event_loop()
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
