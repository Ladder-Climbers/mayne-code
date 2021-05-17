from utils.rpc_tools import *


async def rpcs_search(key: str, page: int = 0, srcs: list = None):
    if srcs is None:
        srcs = [Constants.SEARCH_DEFAULT, ]
    tasks = {}
    for src in srcs:
        if src not in Constants.SEARCH_SRC:
            logger.warning(f'got unknown src: {src}')
            continue
        info = Constants.SEARCH_SRC[src]
        if info['type'] == 'rpc':
            if src not in Statics.rpcs:
                logger.warning(f'got unknown rpc: {src}')
                continue
            tasks[src] = asyncio.create_task(
                Statics.rpcs[src].call(info['call_name'], get_search_params(src, key, page=page)))
        elif info['type'] == 'function':
            logger.warning('function task')
            pass
    result = {task_name: await tasks[task_name] for task_name in tasks if tasks[task_name] is not None}
    return result
