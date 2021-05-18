import json
from flask import Flask, Response
from flask_cors import CORS
from flask_restful import Resource, Api

from utils.docs import get_class_docs
from search.api import SearchAPI

from user.api import *
from session.api import *
from sync.api import *


class MainAPI(Resource):
    """
    文档测试
    """

    def get(self):
        """
        文档：get
        :return:
        """
        return {
            'code': 200,
            'document': get_class_docs(self)
        }


app = Flask(__name__)
CORS(app)
api = Api(app)
api.add_resource(MainAPI, '/')
api.add_resource(SearchAPI, '/search')
api.add_resource(User, "/user")
api.add_resource(UserUid, "/user/<int:uid>")
api.add_resource(UserInfo, "/user_info")
api.add_resource(Password, '/password')
api.add_resource(Sync, '/sync')


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
        # print(res.data)
    return res


if __name__ == '__main__':
    app.run()
