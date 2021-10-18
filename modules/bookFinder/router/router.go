package router

import (
	"bookFinder/app/api"
	"bookFinder/app/model/args"
	"github.com/gorilla/mux"
	"github.com/gorilla/rpc/v2"
	"github.com/gorilla/rpc/v2/json2"
	"log"
	"os"
)

var Router *mux.Router

func init() {
	s := rpc.NewServer()
	s.RegisterCodec(json2.NewCodec(), "application/json")
	s.RegisterCodec(json2.NewCodec(), "application/json;charset=UTF-8")
	bf := new(api.BookFinder)
	err := s.RegisterService(bf, "")
	if err != nil {
		log.Println("Error(s) occurred while registering service.")
		os.Exit(1)
	}
	Router = mux.NewRouter()
	Router.Handle(args.ServiceAPI, s)
}
