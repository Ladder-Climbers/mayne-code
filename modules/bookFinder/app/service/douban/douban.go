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

func DoubanSearch(bookName string, ranking int, booksChannel chan types.Book) {
	log.Println(bookName)
	url := "http://localhost:" + strconv.Itoa(args.DoubPort) + args.DoubAPI
	keyword := []string{bookName}

	message, err := json2.EncodeClientRequest("search", keyword)
	if err != nil {
		log.Fatalln("Error(s) occurred while encoding JSON:", err)
	}

	resp, err := http.Post(url, "application/json;charset=UTF-8", bytes.NewReader(message))
	defer resp.Body.Close()
	if err != nil {
		log.Fatalln("Error(s) occurred while searching douban:", err)
	}

	var books []types.Book
	err = json2.DecodeClientResponse(resp.Body, &books)
	if err != nil {
		log.Fatalln("Error(s) occurred while decoding JSON:", err)
	}

	var simBook types.Book
	minDistance := 32767
	for _, b := range books {
		nowDistance := getLevenshteinDistance(b.Title, bookName)
		if nowDistance < minDistance {
			simBook = b
			minDistance = nowDistance
		}
	}
	simBook.Ranking = ranking
	booksChannel <- simBook
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
	for i, _ := range distance {
		distance[i] = make([]int, len2+1)
		distance[i][0] = i
	}
	for i, _ := range distance[0] {
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
