from utils.rpc_tools import *


async def return_it(data):
    return data


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
            if info['params_type'] == 'rpc_smart_search':
                titles_data = await asyncio.create_task(
                    Statics.rpcs[src].call(info['call_name'], get_search_params(src, key, page=page)))
                logger.warning(f"{titles_data.__class__.__name__} {titles_data}")
                titles = json.loads(titles_data) if isinstance(titles_data, str) else titles_data
                # logger.warning(f"{titles}")
                reqs = {
                    "books": [{
                        "title": t.get('title'),
                        "req_id": t.get('ranking')
                    } for t in titles.get('books', [])[:10]]
                }
                books_info = await asyncio.create_task(Statics.rpcs[src].call(info['call_name2'], reqs))
                logger.warning(f"{books_info.__class__.__name__} {books_info}")
                books = [book_result.get('answer_list')[0] for book_result in
                         books_info.get('books', {"answer_list": [], "error": "Error"}) if
                         book_result.get('error') is None and len(book_result.get("answer_list")) > 0]
                tasks[src] = return_it({"books": books})
            else:
                tasks[src] = asyncio.create_task(
                    Statics.rpcs[src].call(info['call_name'], get_search_params(src, key, page=page)))
        elif info['type'] == 'function':
            logger.warning('function task')
            pass
    result = {task_name: await tasks[task_name] for task_name in tasks if tasks[task_name] is not None}
    return result
