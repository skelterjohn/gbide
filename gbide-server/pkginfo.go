package main

import (
	"regexp"
	"strings"
	"fmt"
	"bytes"
	"bufio"
	"github.com/hoisie/web.go"
)

type PkgInfo struct {
	Dir string
	Name, Target string
	Kind string
	Deps []string
}

var DepSplitter = regexp.MustCompile(` (.+) Deps: \[(.*)\]`)

func PkgInfoHandler(ctx *web.Context, dir string) {
	prefix := "in "+dir+":"
	
	pkgMatch, err := regexp.Compile(prefix+` (.+) (".+")`)
	if err != nil {
		//do something
		return
	}

	args := append([]string{"gb", "-Se"}, dir)
	fmt.Printf("%v\n", args)
	
	bin := bytes.NewBuffer(nil)
	RunExternalDump(GBCMD, CWD, args, bin)
	
	br := bufio.NewReader(bin)
	
	var info PkgInfo
	info.Dir = dir
	
	for {
		line, err := br.ReadString('\n')
		if err != nil {
			break
		}
		line = strings.TrimSpace(line)
		if strings.HasPrefix(line, prefix) {
			tokens := pkgMatch.FindStringSubmatch(line)
			info.Kind = tokens[1]
			info.Target = tokens[2]
			//fmt.Sscanf(line, prefix+" %s \"%s\"", &info.Kind, &info.Target)
			
			line, _ = br.ReadString('\n')
			tokens = DepSplitter.FindStringSubmatch(line)
			info.Name = tokens[1]
			depline := tokens[2]
			deps := strings.Split(depline, " ", -1)
			for _, dep := range deps {
				dep = strings.Trim(dep, "\"")
				if dep == "" {
					continue
				}
				info.Deps = append(info.Deps, dep)
			}
			break
		}
	}
	
	PkgInfoT.Execute(ctx, info)
}

