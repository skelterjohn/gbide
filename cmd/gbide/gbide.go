package main

import (
	"window"
)

func main() {
	window.LaunchBrowser("http://localhost:9090")
	window.RunServer(9090)
}