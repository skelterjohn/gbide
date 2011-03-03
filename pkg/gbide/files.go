package gbide

import (
	"os"
	"path"
	"fmt"
	"strings"
	"github.com/mattn/web.go"
)

func ListHandler(ctx *web.Context, dir string) {
	if dir == "" {
		dir = "."
	}

	var err os.Error
	var dfile *os.File
	dfile, err = os.Open(dir, os.O_RDONLY, 0)
	if err != nil {
		return
	}
	var files []os.FileInfo
	files, err = dfile.Readdir(-1)
	if err != nil {
		return
	}
	
	dirid := "dir-"+strings.Replace(dir, "/", "-", -1)
	if dir == "." {
		dirid = "dir-top"
	}
	class := "child-of-"+dirid
	
	fmt.Fprintf(ctx, "<tr class=\"file\" id=\"dir-top\"><td>workspace</td></tr>\n")
	for _, file := range files {
		if strings.HasPrefix(file.Name, ".") {
			continue
		}
		fileid := "file-"
		if file.IsDirectory() {
			fileid = "dir-"
		}
		
		fullname := path.Join(dir, file.Name)
		
		fileid += strings.Replace(fullname, "/", "-", -1)
		if file.IsDirectory() {
			fmt.Fprintf(ctx, "<tr id=\"%s\" class=\"file %s\"><td>%s</td></tr>\n", fileid, class, file.Name)
		} else {
			fmt.Fprintf(ctx, "<tr id=\"%s\" class=\"file %s\"><td><a href='javascript:LoadContents(\"%s\")'>%s</a></td></tr>\n", fileid, class, fullname, file.Name)
		}
	}
	return
}