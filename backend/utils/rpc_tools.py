from utils.logger import logger
import requests
import json


class RPCTarget:
    def __init__(self, host: str, port: int, path: str = '', protocol: str = 'http'):
        self.host, self.port, self.protocol, self.path = host, port, protocol, path

    def url(self) -> str:
        return f'{self.protocol}://{self.host}:{self.port}/{self.path}'

    async def call(self, method: str, params: list, id_: int = 1):
        url = self.url()
        logger.warning(f'url {url}')
        payload = {
            "method": method,
            "params": params,
            "jsonrpc": '2.0',
            "id": id_
        }
        logger.warning(f'payload: {payload}')
        response = requests.post(url, json=payload).json()
        logger.warning(f'response {response}')
        return response
