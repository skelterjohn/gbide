
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
							
		"plugins" : [ "themes", "xml_data", "ui", "contextmenu" ]
	});	  
	$("#pkgbrowser").jstree("set_theme","apple");
	$("#pkgbrowser").jstree("toggle_icons")
	$("#pkgbrowser").jstree("toggle_dots")
	
	$("#pkgbrowser").delegate('a', 'click', ClickFileTree); 
	
	setBrowsers()
}

var BuildSuccess = function(data, textStatus, jqXHR) {
	
}

var BuildPkgs = function() {
	$.ajax({
		type: "POST",
		url: "gb",
		data: {args:"."},
		context: document.body,
		success: BuildSuccess
	});
}

$(document).ready(function(){
	ScanWorkspace()
});
