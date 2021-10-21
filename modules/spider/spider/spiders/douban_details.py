import re
import traceback
import urllib

import requests
from bs4 import BeautifulSoup as Soup
import scrapy
from scrapy import Request

from twisted.internet.error import TimeoutError, TCPTimedOutError, ConnectionRefusedError

from spider.items import DoubanItem, DoubanDetailsItem
from spider.settings import DOUBAN_FAST, DOUBAN_PROXY
from spider.spiders import DOUBAN_COOKIE
from spider_utils.constants import Constants
from spider_utils.douban_database import douban_db
from spider_utils.proxies import get_proxy
from spider_utils.strings import my_strip


class DoubanDetailsSpider(scrapy.Spider):
    name = 'douban_details'
    allowed_domains = ['douban.com']
    target_page_url = 'https://book.douban.com/subject/{douban_id}/'

    def start_requests(self):
        # 获取所有的 douban_id
        douban_ids = douban_db.get_douban_ids()
        douban_id_cnt = douban_db.get_douban_id_cnt()
        douban_details_finished: set = douban_db.get_douban_details_finished()
        if douban_id_cnt < 0:
            douban_id_cnt = douban_ids[0]
            douban_db.set_douban_id_cnt(douban_id_cnt)
        try:
            douban_id_index = douban_ids.index(douban_id_cnt)
        except ValueError:
            self.logger.warning(f"Cannot find {douban_id_cnt} in douban_ids")
            douban_id_index = 0
        # 开爬，轮流来
        for i in range(douban_id_index, len(douban_ids)):
            douban_id_cnt = douban_ids[i]
            if douban_id_cnt in douban_details_finished:
                self.logger.debug(f"skip {douban_id_cnt}")
                continue
            self.logger.info(f"fetching {douban_id_cnt}")
            if DOUBAN_PROXY:
                proxy = get_proxy()
                yield Request(self.target_page_url.format(douban_id=douban_id_cnt),
                              meta={"proxy": f"http{'s' if proxy.get('https', False) else ''}://{proxy.get('proxy')}"},
                              cookies=DOUBAN_COOKIE,
                              callback=self.parse, errback=self.handle_errors)
            else:
                yield Request(self.target_page_url.format(douban_id=douban_id_cnt),
                              cookies=DOUBAN_COOKIE,
                              callback=self.parse, errback=self.handle_errors)
            # self.logger.info(f"finishing {douban_id_cnt}")
            douban_details_finished.add(douban_id_cnt)

        self.logger.info(f"DONE!")

    def handle_errors(self, failure):
        request = failure.request
        if failure.check(TCPTimedOutError, TimeoutError, ConnectionRefusedError):
            self.logger.error(f"{failure}, {dir(request)}")

    def parse(self, response) -> list:
        url = response.url
        self.logger.debug(f"Start parsing {url}")
        url_info = urllib.parse.urlparse(url)
        douban_id = int(url_info.path.split('/')[2])
        html = response.body
        if not isinstance(html, str):
            html = html.decode(errors='ignore')
        if len(html) == 0:
            self.logger.debug(f"got empty page {douban_id}")
            yield None
            return
        if '异常请求' in html:
            self.logger.debug(f"请求异常 {douban_id}")
            yield None
            return
        if '页面不存在' in html:
            self.logger.debug(f"页面不存在 {douban_id}")
            yield None
            return
        soup = Soup(response.body, 'html.parser')
        self.logger.info(f"title: {soup.title}")
        book_info = soup.find("div", id='info')
        if book_info is None:
            self.logger.debug(f"No #info {douban_id}")
            yield None
            return
        convert_map = {
            '作者': 'author',
            '出版社': 'publisher',
            '出版年': 'publish_time',
            '页数': 'page_count',
            '定价': 'pricing',
            '装帧': 'binding',
            '丛书': 'series',
            'ISBN': 'ISBN',
            '标题': 'title',
            '副标题': 'subtitle',
            '译者': 'translator',
            '出品方': 'producer'
        }
        info_lines = book_info.get_text().strip().replace(" ", "").replace(" ", "").replace("\n\n", "\n").splitlines()
        # print(info_lines)
        for i in range(len(info_lines)):
            if i == 0:
                continue
            if ':' not in info_lines[i]:
                p = i - 1
                while p >= 0 and (info_lines[p] is None or ':' not in info_lines[p]):
                    p -= 1
                if p != 0:
                    info_lines[p] += info_lines[i]
                    info_lines[i] = None
        info_lines = [line for line in info_lines if isinstance(line, str) and ':' in line]
        info_raw = {line.split(':')[0]: line.split(':')[-1] for line in info_lines}
        info = {convert_map.get(key, key): info_raw[key] for key in info_raw}
        details = info
        span_content = soup.find('span', text='内容简介')
        if span_content is not None:
            next_sibling = span_content.parent.next_sibling
            while next_sibling == '\n':
                next_sibling = next_sibling.next_sibling
            # print(next_sibling)
            if next_sibling.find('a', text="(展开全部)") is not None:
                target = next_sibling.find("span", attrs={"class": "all"})
            else:
                target = next_sibling.find("div", attrs={"class": "intro"})
            # print(target)
            if target is not None:
                content = target.get_text().replace("(展开全部)", "").strip()
                # print(content)
                details['description'] = content

        span_author = soup.find('span', text='作者简介')
        if span_author is not None:
            next_sibling = span_author.parent.next_sibling
            while next_sibling == '\n':
                next_sibling = next_sibling.next_sibling
            # print(next_sibling)
            if next_sibling.find('a', text="(展开全部)") is not None:
                target = next_sibling.find("span", attrs={"class": "all"})
            else:
                target = next_sibling.find("div", attrs={"class": "intro"})
            # print(target)
            if target is not None:
                content = target.get_text().replace("(展开全部)", "").strip()
                # print(content)
                details['description_author'] = content

        span_tags = soup.find('div', id='db-tags-section')
        if span_tags is not None:
            target_list = span_tags.find("div", attrs={"class": "indent"})
            if target_list is not None:
                tags_list = []
                for target in target_list:
                    try:
                        tags_list.append(str(target.get_text()).strip())
                    except AttributeError:
                        pass
                details['tags'] = tags_list

        div_comments = soup.find('div', id='comment-list-wrapper')
        comments_got_cid = set({})
        if div_comments is not None:
            comments_items = div_comments.find_all('li', class_='comment-item')
            details['comments'] = []
            for comment_item in comments_items:
                comment = {}
                comment_cid = int(comment_item.attrs.get('data-cid', 0))
                if comment_cid in comments_got_cid:
                    continue
                comment['cid'] = comment_cid
                comment_content = comment_item.find("p", class_="comment-content")
                if comment_content is not None:
                    comment['content'] = comment_content.get_text().strip().replace("\n", "")
                vote_count = comment_item.find("span", class_="vote-count")
                if vote_count is not None:
                    try:
                        comment['vote_count'] = int(vote_count.get_text().strip())
                    except ValueError:
                        pass
                comment_info_span = comment_item.find("span", class_="comment-info")
                if comment_info_span is not None:
                    comment_info = {}
                    comment_username = comment_info_span.find("a")
                    if comment_username is not None:
                        comment_info['username'] = comment_username.get_text().strip()
                    comment_time = comment_info_span.find("span", attrs={"class": "comment-time"})
                    if comment_time is not None:
                        comment_info['time'] = comment_time.get_text().strip()
                    comment_rating = comment_info_span.find("span", attrs={"class": "rating"})
                    if comment_rating is not None:
                        try:
                            comment_info['rating'] = int(
                                [cl for cl in comment_rating.attrs.get('class', "") if 'allstar' in cl][0].replace(
                                    'allstar',
                                    '')) / 50
                        except ValueError:
                            pass
                    comment['info'] = comment_info
                details['comments'].append(comment)

            # print(json.dumps(details, indent=2, sort_keys=True).encode('utf-8').decode('unicode_escape'))
        details_item = DoubanDetailsItem()
        for key in details:
            try:
                details_item[key] = details[key]
            except KeyError:
                if details_item.get('extras', None) is None:
                    details_item['extras'] = {}
                details_item['extras'][key] = details[key]
        yield details_item
        douban_db.set_details_finish(douban_id, finished=True)
        return None
