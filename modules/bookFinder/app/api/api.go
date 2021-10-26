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

// 获取关联书名
func (bf *BookFinder) GetBookTitles(r *http.Request, params *types.GetBookTitlesReq, rets *types.GetBookTitlesRet) error {

	// 开始计时
	startTime := time.Now()
	// 建立一个通道，接收错误返回
	errchan := make(chan error)
	// bookList 是一个 string-int 的 map，记录信息为“书—出现次数”
	bookList := make(map[string]int)

	// 逐平台找书
	for platform := range args.Sites {
		limit.Bing <- true
		go finder.FindBook(platform, params.Keyword, bookList, errchan)
	}
	// 取回错误信息
	for i := 0; i < len(args.Sites); i++ {
		err := <-errchan
		if err != nil {
			return err
		}
	}

	// 把 bookList（map）倒入一个数组 rlist
	var returnList []types.GetBookTitlesBook
	for name, count := range bookList {
		returnList = append(returnList, types.GetBookTitlesBook{name[3 : len(name)-3], count, 0})
	}
	// 按提及次数排序
	sort.Slice(returnList, func(i, j int) bool { return returnList[i].PresenceCount > returnList[j].PresenceCount })

	elapsedTime := time.Since(startTime)

	// 准备数据返回
	if len(returnList) < params.Count {
		rets.Count = len(returnList)
		rets.TimeUsed = elapsedTime.Milliseconds()
		for i := 1; i <= rets.Count; i++ {
			returnList[i-1].Ranking = i
		}
		rets.Books = returnList
	} else {
		rets.Count = params.Count
		rets.TimeUsed = elapsedTime.Milliseconds()
		for i := 1; i <= rets.Count; i++ {
			returnList[i-1].Ranking = i
		}
		rets.Books = returnList[0:rets.Count]
	}
	return nil
}

func (bf *BookFinder) GetDoubanItems(r *http.Request, params *types.GetDoubanItemsReq, rets *types.GetDoubanItemsRet) error {
	startTime := time.Now()

	booksChannel := make(chan types.DoubanAnswer)
	for _, singleRequest := range params.Books {
		limit.Douban <- true
		go douban.DoubanSearch(singleRequest.Title, singleRequest.ReqID, booksChannel)
	}

	for i := 0; i < len(params.Books); i++ {
		rets.Books = append(rets.Books, <-booksChannel)
	}

	elapsedTime := time.Since(startTime)
	rets.TimeUsed = elapsedTime.Milliseconds()

	return nil
}
