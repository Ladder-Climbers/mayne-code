import os
import multiprocessing
import threading
from data.config import Constants
from utils.logger import logger
import platform


def execute_module(module_name: str, cmd: str, retry: int = 0) -> bool:
    res = os.system(cmd)
    if res != 0:
        if retry < Constants.MODULES_RUN_RETRY:
            logger.warning(f'module {module_name} returns {res}, retry = {retry}.')
            return execute_module(module_name, cmd, retry + 1)
        else:
            logger.error(f'modules {module_name} returns {res}, execute failed.')
            if Constants.MODULES_RUN_FOREVER:
                # 不 计 前 嫌
                return execute_module(module_name, cmd)
            else:
                return False
    else:
        if Constants.MODULES_RUN_FOREVER:
            return execute_module(module_name, cmd)


def run_module(module_name: str, modules_path: str = Constants.MODULES_PATH):
    if module_name not in Constants.MODULES:
        return
    os.chdir(os.path.join(modules_path, module_name))
    if Constants.MODULES[module_name] is None:
        try:
            with open(f"command_{'win' if platform.system() == 'Windows' else 'linux'}.txt", 'r') as f:
                Constants.MODULES[module_name] = f.read()
        except FileNotFoundError:
            try:
                with open(f"command.txt", 'r') as f:
                    Constants.MODULES[module_name] = f.read()
            except FileNotFoundError as e:
                logger.error(f'Cannot start module {module_name}, error: {e}')
                return
    cmd = Constants.MODULES[module_name]
    # logger.warning(f'executing {cmd}')
    # os.chdir(path_origin)
    logger.info(f'module {module_name} starting with cmd: '
                f'{cmd}')
    execute_module(module_name, cmd)


def start_module(module_name: str, modules_path: str = Constants.MODULES_PATH):
    p = multiprocessing.Process(target=run_module, args=(module_name, modules_path))
    p.start()
    # t = threading.Thread(target=run_module, args=(module_name, modules_path))
    # t.setDaemon(True)
    # t.start()


def start_all(modules_path: str = Constants.MODULES_PATH):
    for name in Constants.MODULES:
        logger.info(f'module {name} starting with cmd: '
                    f'{Constants.MODULES[name] if Constants.MODULES[name] is not None else "(in file)"}')
        start_module(name, modules_path)
