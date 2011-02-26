package main

import (
	"gbide"
)

func main() {
	gbide.LaunchBrowser("http://localhost:9090")
	gbide.RunServer(9090)
}