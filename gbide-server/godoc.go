package main

import (
	"exec"
	"os"
)

var godocP *exec.Cmd
var lock = make(chan bool, 1)	

func RunGodoc() (err os.Error) {
	lock<- true
	defer func() { <-lock } ()
	
	if godocP != nil {
		err = os.NewError("godoc already running")
		return
	}
	
	var godocCmd string
	godocCmd, err = exec.LookPath("godoc")
	
	argv := []string{"godoc", "-path=.", "-http=:6060"}
	
	godocP, err = exec.Run(godocCmd, argv, nil, CWD, exec.PassThrough, exec.PassThrough, exec.PassThrough)
	if err != nil {
		return
	}

	return
}

func KillGodoc() {
	
}
