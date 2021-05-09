from werkzeug.middleware.dispatcher import DispatcherMiddleware
from werkzeug.serving import run_simple
import logging
from utils.utils import logger
from config.config import config

from others.file_static import app as app_file
from apis.api_main import app as app_api

# 只显示错误消息
logger_werkzeug = logging.getLogger('werkzeug')
logger_werkzeug.setLevel(logging.ERROR)

# 中间件
dm = DispatcherMiddleware(app_file,
                          {
                              config.data['api_server'].get('api_prefix', '/api/v2'): app_api
                          }
                          )

if __name__ == '__main__':
    host, port = config.data.get('host', '0.0.0.0'), config.data.get('port', 8080)
    logger.info(f'server started at {host}:{port}')
    run_simple(host, port, dm, use_reloader=False)
