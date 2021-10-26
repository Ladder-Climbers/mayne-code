import threading

from flask import Flask
from flask_cors import CORS
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from werkzeug.middleware.http_proxy import ProxyMiddleware
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
# logger_werkzeug.setLevel(logging.DEBUG)

host, port = Constants.RUN_LISTENING, Constants.RUN_PORT
shadow_port = port + 1

# 中间件
dm = DispatcherMiddleware(app_file, {Constants.API_PATH: app_api})

if Constants.RUN_FRONTEND_PROXY:
    app_shadow = Flask(__name__ + "_shadow")
    app_proxy = ProxyMiddleware(app_shadow, {
        '/api/v1/': {
            "target": f"http://localhost:8081/api/v1/"
        },
        '/react/': {
            'target': "http://localhost:3000/"
        },
        '/static/': {
            'target': "http://localhost:3000/static/"
        }
    })
else:
    app_proxy = None

if __name__ == '__main__':
    logger.info('starting modules:')
    start_all()
    ssl_context = Constants.SSL_CONTEXT
    if Constants.RUN_FRONTEND_PROXY:
        logger.info(f'server started at {host}:{port} (shadow at {host}:{shadow_port}) ssl={ssl_context}')
        run_kwargs = {
            'use_reloader': Constants.RUN_USE_RELOAD,
            # 'ssl_context': 'adhoc'
            'ssl_context': ssl_context
        }
        t1 = threading.Thread(target=run_simple, args=(host, shadow_port, dm), kwargs={
            'use_reloader': Constants.RUN_USE_RELOAD
        }, daemon=True)
        t2 = threading.Thread(target=run_simple, args=(host, port, app_proxy), kwargs=run_kwargs, daemon=True)
        for t in [t1, t2]:
            t.start()
        for t in [t1, t2]:
            t.join()
    else:
        logger.info(f'server started at {host}:{port} ssl={ssl_context}')
        run_simple(host, port, dm, use_reloader=Constants.RUN_USE_RELOAD, ssl_context=ssl_context)
