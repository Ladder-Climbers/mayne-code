import re

import requests
from bs4 import BeautifulSoup as Soup

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:93.0) Gecko/20100101 Firefox/93.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-User": "?1"
}


def get_tags() -> list:
    html = requests.get("https://book.douban.com/tag/?icn=index-nav", headers=headers).content
    soup = Soup(html, "html.parser")
    a_list = soup.find_all("a")
    tags = []
    for a in a_list:
        if not a.attrs.get("href", '').startswith('/tag/'):
            continue
        tags.append(a.get_text())
    return tags


def my_strip(s: str) -> str:
    removed_chars = ['\n', ' ', '\t']
    s = s.strip()
    for r in removed_chars:
        s = s.replace(r, '')
    return s


def get_tag_books(tag: str, start: int):
    html = requests.get(f"https://book.douban.com/tag/{tag}?start={start}&type=T", headers=headers).content
    soup = Soup(html, 'html.parser')
    subject_list = soup.find('ul', class_='subject-list')

    def parse_subject_item(subject_item):
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
        print(book_item)

    for subject_item_ in subject_list.find_all("li"):
        parse_subject_item(subject_item_)


if __name__ == '__main__':
    # print(get_tags())
    get_tag_books('小说', 20)
