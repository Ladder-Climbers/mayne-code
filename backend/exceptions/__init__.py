from utils.logger import logger


class MayneBaseError(Exception):
    def __init__(self, data: str = None):
        self.data = data
        logger.error(self.__str__())

    def __str__(self):
        return f"Error: {self.__class__.__name__}{(' : %s' % self.data) if self.data is not None else ''}"


class MayneUserExist(MayneBaseError):
    pass


class MaynePermissionError(MayneBaseError):
    pass


class MayneLoginError(MayneBaseError):
    pass


class MayneShopIdError(MayneBaseError):
    pass


class MayneError(MayneBaseError):
    pass


class MayneCookiesError(MayneBaseError):
    pass
