import json
from flask import Flask, Response
from flask_cors import CORS
from flask_restful import Resource, Api

from utils.docs import get_class_docs
from search.api import SearchAPI

from user.api import *
from session.api import *
from sync.api import *
from recommends.api import *


class MainAPI(Resource):
    """
    文档测试
    """

    def get(self):
        """
        获取各个API的文档
        """
        return make_result(data={'document': {endpoint: get_class_docs(resources[endpoint]) for endpoint in resources}})


class DropData(Resource):
    def get(self):
        db.rebase()
        return make_result()


resources = {}


def add_resource(class_type: Resource, endpoint: str):
    global resources
    resources[endpoint] = class_type


def apply_resource():
    for endpoint in resources:
        api.add_resource(resources[endpoint], endpoint)


app = Flask(__name__)
api = Api(app)
add_resource(MainAPI, '/')
add_resource(SearchAPI, '/search')
add_resource(User, "/user")
add_resource(UserUid, "/user/<int:uid>")
add_resource(UserInfo, "/user_info")
add_resource(Session, "/session")
add_resource(Password, '/password')
add_resource(Sync, '/sync')
add_resource(DropData, '/drop_data')
add_resource(DoubanTopAPI, '/douban_top')
apply_resource()

CORS(app)


@app.after_request
def api_after(res: Response):
    if len(res.data) > 0:
        try:
            js = json.loads(res.data)
            js['code'] = res.status_code
            res.data = json.dumps(js).encode()
            if js['code'] != 200:
                logger.warning(f'response: {js}')
        except Exception as e:
            logger.error(e)
            logger.error(f'data: {res.data}')
        # print(res.data)
    return res


if __name__ == '__main__':
    app.run()
