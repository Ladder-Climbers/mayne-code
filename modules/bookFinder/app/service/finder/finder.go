package finder

import (
	"bookFinder/app/model/args"
	"bookFinder/app/service/bing"
	"bytes"
	"log"
	"net/http"
	"regexp"
	"sync"
)

func makeUpSearchWord(platform string, keyword string) string {
	return keyword + " 书 site:" + args.Sites[platform]
}

func visitLink(url string) string {
	client := http.Client{}
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("User-Agent", args.HeaderArgs.UserAgent)
	req.Header.Set("Cookie", args.HeaderArgs.Cookie)
	resp, err := client.Do(req)
	if err != nil {
		log.Println("Error(s) occurred while making requests:", err)
		return ""
	}
	defer resp.Body.Close()
	buf := new(bytes.Buffer)
	buf.ReadFrom(resp.Body)
	return buf.String()
}

func parseBooks(paragraph string, bookList map[string]int, group *sync.WaitGroup) {
	defer group.Done()
	reg := regexp.MustCompile("《.*?》")
	bookItems := reg.FindAllStringSubmatch(paragraph, -1)
	for _, book := range bookItems {
		//fmt.Println(book[0])
		bookList[book[0]]++
	}
}

func FindBook(platform, keyword string, blist map[string]int, group *sync.WaitGroup) {
	defer group.Done()
	bingResult := bing.BingSearch(makeUpSearchWord(platform, keyword), args.BingAPIToken)
	var wg sync.WaitGroup
	wg.Add(len(bingResult))
	for _, link := range bingResult {
		go parseBooks(visitLink(link), blist, &wg)
	}
	wg.Wait()
}
