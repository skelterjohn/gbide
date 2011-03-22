package main

import (
	"os"
	"template"
	"bytes"
)

const BrowseTemplatePath = "templates/browse.template"
const BrowseChooseTemplatePath = "templates/choose.template"

var BrowseT *template.Template
var BrowseChooseT *template.Template

func init() {
	BrowseT = template.New(nil)
	BrowseT.SetDelims("{{", "}}")
	BrowseT.ParseFile(BrowseTemplatePath)
	BrowseChooseT = template.New(nil)
	BrowseChooseT.SetDelims("{{", "}}")
	BrowseChooseT.ParseFile(BrowseChooseTemplatePath)
}

func GetBar() (code string) {
	var err os.Error
	buf := bytes.NewBuffer([]byte{})
	if err = BrowseT.Execute(buf, nil); err == nil {
		code = buf.String()
	} else {
		code = err.String()
	}
	return
}

func GetChoose() (code string) {
	var err os.Error
	buf := bytes.NewBuffer([]byte{})
	if err = BrowseChooseT.Execute(buf, nil); err == nil {
		code = buf.String()
	} else {
		code = err.String()
	}
	return
}