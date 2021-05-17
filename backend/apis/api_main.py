import json
from flask import Flask, Response
from flask_cors import CORS
from flask_restful import Resource, Api
from utils.logger import logger
from utils.docs import get_class_docs
from search.api import SearchAPI


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
