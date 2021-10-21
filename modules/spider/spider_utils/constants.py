import os
import platform
import my_secrets


class Constants:
    # Version info
    VERSION = "0.2.0"
    ADMIN = "chiro"
    EMAIL = "Chiro2001@163.com"
    # Environment
    ENVIRONMENT = os.environ.get("ENV") if os.environ.get("ENV") is not None else (
        "release" if platform.system() == 'Linux' else "dev")
    # Find
    # FIND_LIMIT = 30
    FIND_LIMIT = 8
    # Database
    DATABASE_URI = my_secrets.SECRET_MONGO_URI
    DATABASE_NAME = DATABASE_URI.split('/')[-1]
    # Request API
    REQUEST_HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:93.0) Gecko/20100101 Firefox/93.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1"
    }
    # Proxy
    PROXY_POOL_API = 'http://shimamura.chiro.work:5010/' if ENVIRONMENT == 'dev' else 'http://127.0.0.1:5010/'
