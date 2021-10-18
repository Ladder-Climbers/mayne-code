package config

import (
	"bookFinder/app/model/args"
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
)

type ConfigType struct {
	Header struct {
		UserAgent string `json:"user_agent"`
		Cookie    string `json:"cookie"`
	} `json:"header"`
	ServicePort  int    `json:"service_port"`
	ServiceAPI   string `json:"service_api"`
	DoubPort     int    `json:"doub_port"`
	DoubAPI      string `json:"doub_api"`
	BingAPIToken string `json:"bing_api_token"`
	BingLimit    int    `json:"bing_limit"`
	DoubanLimit  int    `json:"douban_limit"`
	Sites        []struct {
		SiteName   string `json:"site_name"`
		SiteDomain string `json:"site_domain"`
	} `json:"sites"`
	RedundencyRatio float64 `json:"redundency_ratio"`
}

func LoadConfig(configFileName string) error {
	log.Printf("Loading configuration from %s...\n", configFileName)
	configFile, err := ioutil.ReadFile(configFileName)
	if err != nil {
		return errors.New("unable to open the configuration file")
	}

	var config ConfigType
	err = json.Unmarshal(configFile, &config)
	if err != nil {
		return errors.New("unable to unmarshall the config file")
	}

	args.ServicePort = config.ServicePort
	args.ServiceAPI = config.ServiceAPI
	args.DoubPort = config.DoubPort
	args.DoubAPI = config.DoubAPI

	args.HeaderArgs.Cookie = config.Header.Cookie
	args.HeaderArgs.UserAgent = config.Header.UserAgent

	args.BingAPIToken = config.BingAPIToken

	args.BingLimit = config.BingLimit
	args.DoubanLimit = config.DoubanLimit

	args.RedundencyRatio = config.RedundencyRatio

	for _, s := range config.Sites {
		args.Sites[s.SiteName] = s.SiteDomain
	}

	log.Printf("Port: %d, API: %s\n", args.ServicePort, args.ServiceAPI)
	log.Printf("DoubPort: %d, DoubAPI: %s\n", args.DoubPort, args.DoubAPI)
	return nil
}
