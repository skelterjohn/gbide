
var dir = "";

var ScanWorkspace = function() {
	
	$("#pkgbrowser").jstree({ 
		"core" : { "animation" : 0 },
		
		"xml_data" : {
			//"data" : xml
			"ajax" : {
				"url" : "/gblist",
			},
		},
		
		"ui" : {
			"select_limit" : 1,
			"selected_parent_close" : "select_parent",
		},
							
		"search" : {
			
		},
							
		"plugins" : [ "themes", "xml_data", "ui", "contextmenu", "search" ]
	}).bind("search.jstree", function (e, data) {
			
		$("#pkgbrowser").jstree("select_node", $("#gb/gb.go"))
		alert("Found " + data.rslt.nodes.length + " nodes matching '" + data.rslt.str + "'.");
	})
	
	
	$("#pkgbrowser").jstree("set_theme","apple")
	$("#pkgbrowser").jstree("toggle_icons")
	$("#pkgbrowser").jstree("toggle_dots")
	
	$("#pkgbrowser").delegate('a', 'click', ClickFileTree); 
	
	setBrowsers()
}

var BuildSuccess = function(data, textStatus, jqXHR) {
	
}

var BuildPkgs = function() {
	window.open("/build/", "gbide-build")
}

var BuildPkg = function(pkg) {
	window.open("/build/"+pkg, "gbide-build")
}

var LocationHashChanged = function() {
	tokens = location.hash.split(":")
	file = tokens[0].substring(1)
	num = parseInt(tokens[1])
	LoadContents(file)
	aceEditor.gotoLine(num)
}

$(document).ready(function(){
	window.onhashchange = LocationHashChanged
	ScanWorkspace()
});
