# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html
import threading

import pymongo

# useful for handling different item types with a single interface
from itemadapter import ItemAdapter

from spider.items import DoubanItem, DoubanDetailsItem
from spider.spiders.douban import DoubanSpider
from spider_utils.douban_database import douban_db


class DoubanPipeline:
    def process_item(self, item, spider: DoubanSpider):
        spider.logger.info(f"Got book item: {item.get('title', item.get('douban_id'))}")

        def update_item(item_):
            try:
                spider.logger.info(f"saving {item_.__class__.__name__} {item_.get('douban_id')}")
            except Exception as e:
                spider.logger.warning(f"{e.__class__.__name__} {e}")
            if isinstance(item_, DoubanItem):
                douban_db.update_item(item_)
            elif isinstance(item_, DoubanDetailsItem):
                douban_db.update_details(details=item_)

        threading.Thread(target=update_item, args=(item,), daemon=True).start()
        return item
