from data.config import Constants
import requests
from bs4 import BeautifulSoup as Soup


class DoubanTop:
    URL = "https://book.douban.com/top250?start=%s"

    def __init__(self, cookies: str = ''):
        self.cookies = cookies
        self.cache = None

    def get_page(self, page: int = 0) -> int:
        if self.cache is not None:
            return self.cache
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0"
        }
        resp = requests.get(url=self.URL % (page * Constants.FIND_LIMIT), headers=headers)
        soup = Soup(resp.text, 'html.parser')
        items = soup.find_all("tr", class_="item")
        images = soup.find_all('img', width="90")
        titles = soup.find_all("div", class_="pl2")
        quotes = soup.find_all("p", class_="quote")
        abstracts = soup.find_all("p", class_="pl")
        rating = soup.find_all("span", class_="rating_nums")
        stars = soup.find_all("div", class_="star")
        comments = soup.find_all("span", class_="pl")
        length = len(items)
        result = []
        for k in range(length):
            book = {
                'cover_url': images[k].attrs.get("src"),
                'title': titles[k].find("a").attrs.get('title'),
                'id': titles[k].find("a").attrs.get('href').split("/")[-2],
                'abstract': abstracts[k].get_text(),
                'rating': {
                    'star_count': float(stars[k].find("span").attrs.get("class")[0][len("allstart"):]),
                    'value': float(rating[k].get_text())
                },
                'url': titles[k].find("a").attrs.get('href'),
                'quote': ''.join(quotes[k].get_text().split('\n')),
                'comment_num': int(comments[k].get_text()[22:-21])
            }
            # print(book)
            result.append(book)
        # print(result)
        self.cache = result
        return result


if __name__ == '__main__':
    t = DoubanTop()
    t.get_page()
