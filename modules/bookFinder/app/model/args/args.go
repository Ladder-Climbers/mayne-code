package args

import "bookFinder/app/model/types"

var HeaderArgs types.WebArgs
var ServicePort int
var ServiceAPI string
var Sites map[string]string
var BingAPIToken string
var DoubPort int
var DoubAPI string
var BingLimit int
var DoubanLimit int
var RedundencyRatio float64

func init() {
	// 初始化站点 Map
	Sites = make(map[string]string)
}
