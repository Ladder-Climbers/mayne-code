import re

from bs4 import BeautifulSoup as Soup
import scrapy

from spider.items import DoubanItem
from utils.strings import my_strip


class DoubanSpider(scrapy.Spider):
    name = 'douban'
    allowed_domains = ['douban.com']
    start_urls = ['https://book.douban.com/tag/%E5%B0%8F%E8%AF%B4?start=20&type=T']

    def parse(self, response) -> list:
        soup = Soup(response.body, 'lxml')
        subject_list = soup.find('ul', class_='subject-list')

        def parse_subject_item(subject_item) -> dict:
            book_item = {
                'title': my_strip(subject_item.find('h2').get_text()),
                'douban_url': subject_item.find('a').attrs.get('href'),
                'rating_nums': float(my_strip(subject_item.find('span', class_='rating_nums').get_text())),
                'description': my_strip(subject_item.find('p').get_text()),
                'base_info': my_strip(subject_item.find('div', class_='pub').get_text()),
                'comment_number': int(
                    re.findall(r'\([0-9]*', my_strip(subject_item.find('span', class_='pl').get_text()))[0][1:]),
                'douban_id': int(subject_item.find('a').attrs.get('href').split('/')[-2]),
                'pricing': [my_strip(a.get_text()) for a in
                            subject_item.find('span', class_='buy-info').find_all('a')]
                if subject_item.find('span', class_='buy-info') is not None else []
            }
            item = DoubanItem()
            for key in book_item:
                item[key] = book_item
            return item

        page_items = [parse_subject_item(subject_item_) for subject_item_ in subject_list.find_all("li")]
        return page_items
