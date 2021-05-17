import datetime


def get_date_timestamp(date) -> int:
    return int(datetime.datetime.timestamp(datetime.datetime.fromisoformat(date)) * 1000)


def get_timestamp_date(timestamp) -> str:
    return datetime.datetime.fromtimestamp(int(timestamp / 1000)).isoformat()[:10]


# YYYY-MM-DD 格式
def get_date_today() -> str:
    return get_timestamp_date(datetime.datetime.today().timestamp() * 1000)


def get_date_tomorrow(date_now=None) -> str:
    if date_now is None:
        return get_timestamp_date(datetime.datetime.today().timestamp() + 60 * 60 * 24)
    else:
        return get_timestamp_date(get_date_timestamp(date_now) + 60 * 60 * 24)
