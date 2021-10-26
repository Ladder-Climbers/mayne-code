# Mayne BookFinder

Mayne BookFinder Release Candidate 2 (19/Oct/2021)

## API 基本信息

- 监听地址：`http://localhost:9091/rpc/v1/bookfinder`
- 报文格式：JSON-RPC 2.0

## API 调用方法

### `GetBookTitles` 方法

此方法用于在指定的互联网平台上，搜寻含有关键词的文章中提及次数较多的书名。

#### 方法名称

`BookFinder.GetBookTitles`

#### 传入参数

- `keyword` 字段：关键词，例如“C语言”；
- `count` 字段：希望返回的结果数量。当实际搜索到的结果大于此数量时，将返回提及次数排名靠前的 `count` 项；当结果数较少时，将返回所有的结果。

#### 返回值

- `books` 字段：一个数组，记录每本书的书名和提及次数。这个数组是按照提及次数从高到低排列的。
    - `title` 字段：这本书的书名；
    - `presence_count` 字段：这本书在所有搜索结果中的提及次数；
    - `ranking` 字段：这本书在所有搜索结果中的排名；
- `count` 字段：实际返回的结果数量；
- `time_used` 字段：执行这次搜索所用的时间（毫秒）。

#### 使用例

传入参数为 `Java`。返回结果如下：

```json
{
  "books": [
    {
      "title": "Java编程思想", // 第一名
      "presence_count": 35,    // 出现 35 次
      "ranking": 1
    },
    {
      "title":"Head First Java", // 第二名
      "presence_count":30,       // 出现 30 次
      "ranking":2
    },
    {}{} // 后续结果省略
  ],
  "count":12,                    // 共返回 12 个结果
  "time_used":1598               // 用时 1.6s
}
```

### `GetDoubanItems` 方法

此方法用于在豆瓣图书网上（批量）搜索图书的数据。由于使用了协程，因此可以同时传入多个书名，程序将建立协程进行并行检索。

#### 方法名称

`BookFinder.GetDoubanItems`

#### 传入参数

- `books` 字段：一个数组，记录需要查询的各本书信息。每一项包含如下字段：
    - `title` 字段：书籍标题。
    - `req_id` 字段：这本书的请求 ID。由于采用了并行搜索，返回结果的顺序并不是传入书籍的顺序，因此每本传入的书都需要一个唯一的序号（ID）。
    
#### 返回值

- `books` 字段：一个数组，记录每本书的检索信息。每一项包含如下字段：
    - `req_id`: 这本书的请求 ID。
    - `error`: 这本书的搜索情况。如果搜索的时候发生错误，这一项将不是 `null`。
    - `answer_list`: 搜索结果的列表。每本书豆瓣都会返回 10 个左右的搜索结果。一般来说，第一项即是综合匹配程度最高的。这个数组每一项都是一个 `Book` 类型，具体的作用请看下面的使用例。
- `time_used` 字段：执行这次搜索所用的时间（毫秒）。

#### 使用例

传入参数如下：

```json
{
  "books": [
    {
      "title": "Effective C++",
      "req_id": 1
    },
    {
      "title": "Linux就该这么学",
      "req_id": 2
    }
  ]
}
```
    
返回结果如下：

```json
{
  "books": [
    {
      "req_id": 2, // 第二个搜索关键词，即“Linux 就该这么学”
      "error": null, // 没有发生错误
      "answer_list": [
        {
          // 第一个搜索结果，一般来说就是最匹配的。
          "id": 27198046,
          "title": "Linux就该这么学 : 必读的Linux系统与红帽认证自学书籍",
          "url": "https://book.douban.com/subject/27198046/",
          "cover_url": "https://img1.doubanio.com/view/subject/m/public/s29938039.jpg",
          "abstract": "刘遄 / 人民邮电出版社 / 2017-11-1 / 79",
          "rating": {
            "star_count": 3,
            "value": 5.6
          }
        },
        {
          // 第二个搜索结果
          "id": 35592914,
          "title": "Linux就该这么学（第2版）",
          "url": "https://book.douban.com/subject/35592914/",
          "cover_url": "https://img1.doubanio.com/view/subject/m/public/s34016388.jpg",
          "abstract": "刘遄 / 人民邮电出版社 / 2021-9 / 99.90元",
          "rating": {
            "star_count": 0,
            "value": 0
          }
        }
        // 省略后续结果……
      ]
    },
    {
      "req_id":1, // 第一个搜索关键词，即“Effective C++”
      "error":null, // 没有发生错误
      "answer_list":[
        {
          "id":5387403,
          "title":"Effective C++ : 改善程序与设计的55个具体做法",
          "url":"https://book.douban.com/subject/5387403/",
          "cover_url":"https://img2.doubanio.com/view/subject/m/public/s4647091.jpg",
          "abstract":"[美] Scott Meyers / 侯捷 / 电子工业出版社 / 2011-1-1 / 65.00元",
          "rating":{
            "star_count":5,
            "value":9.5
          }
        }
        // 后续结果省略……
      ]
    }
  ],
  "time_used":1120 // 总用时：1.1s
}
```

上述使用例中，之所以 `req_id` 为 2 的条目靠前，是因为这两个条目的搜索是并行完成的，返回结果的顺序并不是传入的顺序。