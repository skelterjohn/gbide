package editor

import (
	"fmt"
	"github.com/mattn/web.go"
)

func SaveHandler(ctx *web.Context) (code string) {
	fmt.Printf("%v\n", ctx.Request.Params)
	return
}