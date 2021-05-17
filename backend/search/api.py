from utils.api_tools import *
import json
import asyncio
from search.rpcs import rpcs_search


class SearchAPI(Resource):
    args_search = reqparse.RequestParser() \
        .add_argument("srcs", type=str, required=False, location=["args", ]) \
        .add_argument("src", type=str, required=False, location=["args", ]) \
        .add_argument("key", type=str, required=True, location=["args", ]) \
        .add_argument("page", type=int, required=False, location=["args", ])

    @args_required_method(args_search)
    def get(self):
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
