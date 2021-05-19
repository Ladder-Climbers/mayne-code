from utils.api_tools import *
from recommends.douban_top250 import DoubanTop


class DoubanTopAPI(Resource):
    """
    获取豆瓣读书 Top250 数据
    """
    args_get = reqparse.RequestParser() \
        .add_argument("page", help="分页", type=int, required=False, location=["args", ])

    @args_required_method(args_get)
    def get(self):
        page = self.args_get.parse_args().get("page")
        page = page if page is not None else 0
        result = DoubanTop().get_page(page=page)
        return make_result(data={'douban_top': result})
