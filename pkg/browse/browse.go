package browse

import (
	"os"
	"template"
	"bytes"
)

const BrowseTemplatePath = "templates/browse.template"

var BrowseT *template.Template

func init() {
	BrowseT = template.New(nil)
	BrowseT.SetDelims("{{", "}}")
	BrowseT.ParseFile(BrowseTemplatePath)
}

func GetBar() (code string) {
	var err os.Error
	if err == nil {
		buf := bytes.NewBuffer([]byte{})
		BrowseT.Execute(buf, nil)
		code = buf.String()
	} else {
		code = err.String()
	}
	return
}