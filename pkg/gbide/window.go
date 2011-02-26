package gbide

import (
	"os"
	"github.com/mattn/web.go"
	"editor"
	"fmt"
	"template"
	"exec"
	"runtime"
	"bytes"
)

const IDETemplatePath = "templates/ide.template"

var IDET *template.Template

func init() {
	IDET = template.New(nil)
	IDET.SetDelims("{{", "}}")
	IDET.ParseFile(IDETemplatePath)
}

func LaunchBrowser(url string) (err os.Error) {
	defer fmt.Println(err)
	if runtime.GOOS == "darwin" {
		fmt.Println([]string{"open", url})
		_, err = os.StartProcess("/usr/bin/open", []string{"open", url}, nil, ".", nil)
	}
	if runtime.GOOS == "linux" {
		var ffp string
		ffp, err = exec.LookPath("firefox")
		if err == nil {
			fmt.Println([]string{"firefox", url})
			_, err = os.StartProcess(ffp, []string{"firefox", url}, nil, ".", nil)
		}
	}
	return
}

func WindowHandle() (code string) {
	data := map[string]string{"Editor":editor.OpenFile("README")}
	buf := bytes.NewBuffer([]byte{})
	IDET.Execute(buf, data)
	code = buf.String()
	return
} 

func RunServer(port int) {
	web.Config.StaticDir = "data"
	web.Get("/", WindowHandle)
	//web.Post("/save", editor.SaveHandler)
	web.Run(fmt.Sprintf("0.0.0.0:%d", port))
}