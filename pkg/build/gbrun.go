package build

import (
	"fmt"
	"strings"
	"os"
	"exec"
	"io"
	"github.com/hoisie/web.go"
    
)

var GBCMD string

func init() {
	GBCMD, _ = exec.LookPath("gb")
}

func GBHandler(ctx *web.Context) {
	params := ctx.Request.Params
	args := append([]string{"gb"}, strings.Split(params["args"], " ", -1)...)
	fmt.Printf("%v\n", args)
	wd, _ := os.Getwd()
	RunExternalDump(GBCMD, wd, args, ctx)
}


func RunExternalDump(cmd, wd string, argv []string, dump io.Writer) (err os.Error) {
	var p *exec.Cmd
	p, err = exec.Run(cmd, argv, nil, wd, exec.PassThrough, exec.Pipe, exec.PassThrough)
	if err != nil {
		return
	}
	if p != nil {
		src := p.Stdout
		
		_, err = io.Copy(dump, src)
		/*
		buffer := make([]byte, 1024)
		for {
			n, cpErr := src.Read(buffer)
			if cpErr != nil {
				break
			}
			_, cpErr = dump.Write(buffer[0:n])
			if cpErr != nil {
				break
			}
		}
		*/
		if err != nil {
			return
		}
		
		var wmsg *os.Waitmsg
		wmsg, err = p.Wait(0)
		if wmsg.ExitStatus() != 0 {
			err = os.NewError(fmt.Sprintf("%v: %s\n", argv, wmsg.String()))
			return
		}
        
		if err != nil {
			return
		}
	}
	return
}
