package editor

import (
	"os"
	"github.com/mattn/web.go"
)

func SaveHandler(ctx *web.Context) (code string) {
	params := ctx.Request.Params
	file := params["file"]
	data := params["data"]

	fout, err := os.Open(file, os.O_CREATE|os.O_RDWR, 0644)
	if err == nil {
		fout.WriteString(data)
		fout.Close()
	}
	return
}