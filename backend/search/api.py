from utils.api_tools import *
import asyncio
from search.rpcs import rpcs_search


class SearchAPI(Resource):
    args_search = reqparse.RequestParser() \
        .add_argument("key", type=str, required=True, location=["args", ]) \
        .add_argument("page", type=int, required=False, location=["args", ])

    @args_required_method(args_search)
    def get(self):
        args = self.args_search.parse_args()
        key: str = args.get('key')
        page: int = args.get('page', 0)
        loop = asyncio.get_event_loop()
        resp = loop.run_until_complete(rpcs_search(key, page=page))
        # loop.close()
        # print(resp)
        return make_result(data={'search': resp['result']['books']})
