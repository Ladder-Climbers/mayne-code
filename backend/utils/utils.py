import os
import re
import logging
from colorlog import ColoredFormatter
import sys
import traceback


def get_logger(name=__name__):
    logger_base = logging.getLogger(name)
    logger_base.setLevel(logging.DEBUG)
    stream_handler = logging.StreamHandler()
    color_formatter = ColoredFormatter('%(log_color)s[%(module)-15s][%(funcName)-15s][%(levelname)-7s] %(message)s')
    stream_handler.setFormatter(color_formatter)
    logger_base.addHandler(stream_handler)
    return logger_base


logger = get_logger(__name__)
logger.setLevel(logging.INFO)


def get_traceback():
    traceback.print_exc()  # 打印异常信息
    exc_type, exc_value, exc_traceback = sys.exc_info()
    error = str(repr(traceback.format_exception(exc_type, exc_value, exc_traceback)))  # 将异常信息转为字符串
    return error


def get_class_docs(class_: classmethod, target_methods=None):
    def parse_doc(text: str):
        if text is None or len(text) == 0:
            return None
        lines = text.split('\n')
        if lines[0] == '':
            lines = lines[1:]
        if lines[-1] == '' or lines[-1].startswith('    '):
            lines = lines[:-1]
        res = ''
        for li in lines:
            while li.startswith(' '):
                li = li[1:]
            res = res + li + '\n'
        res = res[:-1]
        return res

    if target_methods is None:
        target_methods = [
            'get', 'post', 'put', 'delete'
        ]
    dirs = dir(class_)
    result = {
        'disc': parse_doc(class_.__doc__),
        'methods': {}
    }
    for d in dirs:
        if d not in target_methods:
            continue
        target = eval(f"class_.{d}")
        if type(target) is not None and '__doc__' in dir(target):
            doc = parse_doc(target.__doc__)
            if doc is None:
                continue
            result['methods'][d] = doc
    return result


def get_static_file_path(static_path: str, path: str):
    return os.path.join(static_path, path)


# 检查请求路径有效性
def is_file_path_legal(static_path: str, path: str):
    # 文件要存在
    file_path = get_static_file_path(static_path, path)
    # logger.info('abspath: %s' % os.path.abspath(file_path))
    # logger.info('os.path.exists(file_path): %s' % os.path.exists(file_path))
    # logger.info('os.path.isfile(file_path): %s' % os.path.isfile(file_path))
    if not (os.path.exists(file_path) and os.path.isfile(file_path)):
        return False
    # 不能使用两个点向上目录
    if '..' in re.split(r"[/\\]", file_path):
        return False
    return True
