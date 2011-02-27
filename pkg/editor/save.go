package editor

import (
	"os"
	"github.com/mattn/web.go"
)

func SaveHandler(ctx *web.Context) (code string) {
	params := ctx.Request.Params
	file := params["filename"]
	data := params["data"]

	fout, err := os.Open(file, os.O_CREATE|os.O_RDWR, 0644)
	if err == nil {
		fout.WriteString(data)
		fout.Close()
		code = "ok"
	}
	return
}

func LoadHandler(ctx *web.Context) {
	params := ctx.Request.Params
	filename := params["filename"]
	
	var fin *os.File
	var err os.Error
	fin, err = os.Open(filename, os.O_RDONLY, 0)
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