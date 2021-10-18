# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class DoubanItem(scrapy.Item):
    title = scrapy.Field()
    douban_url = scrapy.Field()
    rating_nums = scrapy.Field()
    description = scrapy.Field()
    base_info = scrapy.Field()
    comment_number = scrapy.Field()
    douban_id = scrapy.Field()
    pricing = scrapy.Field()
