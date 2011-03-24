package main

import (
	"strings"
	"regexp"
	"strconv"
	"bufio"
	"fmt"
	"os"
	"bytes"
	"github.com/hoisie/web.go"
)

func GetBuildBar() (code string) {
    //edited from gbide
	var err os.Error
	if err == nil {
		buf := bytes.NewBuffer([]byte{})
		BuildBarT.Execute(buf, nil)
		code = buf.String()
	} else {
		code = err.String()
	}
	return
}

var (
	inBuilding = regexp.MustCompile(`\(in (.+)\) building (.+) (".+")`)
	compileError = regexp.MustCompile(`([^:]+):([^:]+): (.+)`)
)

type CompileError struct {
	Dir, File, Error string
	Line int
}

type Building struct {
	Dir, Kind, Target string
}

func BuildHandler(ctx *web.Context, dir string) {
	args := []string{"gb"}
	if dir != "" && dir != "#" {
		args = append(args, dir)
	}
	fmt.Printf("%v\n", args)

	buf := bytes.NewBuffer(nil)
	RunExternalDump(GBCMD, CWD, args, buf)
	
	bfr := bufio.NewReader(buf)
	
	body := bytes.NewBuffer(nil)
	
	var b Building
	for {
		line, err := bfr.ReadString('\n')
		if err != nil {
			break
		}
		line = strings.TrimSpace(line)
		
		if tokens := compileError.FindStringSubmatch(line); tokens != nil {
			file := tokens[1]
			linenum, _ := strconv.Atoi(tokens[2])
			error := tokens[3]
			
			ce := CompileError{Dir:b.Dir, File:file, Line:linenum, Error:error}
			CompileErrTemplate.Execute(body, ce)
			
			continue
		}
		
		if tokens := inBuilding.FindStringSubmatch(line); tokens != nil {

			b.Dir = tokens[1]
			b.Kind = tokens[2]
			b.Target = tokens[3]
			BuildingTemplate.Execute(body, b)
						
			continue
		}
		
		BuildLineTemplate.Execute(body, map[string]string{"Line":line})
	}
	
	BuildT.Execute(ctx, map[string]string{"Body":body.String()})
}
