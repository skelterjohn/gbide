package main

import (
	"os"
	"fmt"
)

var CWD string

func main() {
	//gbide.LaunchBrowser("http://localhost:9090")
	CWD = "."
	if len(os.Args)>1 {
		CWD = os.Args[1]
	}
	
	fmt.Printf("running in %s\n", CWD)
	
	RunServer(9090)
}
