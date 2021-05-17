package api

import (
	"bookFinder/app/model/types"
	"bookFinder/app/service/finder"
	"errors"
	"net/http"
	"sort"
	"sync"
)

type BookFinder struct {}

func (bf *BookFinder) FindBook(r *http.Request, args *types.ReqMessage, result *types.RetMessage) error {
	if args.Type != "request" {
		return errors.New("invalid message type")
	}
	var wg sync.WaitGroup
	wg.Add(3)
	// blist 是一个 map，存储 书名—出现次数 键值对
	blist := make(map[string]int)

	go finder.FindBook("zhihu", args.Request, blist, &wg)
	go finder.FindBook("csdn", args.Request, blist, &wg)
	go finder.FindBook("jianshu", args.Request, blist, &wg)
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

	// 排序
	sort.Slice(rlist, func(i, j int) bool { return rlist[i].bookCount > rlist[j].bookCount })

	var bookList []types.Book
	i := 0
	for _, _ = range rlist {
		if i == args.Count {
			break
		}
		bookList = append(bookList, types.Book{
			Name:      rlist[i].bookName[3:len(rlist[i].bookName) - 3],
			Author:    nil,
		})
		i++
	}
	*result = types.RetMessage{
		Type:  "result",
		Books: bookList,
	}
	return nil
}