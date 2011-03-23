package main

import (
	"template"
)

var (
	ListFileFormat = 
`   <item path="{LongName}" dir="false" id="{ID}"{.section ParentID} parent_id="{@}"{.end}>
	    <content>
		    <name>{ShortName}</name>
	    </content>
    </item>
`
	ListDirFormat = 
`   <item path="{LongName}" dir="true" state="closed" id="{ID}"{.section ParentID} parent_id="{@}"{.end}>
	    <content>
		    <name>{ShortName}</name>
	    </content>
    </item>
`
)

var (
	ListFileTemplate = template.MustParse(ListFileFormat, nil)
	ListDirTemplate = template.MustParse(ListDirFormat, nil)
)

const (
	EditorTemplatePath = "templates/editor.template"
	BuildTemplatePath = "templates/build.template"
	PkgInfoTemplatePath = "templates/pkginfo.template"
)

var (
	EditorT *template.Template
	BuildT *template.Template
	PkgInfoT *template.Template
)

func init() {
	EditorT = template.New(nil)
	EditorT.SetDelims("{{", "}}")
	EditorT.ParseFile(EditorTemplatePath)
	
	BuildT = template.New(nil)
	BuildT.SetDelims("{{", "}}")
	BuildT.ParseFile(BuildTemplatePath)
	
	PkgInfoT = template.New(nil)
	PkgInfoT.SetDelims("{{", "}}")
	PkgInfoT.ParseFile(PkgInfoTemplatePath)
}
