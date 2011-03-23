package main

import (
	"path"
	"os"
	"fmt"
	"template"
	"exec"
	"runtime"
	"bytes"
	
	"github.com/hoisie/web.go"
	
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
		_, err = os.StartProcess("/usr/bin/open", []string{"open", url}, &os.ProcAttr{".", nil, nil})
	}
	if runtime.GOOS == "linux" {
		var ffp string
		ffp, err = exec.LookPath("firefox")
		if err == nil {
			fmt.Println([]string{"firefox", url})
			_, err = os.StartProcess(ffp, []string{"firefox", url}, &os.ProcAttr{".", nil, nil})
		}
	}
	return
}

type WindowData struct {
	Editor string
	BuildBar string
	BrowseBar string
	BrowseChoose string
}

func WindowHandle() (code string) {


	data := WindowData{
		Editor:OpenFile("README"),
		BuildBar:GetBuildBar(),
		BrowseBar: GetBar(),
		BrowseChoose: GetChoose(),
	}

/*
	data := map[string]string{"Editor":editor.OpenFile("README"),
								"BuildBar":build.GetBar(),
								"BrowseBar":browseOut,
								}
*/
	buf := bytes.NewBuffer([]byte{})
	IDET.Execute(buf, &data)
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
	web.Post("/save/(.*)", SaveHandler)
	web.Get("/load/(.*)", LoadHandler)
	web.Post("/gb", GBHandler)
	web.Get("/ls/(.*)", ListHandlerXML)
	web.Get("/gblist", GBListHandler)
	web.Get("/gbpkg/(.*)", PkgInfoHandler)
	web.Run(fmt.Sprintf("0.0.0.0:%d", port))
}
