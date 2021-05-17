package api

import (
	"bookFinder/app/model/args"
	"bookFinder/app/model/types"
	"bookFinder/app/service/douban"
	"bookFinder/app/service/finder"
	"errors"
	"net/http"
	"sort"
	"sync"
)

type BookFinder struct {}

func (bf *BookFinder) FindBook(r *http.Request, params *types.ReqMessage, rets *types.RetMessage) error {
	if params.Type != "request" {
		return errors.New("invalid message type")
	}
	var wg sync.WaitGroup
	wg.Add(len(args.Sites))
	// blist 是一个 map，存储 书名—出现次数 键值对
	blist := make(map[string]int)

	for platform, _ := range(args.Sites) {
		go finder.FindBook(platform, params.Request, blist, &wg)
	}
	wg.Wait()

	type nameCount struct {
		bookName string
		bookCount int
	}
	var rlist []nameCount
	for name, count := range blist {
		rlist = append(rlist, nameCount{
			bookName:  name,
			bookCount: count,
		})
	}

	sort.Slice(rlist, func(i, j int) bool { return rlist[i].bookCount > rlist[j].bookCount })

	var bookList []types.Book
	i := 0
	for _, _ = range rlist {
		if i == params.Count {
			break
		}
		bookList = append(bookList, types.Book{Title: rlist[i].bookName[3:len(rlist[i].bookName) - 3]})
		bookList[i] = douban.DoubanSearch(bookList[i].Title)
		i++
	}
	*rets = types.RetMessage{
		Type:  "result",
		Books: bookList,
	}
	return nil
}