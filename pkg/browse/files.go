package browse

import (
	"os"
	"path"
	"fmt"
	"strings"
	"template"
	"github.com/hoisie/web.go"
)

var (
	ListFileFormat = 
`<item path="{LongName}" dir="false" id="{ID}"{.section ParentID} parent_id="{@}"{.end}>
	<content>
		<name>{ShortName}</name>
	</content>
</item>
`
	ListDirFormat = `<item path="{LongName}" dir="true" state="closed" id="{ID}"{.section ParentID} parent_id="{@}"{.end}>
	<content>
		<name>{ShortName}</name>
	</content>
</item>
`
)

var (
	ListFileTemplate = template.MustParse(ListFileFormat, nil)
	ListDirTemplate = template.MustParse(ListDirFormat, nil)
)

type ListEntry struct {
	ID, ParentID string
	LongName, ShortName string
}


func ListHandlerXML(ctx *web.Context, dir string) {
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
	
	dirID := dir//strings.Replace(dir, "/", ":", -1)
	
	fmt.Fprintf(ctx, "<root>\n")
		
	for _, file := range files {
		if strings.HasPrefix(file.Name, ".") {
			continue
		}

		fullname := path.Join(dir, file.Name)
		fileID := fullname// strings.Replace(fullname, "/", ":", -1)
		
		le := ListEntry{ID:fileID, ParentID:dirID, LongName:fullname, ShortName:file.Name}
		if le.ParentID == "." {
			le.ParentID = ""
		}
		if file.IsDirectory() {
			_ = ListDirTemplate.Execute(ctx, le)
			
		} else {
			_ = ListFileTemplate.Execute(ctx, le)
		}
	}
	
	fmt.Fprintf(ctx, "</root>\n")
	
	return
}

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