import json

import requests
from bs4 import BeautifulSoup as Soup


def test_details():
    # url = "https://book.douban.com/subject/4913064/"
    # url = "https://book.douban.com/subject/35252459/"
    url = "https://book.douban.com/subject/1000647/"
    resp = requests.get(url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:93.0) Gecko/20100101 Firefox/93.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Cache-Control": "max-age=0",
        "Cookie": """bid=nvSOKb3e_kY; _pk_id.100001.3ac3=e2d5b8eca75bca93.1621432056.15.1634642691.1634626483.; __utma=30149280.2076579599.1621432056.1634625369.1634642692.23; __utmz=30149280.1634550518.15.13.utmcsr=cnblogs.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __utma=81379588.766923198.1621432056.1634626277.1634642692.15; __utmz=81379588.1634626277.14.8.utmcsr=cn.bing.com|utmccn=(referral)|utmcmd=referral|utmcct=/; viewed="1000647_35541390_1000001_35252459_35378783_1043815_1200840_4913064_26261735_30348068"; douban-f…IrjPG2dzOaZVU9YKWwMV; ct=y; push_noty_num=0; push_doumail_num=0; __utmv=30149280.23826; _ga_RXNMP372GL=GS1.1.1634613031.1.0.1634613033.58; _ga=GA1.2.2128100270.1634613032; ap_v=0,6.0; gr_session_id_22c937bbd8ebd703f2d8e9445f7dfd03=a0853268-d85f-4a95-90d5-70006915ab52; gr_cs1_816e1a27-0db8-472b-bedd-a0ce47a62b39=user_id%3A0; dbcl2="238268017:3kJuTVIhGR8"; ck=vPPv; gr_session_id_22c937bbd8ebd703f2d8e9445f7dfd03_a0853268-d85f-4a95-90d5-70006915ab52=true; gr_cs1_a0853268-d85f-4a95-90d5-70006915ab52=user_id%3A1""".encode('utf8').decode('latin-1', errors='ignore')
    })
    soup = Soup(resp.content, 'html.parser')
    print(soup.prettify())
    book_info = soup.find("div", id='info')
    convert_map = {
        '作者': 'author',
        '出版社': 'publisher',
        '出版年': 'publish_time',
        '页数': 'page_count',
        '定价': 'pricing',
        '装帧': 'binding',
        '丛书': 'series',
        'ISBN': 'ISBN'
    }
    info_lines = book_info.get_text().strip().replace(" ", "").replace(" ", "").replace("\n\n", "\n").splitlines()
    print(info_lines)
    for i in range(len(info_lines)):
        if i == 0:
            continue
        if ':' not in info_lines[i]:
            p = i - 1
            while p >= 0 and ':' not in info_lines[p]:
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
                            [cl for cl in comment_rating.attrs.get('class', "") if 'allstar' in cl][0].replace('allstar',
                                                                                                               '')) / 50
                    except ValueError:
                        pass
                comment['info'] = comment_info
            details['comments'].append(comment)

        print(json.dumps(details, indent=2, sort_keys=True).encode('utf-8').decode('unicode_escape'))


if __name__ == '__main__':
    test_details()
