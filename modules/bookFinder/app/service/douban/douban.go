package douban

import (
	"bookFinder/app/model/args"
	"bookFinder/app/model/types"
	"bookFinder/app/service/limit"
	"bytes"
	"net/http"
	"sort"
	"strconv"

	"github.com/gorilla/rpc/v2/json2"
)

func DoubanSearch(bookName string, reqID int, bookChannel chan types.DoubanAnswer) {
	url := "http://localhost:" + strconv.Itoa(args.DoubPort) + args.DoubAPI
	keyword := []string{bookName}

	message, err := json2.EncodeClientRequest("search", keyword)
	if err != nil {
		bookChannel <- types.DoubanAnswer{
			ReqID:      reqID,
			Error:      err,
			AnswerList: nil,
		}
		return
	}

	resp, err := http.Post(url, "application/json;charset=UTF-8", bytes.NewReader(message))
	<-limit.Douban
	if err != nil {
		bookChannel <- types.DoubanAnswer{
			ReqID:      reqID,
			Error:      err,
			AnswerList: nil,
		}
		return
	}
	defer resp.Body.Close()

	var books []types.Book
	err = json2.DecodeClientResponse(resp.Body, &books)

	if err != nil {
		bookChannel <- types.DoubanAnswer{
			ReqID:      reqID,
			Error:      err,
			AnswerList: nil,
		}
		return
	}

	sort.Slice(books, func(i, j int) bool {
		return getLevenshteinDistance(books[i].Title, bookName) < getLevenshteinDistance(books[j].Title, bookName)
	})

	bookChannel <- types.DoubanAnswer{
		ReqID:      reqID,
		Error:      nil,
		AnswerList: books,
	}
}

func intMin(args ...int) int {
	min := args[0]
	for _, arg := range args {
		if arg < min {
			min = arg
		}
	}
	return min
}

func getLevenshteinDistance(str1 string, str2 string) int {
	runeStr1 := []rune(str1)
	runeStr2 := []rune(str2)
	len1 := len(runeStr1)
	len2 := len(runeStr2)
	distance := make([][]int, len1+1)
	for i := range distance {
		distance[i] = make([]int, len2+1)
		distance[i][0] = i
	}
	for i := range distance[0] {
		distance[0][i] = i
	}
	for i := 1; i <= len1; i++ {
		for j := 1; j <= len2; j++ {
			if runeStr1[i-1] == runeStr2[j-1] {
				distance[i][j] = intMin(distance[i-1][j]+1, distance[i][j-1]+1, distance[i-1][j-1])
			} else {
				distance[i][j] = intMin(distance[i-1][j]+1, distance[i][j-1]+1, distance[i-1][j-1]+1)
			}
		}
	}
	return distance[len1][len2]
}
