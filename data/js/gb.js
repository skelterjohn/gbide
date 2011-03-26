
var dir = "";

var pkgBrowserTree

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
							
			    			
		"contextmenu" : {
			"select_node" : true,
    		"items" : {
        		"create" : null,
        		"rename" : null,
        		"remove" : null,
        		"ccp" : null,
        
        		"new" : {
            		"label"				: "New",
            		"action"			: NewFile,
        		},
        
        		"delete" : {
            		"label"				: "Delete",
            		"action"			: DeleteFile,
        		},
        
        		"rename" : {
            		"label"				: "Rename",
            		"action"			: RenameFile,
        		},
    		},
		},
							
		"plugins" : [ "themes", "xml_data", "ui", "contextmenu", "crrm" ]
	})
	
	
	$("#pkgbrowser").bind("select_node.jstree", SelectAux) 
	$("#pkgbrowser").bind("create.jstree", CreateFileHandler)
	$("#pkgbrowser").bind("rename.jstree", RenameFileHandler)
	$("#pkgbrowser").jstree("set_theme","apple")
	$("#pkgbrowser").jstree("toggle_icons")
	$("#pkgbrowser").jstree("toggle_dots")
	
	$("#pkgbrowser").delegate('a', 'click', ClickFileTree); 

	pkgBrowserTree = $.jstree._reference('#pkgbrowser')
	
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

$(document).ready(function(){
	window.onhashchange = LocationHashChanged
	ScanWorkspace()
});
