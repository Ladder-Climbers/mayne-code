package api

import (
	"bookFinder/app/model/args"
	"bookFinder/app/model/types"
	"bookFinder/app/service/douban"
	"bookFinder/app/service/finder"
	"bookFinder/app/service/limit"
	"net/http"
	"sort"
	"time"
)

// 对外调用的类型
type BookFinder struct{}

/**
 * 对外方法，找书清洗一条龙服务
 * @param r Gorilla必须的参数，这里没有用，只是占个位置
 * @param params 传入的JSON结构体，记录关键词信息
 * @param rets 传回的JSON结构体，记录书的信息
 * @return 错误情况
 */
func (bf *BookFinder) FindBook(r *http.Request, params *types.ReqMessage, rets *types.RetMessage) error {

	// 开始计时
	startTime := time.Now()

	// 建立一个通道，接收错误返回
	errchan := make(chan error)

	// blist 是一个 string-int 的 map，记录信息为“书—出现次数”
	blist := make(map[string]int)

	// 逐平台找书
	for platform := range args.Sites {
		limit.Bing <- true
		go finder.FindBook(platform, params.Keyword, blist, errchan)
	}

	// 接受错误信息
	for i := 0; i < len(args.Sites); i++ {
		err := <-errchan
		if err != nil {
			return err
		}
	}

	// 把 blist（map）倒入一个数组 rlist
	type nameCount struct {
		bookName  string
		bookCount int
	}
	var rlist []nameCount
	for name, count := range blist {
		rlist = append(rlist, nameCount{
			bookName:  name,
			bookCount: count,
		})
	}
	// 按提及次数排序
	sort.Slice(rlist, func(i, j int) bool { return rlist[i].bookCount > rlist[j].bookCount })

	// log.Println(rlist)

	// 准备数据清洗
	// 开一个通道，用来接已经清洗过的数据
	booksChannel := make(chan types.Book)
	var resCount int
	if len(rlist) > params.Count {
		resCount = params.Count
	} else {
		resCount = len(rlist)
	}
	for i := 0; i < resCount; i++ {
		// 这里 bookName 限位，是因为书名号得去掉（用了正则）
		limit.Douban <- true
		go douban.DoubanSearch(rlist[i].bookName[3:len(rlist[i].bookName)-3], rlist[i].bookCount,
			i+1, booksChannel)
	}

	// 将通道倒到一个数组里面。
	var booksList []types.Book

	for i := 0; i < resCount; i++ {
		book := <-booksChannel
		if book.Error != nil {
			return book.Error
		} else {
			booksList = append(booksList, book)
		}
	}

	// 排序。因为使用了通道，顺序不再是原来的顺序了
	sort.Slice(booksList, func(i, j int) bool { return booksList[i].Ranking < booksList[j].Ranking })

	/** TODO: 去重 */

	// 停止计时
	elapsedTime := time.Since(startTime)

	if len(booksList) >= params.Count {
		*rets = types.RetMessage{
			Books:    booksList,
			TimeUsed: elapsedTime.Milliseconds(),
			Count:    params.Count,
		}
	} else {
		*rets = types.RetMessage{
			Books:    booksList,
			TimeUsed: elapsedTime.Milliseconds(),
			Count:    len(booksList),
		}
	}

	return nil
}
