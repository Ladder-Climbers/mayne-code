package main

import (
	"bookFinder/app/api"
	"bookFinder/app/model/args"
	_ "bookFinder/boot"
	"github.com/gorilla/mux"
	"github.com/gorilla/rpc"
	"github.com/gorilla/rpc/json"
	"log"
	"net/http"
	"strconv"
)

func main() {
	log.Println("============[Mayne's Book Finder]============")
	log.Println("(C) 2020-2021 LadderClimbers. MIT License.")
	s := rpc.NewServer()
	s.RegisterCodec(json.NewCodec(), "application/json")
	s.RegisterCodec(json.NewCodec(), "application/json;charset=UTF-8")
	bf := new(api.BookFinder)
	err := s.RegisterService(bf, "")
	if err != nil {
		log.Fatal("Error(s) occurred while registering service.")
	}
	r := mux.NewRouter()
	r.Handle(args.ServiceAPI, s)
	err = http.ListenAndServe(":" + strconv.Itoa(args.ServicePort), r)
	if err != nil {
		log.Fatal("Error(s) occurred while starting server.")
	}
}
