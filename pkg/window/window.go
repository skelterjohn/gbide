package window

import (
	"os"
	"fmt"
	"github.com/mattn/web.go"
	"editor"
)

func LaunchBrowser(url string) (err os.Error) {
	fmt.Println([]string{"open", url})
	_, err = os.StartProcess("/usr/bin/open", []string{"open", url}, nil, ".", nil)
	return
}

func WindowHandle() (code string) {
	return editor.OpenFile("README")
} 

func RunServer(port int) {
	web.Config.StaticDir = "html"
	web.Get("/", WindowHandle)
	web.Run(fmt.Sprintf("0.0.0.0:%d", port))
}