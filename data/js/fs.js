$(document).ready(function(){LoadFileBrowser()});

var NewFile = function(obj) {
    
}

var LoadFileBrowser = function(){
	
	UrlFinder = function(node) {
		if (node == -1) {
			return "/ls/"
		} else {
			return "/ls/"+node.attr("id")
		}
	}
	
	$("#filebrowser").jstree({ 
		"core" : { "animation" : 0 },
							 
		"xml_data" : {
			"ajax" : {
				"url" : UrlFinder,
			},
		},

		"ui" : {
			"select_limit" : 1,
			"selected_parent_close" : "select_parent",
		},
				
        "contextmenu" : {
            // Some key
            "new" : {
                // The item label
            	"label"				: "New",
            	// The function to execute upon a click
            	"action"			: NewFile,
            	// All below are optional 
            	"_disabled"			: true,		// clicking the item won't do a thing
            	"_class"			: "class",	// class is applied to the item LI node
            	"separator_before"	: false,	// Insert a separator before the item
            	"separator_after"	: true,		// Insert a separator after the item
            	// false or string - if does not contain `/` - used as classname
            	"icon"				: false,
            	"submenu"			: { 
            		/* Collection of objects (the same structure) */
            	}
            }
        /* MORE ENTRIES ... */
        },


		"plugins" : [ "themes", "xml_data", "ui", "contextmenu" ]
	});	  
	$("#filebrowser").jstree("set_theme","apple");
	$("#filebrowser").jstree("toggle_icons")
	$("#filebrowser").jstree("toggle_dots")
	
	$("#filebrowser").delegate('a', 'click', ClickFileTree) 
	
	setBrowsers()
}

var ClickFileTree = function(e) {
	n = $.jstree._focused()._get_node(this)
	if (n.attr("dir") == "false") {
		path = n.attr("path")
		fileNodes[path] = n
		LoadContents(path)
		$("#editor").show()
		$("#pkginfo").hide()
	} else {
		LoadPackageInfo(n.attr("path"))
		$("#editor").hide()
		$("#pkginfo").show()
	}
}


whichBrowser = "#pkgbrowser"
allBrowsers = ["#filebrowser", "#pkgbrowser"]

setBrowsers = function() {
	for (i=0;i<allBrowsers.length; i++ ) {
		if (allBrowsers[i] != whichBrowser) {
			$(allBrowsers[i]).hide()
		}
	}
	$(whichBrowser).show()
}

chooseBrowser = function(which) {
	whichBrowser = which
	setBrowsers()
}