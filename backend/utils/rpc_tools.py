import requests
import json


class RPCTarget:
    def __init__(self, host: str, port: int, protocol: str = 'http'):
        self.host, self.port, self.protocol = host, port, protocol

    def url(self) -> str:
        return f'{self.protocol}://{self.host}:{self.port}/'


def call_func(target: RPCTarget, method: str, params: list, id_: int = None):
    url = target.url()
    payload = {
        "method": method,
        "params": params,
        "jsonrpc": '2.0',
        "id": id_
    }
    response = requests.post(url, json=payload).json()
    return response
