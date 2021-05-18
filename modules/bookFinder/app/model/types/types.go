package types

type WebArgs struct {
	UserAgent string
	Cookie    string
}

type Book struct {
	Ranking  int    `json:"-"`
	Id       int    `json:"id"`
	Title    string `json:"title"`
	URL      string `json:"url"`
	CoverURL string `json:"cover_url"`
	Abstract string `json:"abstract"`
	Rating   struct {
		StarCount float32 `json:"star_count"`
		Value     float32 `json:"value"`
	} `json:"rating"`
}

type ReqMessage struct {
	Type    string `json:"type"`
	Cmd     int    `json:"cmd"`
	Request string `json:"request"`
	Count   int    `json:"count"`
}

type RetMessage struct {
	Type  string `json:"type"`
	Books []Book `json:"books"`
}
