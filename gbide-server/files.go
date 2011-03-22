package main

import (
	"os"
	"path"
	"path/filepath"
	"fmt"
	"bytes"
	"bufio"
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

func GBListHandler(ctx *web.Context) {
	args := []string{"gb", "-L"}
	fmt.Printf("%v\n", args)
	reader := bytes.NewBuffer(nil)
	RunExternalDump(GBCMD, CWD, args, reader)
	bin := bufio.NewReader(reader)
	
	
	fmt.Fprintf(ctx, "<root>\n")
	
	dir := ""
	for {
		line, _ := bin.ReadString('\n')
		line = strings.TrimSpace(line)
		if line == "" {
			break
		}
		
		if strings.HasPrefix(line, "in") {
		
			tokens := strings.Split(line, " ", -1)
			dir = tokens[1][:len(tokens[1])-1]
			kind := tokens[2]
			println(tokens[3])
			name := strings.Trim(tokens[3], "\"")
			
			label := fmt.Sprintf(`%s %s`, kind, name)
			
			le := ListEntry{ID:dir, ParentID:"", LongName:"", ShortName:label}
			
			_ = ListDirTemplate.Execute(ctx, le)
		} else {
			src := strings.TrimSpace(line)
			le := ListEntry{ID:src, ParentID:dir, LongName:filepath.Join(dir, src), ShortName:src}
			
			_ = ListFileTemplate.Execute(ctx, le)
		}
	}
	fmt.Fprintf(ctx, "</root>\n")
	
}

func ListHandlerXML(ctx *web.Context, dir string) {
	if dir == "" {
		dir = "."
	}
	

	var err os.Error
	var dfile *os.File
	dfile, err = os.Open(filepath.Join(CWD, dir), os.O_RDONLY, 0)
	if err != nil {
		return
	}
	var files []os.FileInfo
	files, err = dfile.Readdir(-1)
	if err != nil {
		return
	}
	
	
	fmt.Fprintf(ctx, "<root>\n")
		
	for _, file := range files {
		if strings.HasPrefix(file.Name, ".") {
			continue
		}

		fullname := path.Join(dir, file.Name)
		fileID := fullname// strings.Replace(fullname, "/", ":", -1)
		
		le := ListEntry{ID:fileID, ParentID:dir, LongName:fullname, ShortName:file.Name}
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
