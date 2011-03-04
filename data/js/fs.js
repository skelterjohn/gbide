$(document).ready(function(){
	
	$("#filebrowser").jstree({ 
		"xml_data" : {
			"ajax" : {
				"url" : function(node) {
					if (node == -1) {
						return "/ls/"
					} else {
						return "/ls/"+node.attr("id")
					}
				},
							
			},
		},
							
		"ui" : {
			"select_limit" : 1,
			"selected_parent_close" : "select_parent",
		},
							 
		"plugins" : [ "themes", "xml_data", "ui" ]
	});	  
	$("#filebrowser").jstree("set_theme","apple");
	$("#filebrowser").jstree("toggle_icons")
	$("#filebrowser").jstree("toggle_dots")
				  
	$("#filebrowser").delegate('a', 'click', ClickFileTree); 
});

var ClickFileTree = function(e) {
	n = $.jstree._focused()._get_node(this)
	if (n.attr("dir") == "false") {
		LoadContents(n.attr("path"))
	}
}