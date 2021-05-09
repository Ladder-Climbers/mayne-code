from flask import Flask
from flask_cors import CORS
from flask_restful import Resource, Api
from utils.utils import logger, get_class_docs


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
api = Api(app)
api.add_resource(MainAPI, '/')

if __name__ == '__main__':
    app.run()
