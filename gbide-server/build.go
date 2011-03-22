package main

import (
	"os"
	"template"
	"bytes"
)

const BuildTemplatePath = "templates/build.template"

var BuildT *template.Template

func init() {
	BuildT = template.New(nil)
	BuildT.SetDelims("{{", "}}")
	BuildT.ParseFile(BuildTemplatePath)
}

func GetBuildBar() (code string) {
    //edited from gbide
	var err os.Error
	if err == nil {
		buf := bytes.NewBuffer([]byte{})
		BuildT.Execute(buf, nil)
		code = buf.String()
	} else {
		code = err.String()
	}
	return
}
