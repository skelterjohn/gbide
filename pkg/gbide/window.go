package gbide

import (
	"path"
	"os"
	"fmt"
	"template"
	"exec"
	"runtime"
	"bytes"
	
	"github.com/mattn/web.go"
	
	"editor"
	"build"
	"browse"
)

const IDETemplatePath = "templates/ide.template"

var IDET *template.Template

func init() {
	IDET = template.New(nil)
	IDET.SetDelims("{{", "}}")
	IDET.ParseFile(IDETemplatePath)
}

func LaunchBrowser(url string) (err os.Error) {
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
	data := map[string]string{"Editor":editor.OpenFile("README"),
								"BuildBar":build.GetBar(),
								"BrowseBar":browse.GetBar(),
								}
	buf := bytes.NewBuffer([]byte{})
	IDET.Execute(buf, data)
	code = buf.String()
	return
} 

func MakeRedirect(base string) (handler func (ctx *web.Context, val string)) {
	handler = func(ctx *web.Context, val string) {
		var fin *os.File
		var err os.Error
		fin, err = os.Open(path.Join(base, val), os.O_RDONLY, 0)
		if err != nil {
			ctx.WriteString(err.String())
			return
		}
		buf := make([]byte, 1024)
		for {
			var n int
			n, err = fin.Read(buf)
			if err != nil {
				ctx.WriteString(err.String())
				return
			}
			if n == 0 || err != nil {
				break
			}
			ctx.Write(buf[0:n])
		}
		fin.Close()
	}
	return
}

func RunServer(port int) {
	web.Config.StaticDir = "data"
	web.Get("/", WindowHandle)
	web.Post("/save/(.*)", editor.SaveHandler)
	web.Get("/load/(.*)", editor.LoadHandler)
	web.Run(fmt.Sprintf("0.0.0.0:%d", port))
}