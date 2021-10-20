from data.tools import *
import datetime
# from utils.logger import logger


class SquareDB(BaseDB):
    def __init__(self, d):
        super().__init__(d, 'square')


class SquareCommentsDB(SquareDB):
    def __init__(self, d):
        super(SquareCommentsDB, self).__init__(d)




