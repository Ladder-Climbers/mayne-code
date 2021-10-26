package types

type WebArgs struct {
	UserAgent string
	Cookie    string
}

type Book struct {
	/* Ranking int `json:"ranking"`
	MatchingIndex int `json:"matching_index"` */
	ID       int    `json:"id"`
	Title    string `json:"title"`
	URL      string `json:"url"`
	CoverURL string `json:"cover_url"`
	Abstract string `json:"abstract"`
	Rating   struct {
		StarCount float32 `json:"star_count"`
		Value     float32 `json:"value"`
	} `json:"rating"`
}

type GetBookTitlesBook struct {
	Title         string `json:"title"`
	PresenceCount int    `json:"presence_count"`
	Ranking       int    `json:"ranking"`
}

type GetBookTitlesReq struct {
	Keyword string `json:"keyword"`
	Count   int    `json:"count"`
}

type GetBookTitlesRet struct {
	Books    []GetBookTitlesBook `json:"books"`
	Count    int                 `json:"count"`
	TimeUsed int64               `json:"time_used"`
}

type GetDoubanItemsReq struct {
	Books []struct {
		Title string `json:"title"`
		ReqID int    `json:"req_id"`
	} `json:"books"`
}

type GetDoubanItemsRet struct {
	Books    []DoubanAnswer `json:"books"`
	TimeUsed int64          `json:"time_used"`
}

type DoubanAnswer struct {
	ReqID      int    `json:"req_id"`
	Error      error  `json:"error"`
	AnswerList []Book `json:"answer_list"`
}
