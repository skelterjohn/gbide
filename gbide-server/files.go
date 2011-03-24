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
	"github.com/hoisie/web.go"
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

func GetID(filename string) (id string) {
	id = filename
	//id = strings.Replace(id, "/", "_", -1)
	//id = strings.Replace(id, ".", "_", -1)
	return
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
			label = dir
			
			fileID := GetID(dir)
			le := ListEntry{ID:fileID, ParentID:"", LongName:dir, ShortName:label}
			
			targets = append(targets, Target{Head:le})
			
			
			//_ = ListDirTemplate.Execute(ctx, le)
		} else {
			if len(targets) == 0 {
				continue
			}
			src := strings.TrimSpace(line)
			
			filename := filepath.Join(dir, src)
			
			fileID := GetID(filename)
			parentID := GetID(dir)
			
			le := ListEntry{ID:fileID, ParentID:parentID, LongName:filename, ShortName:src}
			
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
		fileID := GetID(fullname)
		parentID := GetID(dir)
		
		le := ListEntry{ID:fileID, ParentID:parentID, LongName:fullname, ShortName:file.Name}
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
