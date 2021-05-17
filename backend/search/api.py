from utils.api_tools import *


class SearchAPI(Resource):
    args_search = reqparse.RequestParser() \
        .add_argument("key", type=str, required=True, location=["args", ]) \
        .add_argument("page", type=int, required=False, location=["args", ])

    @args_required_method(args_search)
    def get(self):
        args = self.args_search.parse_args()
        key: str = args.get('key')
        page: int = args.get('page')

        return make_result(data={'result': ''})
