import requests
import random

def rpc_call(name):
    url = 'http://localhost:9091/rpc/v1/bookfinder'
    payload = {
        'jsonrpc': '2.0',
        'id': random.randint(1, 10),
        'method': 'BookFinder.GetDoubanItems',
        'params': {
  "books": [
    {
      "title": name,
      "req_id": 1
    }
  ]
}
    }

    r = requests.post(url, json=payload)

    print(r.text)

if __name__ == '__main__':
    while(1):
        name = input()
        rpc_call(name)