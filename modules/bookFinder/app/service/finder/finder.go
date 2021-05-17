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

// 旧的实现必应搜索的方式。已经废弃
/*func getBingItems(url string) []string {
	client := http.Client{}
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("User-Agent", args.HeaderArgs.UserAgent)
	req.Header.Set("Cookie", args.HeaderArgs.Cookie)
	resp, err := client.Do(req)
	if err != nil {
		log.Fatal("Error(s) occurred while making requests.")
	}
	defer resp.Body.Close()
	var listURL []string
	document, _ := goquery.NewDocumentFromReader(resp.Body)
	document.Find("li.b_algo").Each(func(_ int, selection *goquery.Selection) {
		s := selection.Find("a").First()
		link, _ := s.Attr("href")
		// log.Printf("Page `%s`: %s\n", s.Text(), link)
		listURL = append(listURL, link)
	})
	return listURL
}*/

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

func parseBooks(paragraph string, bookList map[string]int) {
	reg := regexp.MustCompile("《.*?》")
	bookItems := reg.FindAllStringSubmatch(paragraph, -1)
	for _, book := range bookItems {
		//fmt.Println(book[0])
		bookList[book[0]]++
	}
}

func FindBook(platform, keyword string, blist map[string]int, group *sync.WaitGroup) {
	defer group.Done()
	for _, link := range bing.BingSearch(makeUpSearchWord(platform, keyword), args.BingAPIToken) {
		parseBooks(visitLink(link), blist)
	}
}
