package douban

import (
	"bookFinder/app/model/args"
	"bookFinder/app/model/types"
	"bytes"
	"github.com/gorilla/rpc/v2/json2"
	"log"
	"net/http"
	"strconv"
)

func DoubanSearch(bookName string) types.Book {
	url := "http://localhost:" + strconv.Itoa(args.DoubPort) + args.DoubAPI
	keyword := []string{ bookName }

	message, err := json2.EncodeClientRequest("search", keyword)
	if err != nil {
		log.Fatalln("Error(s) occurred while encoding JSON:", err)
	}

	resp, err := http.Post(url, "application/json;charset=UTF-8", bytes.NewReader(message))
	defer resp.Body.Close()
	if err != nil {
		log.Fatalln("Error(s) occurred while searching douban:", err)
	}

	var book []types.Book
	err = json2.DecodeClientResponse(resp.Body, &book)
	if err != nil {
		log.Fatalln("Error(s) occurred while decoding JSON:", err)
	}

	for _, b := range(book) {
		if (b.Rating.StarCount != 0) {
			return b
		}
	}
	return types.Book{}
}
