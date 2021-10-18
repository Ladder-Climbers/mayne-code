# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html

import pymongo

# useful for handling different item types with a single interface
from itemadapter import ItemAdapter

from spider.items import DoubanItem
from spider.spiders.douban import DoubanSpider
from utils.db import douban_db


class DoubanPipeline:
    def process_item(self, item: DoubanItem, spider: DoubanSpider):
        spider.logger.info(f"Got book item: {item.get('title')}")
        douban_db.update_item(item)
        return item
