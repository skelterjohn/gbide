package main

import (
	"os"
	"path"
	"path/filepath"
	"fmt"
	"sort"
	"bytes"
	"bufio"
	"strings"
	"template"
	"github.com/hoisie/web.go"
)

var (
	ListFileFormat = 
`   <item path="{LongName}" dir="false" id="{ID}"{.section ParentID} parent_id="{@}"{.end}>
	    <content>
		    <name>{ShortName}</name>
	    </content>
    </item>
`
	ListDirFormat = 
`   <item path="{LongName}" dir="true" state="closed" id="{ID}"{.section ParentID} parent_id="{@}"{.end}>
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

type Target struct {
	Head ListEntry
	Srcs []ListEntry
}

type TargetList []Target
func (this TargetList) Len() int {
	return len(this)
}
func (this TargetList) Less(i, j int) bool {
	return this[i].Head.ShortName < this[j].Head.ShortName
}
func (this TargetList) Swap(i, j int) {
	this[i], this[j] = this[j], this[i]
}

func GBListHandler(ctx *web.Context) {
	args := []string{"gb", "-L"}
	fmt.Printf("%v\n", args)
	reader := bytes.NewBuffer(nil)
	RunExternalDump(GBCMD, CWD, args, reader)
	bin := bufio.NewReader(reader)
	
	var targets TargetList
	
	fmt.Fprintf(ctx, "<root>\n")
	
	dir := ""
	kind := ""
	for {
		line, _ := bin.ReadString('\n')
		line = strings.TrimSpace(line)
		if line == "" {
			break
		}
		
		if strings.HasPrefix(line, "in") {
		
			tokens := strings.Split(line, " ", -1)
			dir = tokens[1][:len(tokens[1])-1]
			kind = tokens[2]
			name := strings.Trim(tokens[3], "\"")
			
			label := fmt.Sprintf(`%s %s`, kind, name)
			
			le := ListEntry{ID:dir, ParentID:"", LongName:dir, ShortName:label}
			
			targets = append(targets, Target{Head:le})
			
			
			//_ = ListDirTemplate.Execute(ctx, le)
		} else {
			src := strings.TrimSpace(line)
			le := ListEntry{ID:filepath.Join(dir, src), ParentID:dir, LongName:filepath.Join(dir, src), ShortName:src}
			
			srcs := targets[len(targets)-1].Srcs
			srcs = append(srcs, le)
			targets[len(targets)-1].Srcs = srcs
			
			//_ = ListFileTemplate.Execute(ctx, le)
		}
	}
	
	sort.Sort(targets)
	
	for _, target := range targets {
		ListDirTemplate.Execute(ctx, target.Head)
		for _, src := range target.Srcs {
			ListFileTemplate.Execute(ctx, src)
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
