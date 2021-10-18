# Mayne BookFinder

Mayne BookFinder Release Candidate 1 (13/Oct/2021)

## API 基本信息

- 监听地址：`http://localhost:9091/rpc/v1/bookfinder`
- 报文格式：JSON-RPC 2.0

## 调用方法

- 方法名称：`BookFinder.FindBook()`
- 参数：
 - `keyword`：关键词，例如“C 语言”
 - `count`：期望返回几本书的信息。特殊情况下可能达不到此数量

## 返回数据

若出错，会返回 JSON-RPC 格式的错误信息。

否则返回如下 JSON：

- `books`：一个列表，内容为书籍信息：
 - `ranking`：排名，表示这本书在推荐列表中排第几
 - `presence_count`：出现次数，表示这边书在所有搜索网页中出现多少次。可以作为一个推荐指标（用触发函数转换一下变成百分制打分之类）
 - `id`：豆瓣图书 ID；
 - 剩下的不用解释太多了
- `count`：实际返回图书的数量。一般来说就是之前索取的图书数量；但是可能会有出入
- `time_used`：本次搜索用时，单位 ms

