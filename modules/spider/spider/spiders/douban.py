import re
import traceback
import urllib

import requests
from bs4 import BeautifulSoup as Soup
import scrapy
from scrapy import Request

from twisted.internet.error import TimeoutError, TCPTimedOutError, ConnectionRefusedError

from spider.items import DoubanItem
from utils.constants import Constants
from utils.db import douban_db
from utils.proxies import get_proxy
from utils.strings import my_strip


def fetch_tags() -> list:
    html = requests.get("https://book.douban.com/tag/?icn=index-nav", headers=Constants.REQUEST_HEADERS).content
    soup = Soup(html, "html.parser")
    a_list = soup.find_all("a")
    tags = []
    for a in a_list:
        if not a.attrs.get("href", '').startswith('/tag/'):
            continue
        tags.append(a.get_text())
    return tags


class DoubanSpider(scrapy.Spider):
    name = 'douban'
    allowed_domains = ['douban.com']
    # start_urls = ['https://book.douban.com/tag/%E5%B0%8F%E8%AF%B4?start=20&type=T']
    target_page_url = 'https://book.douban.com/tag/{tag}?start={start}&type=T'

    def start_requests(self):
        # 先获取 Tags 列表和对应进度
        tags = douban_db.get_tags()
        if len(tags.keys()) == 0:
            tags_list = fetch_tags()
            tags = {key: 0 for key in tags_list}
            douban_db.update_tags(tags)
        # 开爬，轮流来
        MAX_OFFSET = 1000
        done = False
        while not done:
            done = True
            for tag in tags:
                tag_max = douban_db.get_tag_max(tag=tag)
                if tags[tag] > min(MAX_OFFSET, tag_max):
                    continue
                done = False
                if not douban_db.get_tag_finish(tag=tag, start=tags[tag]):
                    self.logger.info(f"fetching {tag} start={tags[tag]}")
                    yield Request(self.target_page_url.format(tag=tag, start=tags[tag]),
                                  # meta={"proxy": get_proxy().get('proxy')},
                                  callback=self.parse, errback=self.handle_errors)
                douban_db.set_tag_finish(tag=tag, start=tags[tag], finished=True)
                tags[tag] += 20
                douban_db.update_tags(tags)

        self.logger.info(f"DONE!")

    def handle_errors(self, failure):
        request = failure.request
        if failure.check(TCPTimedOutError, TimeoutError, ConnectionRefusedError):
            self.logger.error(f"{failure}, {dir(request)}")

    def parse(self, response) -> list:
        url = response.url
        url_info = urllib.parse.urlparse(url)
        tag = urllib.parse.unquote(url_info.path)[5:]
        # TODO: 1. 添加最末页码更新
        #       2. 请求失败的时候删除代理
        #       3. 请求失败删除代理之后再请求
        html = response.body
        if not isinstance(html, str):
            html = html.decode(errors='ignore')
        if '没有找到符合条件的图书' in html:
            return []
        soup = Soup(response.body, 'lxml')
        subject_list = soup.find('ul', class_='subject-list')

        paginator = soup.find("div", class_='paginator')
        max_page = int(paginator.find_all('a')[-2].get_text())
        if max_page > 50:
            max_page = 50
        self.logger.warning(f"tag: {tag}, max_page: {max_page}")
        douban_db.set_tag_max(tag=tag, max_start=max_page * 20)

        def parse_subject_item(subject_item) -> dict:
            book_item = {
                'title': my_strip(subject_item.find('h2').get_text()),
                'douban_url': subject_item.find('a').attrs.get('href'),
                'base_info': my_strip(subject_item.find('div', class_='pub').get_text()),
                'douban_id': int(subject_item.find('a').attrs.get('href').split('/')[-2]),
                'pricing': [my_strip(a.get_text()) for a in
                            subject_item.find('span', class_='buy-info').find_all('a')]
                if subject_item.find('span', class_='buy-info') is not None else []
            }
            try:
                book_item['rating_nums'] = float(my_strip(subject_item.find('span', class_='rating_nums').get_text()))
            except (AttributeError, ValueError) as e:
                self.logger.warning(f'rating_nums {e}')
                # traceback.print_exc()

            try:
                book_item['comment_number'] = int(
                    re.findall(r'\([0-9]*', my_strip(subject_item.find('span', class_='pl').get_text()))[0][1:]),
            except (AttributeError, ValueError) as e:
                self.logger.warning(f'comment_number {e}')
                # traceback.print_exc()

            try:
                book_item['description'] = my_strip(subject_item.find('p').get_text())
            except AttributeError as e:
                self.logger.warning(f'description {e}')
                # traceback.print_exc()

            item = DoubanItem()
            for key in book_item:
                item[key] = book_item[key]
            return item

        # page_items = [parse_subject_item(subject_item_) for subject_item_ in subject_list.find_all("li")]
        # return page_items
        for subject_item_ in subject_list.find_all("li"):
            try:
                yield parse_subject_item(subject_item_)
            except Exception as e:
                traceback.print_exc()
