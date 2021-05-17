package boot

import (
	"bookFinder/app/model/args"
	"bookFinder/app/model/types"
)

func init() {
	// 定义 UA
	args.HeaderArgs = types.WebArgs{
		UserAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36",
		Cookie:    "MUID=19E8B5E4EB9461E22741BA37EAD76088; MUIDB=19E8B5E4EB9461E22741BA37EAD76088; _EDGE_V=1; SRCHD=AF=NOFORM; SRCHUID=V=2&GUID=D82CBB8F7BFD49C3AC1C0C769AA0519B&dmnchg=1; _SS=SID=0169A5F0D8DB6CF933F3AA23D9986DF3; SRCHUSR=DOB=20210203&T=1612316902000&TPC=1612316903000; ipv6=hit=1612320505903; _EDGE_S=F=1&SID=0169A5F0D8DB6CF933F3AA23D9986DF3&mkt=zh-cn; SRCHHPGUSR=HV=1612318639&BZA=0&BRW=HTP&BRH=M&CW=1043&CH=727&DPR=1.2395833730697632&UTC=480&DM=0&PLTL=492&PLTA=478&PLTN=3&WTS=63747913703; imgv=flts=20210203",
	}
	args.ServicePort = 9091
	args.ServiceAPI = "/rpc/v1/bookfinder"
	args.DoubPort = 9092
	args.DoubAPI = "/"
	args.Sites = make(map[string]string)
	args.Sites["zhihu"] = "zhihu.com"
	args.Sites["jianshu"] = "jianshu.com"
	args.Sites["csdn"] = "csdn.net"
	args.BingAPIToken = "6fcd10e0c6434c0996ce69a57e4c79ee"
}
