package browse

import (
	"os"
	"path"
	"fmt"
	"strings"//
	"github.com/hoisie/web.go"
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
	
	fmt.Fprintf(ctx, ":%s\n", dir)

	for _, file := range files {
		if strings.HasPrefix(file.Name, ".") {
			continue
		}
		if file.IsDirectory() {
			fmt.Fprintf(ctx, ">")
		}
		fullname := path.Join(dir, file.Name)
		fmt.Fprintf(ctx, "%s\t%s\n", fullname, file.Name)
	}
	return
}