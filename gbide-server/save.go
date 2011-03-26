package main

import (
	"os"
	"fmt"
	"path"
	"github.com/hoisie/web.go"
)

func SaveHandler(ctx *web.Context, filename string) (code string) {
	params := ctx.Request.Params
	data := params["data"]
    
	fout, err := os.Open(path.Join(CWD, filename), os.O_CREATE|os.O_RDWR|os.O_TRUNC, 0644)
	if err == nil {
		_, err = fmt.Fprintf(fout, "%s", data)
		
		fout.Close()
	}
	code = fmt.Sprintf("%v", err)
	return
}


func DeleteHandler(ctx *web.Context, filename string) (code string) {
	err := os.RemoveAll(filename)
	code = err.String()
	return
}

func LoadHandler(ctx *web.Context, filename string) {
	var fin *os.File
	var err os.Error
	fin, err = os.Open(path.Join(CWD, filename), os.O_RDONLY, 0)
	if err != nil {
		ctx.WriteString(err.String())
		return
	}
	buf := make([]byte, 1024)
	for {
		var n int
		n, err = fin.Read(buf)
		if err != nil {
			//ctx.WriteString(err.String())
			return
		}
		if n == 0 || err != nil {
			break
		}
		ctx.Write(buf[0:n])
	}
	fin.Close()
}
