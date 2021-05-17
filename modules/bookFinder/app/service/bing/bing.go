package bing

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

// Bing API 返回 JSON 对应的结构体
type BingAnswer struct {
	Type         string `json:"_type"`
	QueryContext struct {
		OriginalQuery string `json:"originalQuery"`
	} `json:"queryContext"`
	WebPages struct {
		WebSearchURL          string `json:"webSearchUrl"`
		TotalEstimatedMatches int    `json:"totalEstimatedMatches"`
		Value                 []struct {
			ID               string    `json:"id"`
			Name             string    `json:"name"`
			URL              string    `json:"url"`
			IsFamilyFriendly bool      `json:"isFamilyFriendly"`
			DisplayURL       string    `json:"displayUrl"`
			Snippet          string    `json:"snippet"`
			DateLastCrawled  time.Time `json:"dateLastCrawled"`
			SearchTags       []struct {
				Name    string `json:"name"`
				Content string `json:"content"`
			} `json:"searchTags,omitempty"`
			About []struct {
				Name string `json:"name"`
			} `json:"about,omitempty"`
		} `json:"value"`
	} `json:"webPages"`
	RelatedSearches struct {
		ID    string `json:"id"`
		Value []struct {
			Text         string `json:"text"`
			DisplayText  string `json:"displayText"`
			WebSearchURL string `json:"webSearchUrl"`
		} `json:"value"`
	} `json:"relatedSearches"`
	RankingResponse struct {
		Mainline struct {
			Items []struct {
				AnswerType  string `json:"answerType"`
				ResultIndex int    `json:"resultIndex"`
				Value       struct {
					ID string `json:"id"`
				} `json:"value"`
			} `json:"items"`
		} `json:"mainline"`
		Sidebar struct {
			Items []struct {
				AnswerType string `json:"answerType"`
				Value      struct {
					ID string `json:"id"`
				} `json:"value"`
			} `json:"items"`
		} `json:"sidebar"`
	} `json:"rankingResponse"`
}

func BingSearch(searchTerm string, token string) []string {
	// Bing API URL
	const endpoint = "https://api.bing.microsoft.com/v7.0/search"
	req, err := http.NewRequest("GET", endpoint, nil)
	if err != nil {
		log.Fatalln("Error(s) occurred while processing request:", err)
	}
	param := req.URL.Query()
	param.Add("q", searchTerm)
	param.Add("count", "8")
	param.Add("cc", "CN")
	param.Add("setLang", "zh-CN")
	req.URL.RawQuery = param.Encode()
	req.Header.Add("Ocp-Apim-Subscription-Key", token)
	client := new(http.Client)
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalln("Error(s) occurred while making the request:", err)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln("Error(s) occurred while reading the response:", err)
	}
	ans := new(BingAnswer)
	err = json.Unmarshal(body, &ans)
	if err != nil {
		log.Println("Error(s) occurred while unmarshalling the JSON:", err)
	}
	var urlList []string
	for _, result := range ans.WebPages.Value {
		urlList = append(urlList, result.URL)
	}
	return urlList
}