package finder

import (
	"bookFinder/app/model/args"
	"bookFinder/app/service/bing"
	"bookFinder/app/service/limit"
	"bytes"
	"log"
	"net/http"
	"regexp"
)

func makeUpSearchWord(platform string, keyword string) string {
	return keyword + " 书 site:" + args.Sites[platform]
}

func parseBooks(url string, bookList map[string]int, errchan chan error) {
	client := http.Client{}
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("User-Agent", args.HeaderArgs.UserAgent)
	req.Header.Set("Cookie", args.HeaderArgs.Cookie)
	resp, err := client.Do(req)
	if err != nil {
		errchan <- err
		return
	}
	defer resp.Body.Close()
	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	paragraph := buf.String()
	reg := regexp.MustCompile("《.*?》")
	bookItems := reg.FindAllStringSubmatch(paragraph, -1)
	for _, book := range bookItems {
		//fmt.Println(book[0])
		bookList[book[0]]++
	}
	errchan <- nil
}

/**
 * 找书的接口方法
 * @param platform 平台关键字，比如"zhihu"
 * @param keyword 搜索关键词
 * @param blist 是一个map，用来快速记录【"书名"—计数】键值对
 * @param errchan 错误返回通道
 */
func FindBook(platform, keyword string, blist map[string]int, errchan chan error) {
	// 必应搜索结果，是一个字符串数组，每一项是一个URL
	bingResult, bingError := bing.BingSearch(makeUpSearchWord(platform, keyword), args.BingAPIToken)
	<-limit.Bing
	if bingError != nil {
		errchan <- bingError
		return
	}

	// 开新的协程
	visitWebsiteError := make(chan error)
	for _, link := range bingResult {
		go parseBooks(link, blist, visitWebsiteError)
	}
	for _, _ = range bingResult {
		visitErr := <-visitWebsiteError
		if visitErr != nil {
			log.Println("There's an error:", visitErr.Error())
		}
	}
	errchan <- nil
}
