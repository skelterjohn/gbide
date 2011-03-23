package main

import (
	"os"
	"bytes"
)

func GetBuildBar() (code string) {
    //edited from gbide
	var err os.Error
	if err == nil {
		buf := bytes.NewBuffer([]byte{})
		BuildT.Execute(buf, nil)
		code = buf.String()
	} else {
		code = err.String()
	}
	return
}
