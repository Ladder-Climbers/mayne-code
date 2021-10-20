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


class DoubanDetailsItem(scrapy.Item):
    douban_id = scrapy.Field()
    author = scrapy.Field()
    publisher = scrapy.Field()
    publish_time = scrapy.Field()
    page_count = scrapy.Field()
    pricing = scrapy.Field()
    binding = scrapy.Field()
    series = scrapy.Field()
    ISBN = scrapy.Field()
    rating_nums = scrapy.Field()
    shop = scrapy.Field()
    description = scrapy.Field()
    description_author = scrapy.Field()
    tags = scrapy.Field()
    recommends = scrapy.Field()
    comments = scrapy.Field()
    reviews = scrapy.Field()
    subtitle = scrapy.Field()
    translator = scrapy.Field()
    producer = scrapy.Field()
    extras = scrapy.Field()
