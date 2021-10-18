package boot

import (
	"bookFinder/app/model/args"
	"bookFinder/app/service/config"
	"bookFinder/app/service/limit"
	_ "bookFinder/app/service/limit"
	"log"
	"os"
)

func init() {
	log.Println("============[Mayne's Book Finder]============")
	log.Println("(C) 2020-2021 LadderClimbers. MIT License.")
	log.Println("Version Release Candidate 1")
	// 加载配置
	err := config.LoadConfig("./config/config.json")
	if err != nil {
		log.Println("Error(s) occurred while loading configuration file:", err)
		os.Exit(2)
	}
	limit.Bing = make(chan bool, args.BingLimit)
	limit.Douban = make(chan bool, args.DoubanLimit)
}
