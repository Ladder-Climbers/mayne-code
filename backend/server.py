from werkzeug.middleware.dispatcher import DispatcherMiddleware
from werkzeug.serving import run_simple
import logging
from utils.logger import logger
from data.config import Constants
from start_modules import start_all

from others.file_static import app as app_file
from apis.api_main import app as app_api

# 只显示错误消息
logger_werkzeug = logging.getLogger('werkzeug')
logger_werkzeug.setLevel(logging.ERROR)

# 中间件
dm = DispatcherMiddleware(app_file, {Constants.API_PATH: app_api})

if __name__ == '__main__':
    host, port = Constants.RUN_LISTENING, Constants.RUN_PORT
    logger.info('starting modules:')
    start_all()
    logger.info(f'server started at {host}:{port}')
    run_simple(host, port, dm, use_reloader=False)
