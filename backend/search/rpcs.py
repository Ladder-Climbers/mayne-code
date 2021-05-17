import asyncio
from utils.logger import logger
from data.config import Statics, Constants


async def rpcs_search(key: str, page: int = 0):
    task_go = None
    try:
        task_go = asyncio.create_task(Statics.rpc_spider_go.call('BookFinder.FindBook', [{
            'type': 'request',
            'request': key,
            'count': Constants.FIND_LIMIT
        }]))
    except Exception as e:
        logger.error(f'go error: {e}')

    result_go = await task_go if task_go is not None else None
    # task_node = asyncio.create_task(Statics.rpc_spider_nodejs.call('search', [key, page]))
    # result_node = await task_node
    return result_go
