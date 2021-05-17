package types

type WebArgs struct {
	UserAgent string
	Cookie    string
}

type Book struct {
	Name      string `json:"name"`
	Author    []string `json:"author"`
	Publisher string `json:"publisher"`
	ISBN      string `json:"isbn"`
	CoverURL  string `json:"cover_url"`
	DoubanURL string `json:"douban_url"`
}

type ReqMessage struct {
	Type string `json:"type"`
	Cmd int `json:"cmd"`
	Request string `json:"request"`
	Count int `json:"count"`
}

type RetMessage struct {
	Type string `json:"type"`
	Books []Book `json:"books"`
}