package main

import (
	"bookFinder/app/model/args"
	_ "bookFinder/boot"
	"bookFinder/router"
	"log"
	"net/http"
	"os"
	"strconv"
)

func main() {
	err := http.ListenAndServe(":"+strconv.Itoa(args.ServicePort), router.Router)
	if err != nil {
		log.Println("Error(s) occurred while running server.")
		os.Exit(1)
	}
}
