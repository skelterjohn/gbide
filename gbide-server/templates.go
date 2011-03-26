package main

import (
	"template"
)

var (
	ListFileFormat = 
`   <item path="{LongName}" class="{Class}" dir="false" id="{ID}"{.section ParentID} parent_id="{@}"{.end}>
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
	CompileErrFormat =
`		<div class="compile-err">
			<a href='#' onclick="goto('{Dir}/{File}', {Line})">
				<div class="internal" id="file">{File}</div>:<div class="internal" id="line">{Line}</div>
			</a>
			<div class="internal" id="error">{Error}</div>
		</div>
`
	BuildingFormat =
`		<div class="building">
			<div class="internal" id="dir">{Dir}</div>
			<div class="internal" id="kind">{Kind}</div>
			<div class="internal" id="target>{Target}</div>
		</div>
`
	BuildLineFormat =
`		<div class="line">{Line}</div>
`
)

var (
	ListFileTemplate = template.MustParse(ListFileFormat, nil)
	ListDirTemplate = template.MustParse(ListDirFormat, nil)
	CompileErrTemplate = template.MustParse(CompileErrFormat, nil)
	BuildingTemplate = template.MustParse(BuildingFormat, nil)
	BuildLineTemplate = template.MustParse(BuildLineFormat, nil)
)

const (
	EditorTemplatePath = "templates/editor.template"
	BuildBarTemplatePath = "templates/buildbar.template"
	PkgInfoTemplatePath = "templates/pkginfo.template"
	BuildTemplatePath = "templates/build.template"
)

var (
	EditorT *template.Template
	BuildBarT *template.Template
	PkgInfoT *template.Template
	BuildT *template.Template
)

func init() {
	EditorT = template.New(nil)
	EditorT.SetDelims("{{", "}}")
	EditorT.ParseFile(EditorTemplatePath)
	
	BuildBarT = template.New(nil)
	BuildBarT.SetDelims("{{", "}}")
	BuildBarT.ParseFile(BuildBarTemplatePath)
	
	PkgInfoT = template.New(nil)
	PkgInfoT.SetDelims("{{", "}}")
	PkgInfoT.ParseFile(PkgInfoTemplatePath)
	
	BuildT = template.New(nil)
	BuildT.SetDelims("{{", "}}")
	BuildT.ParseFile(BuildTemplatePath)
}
