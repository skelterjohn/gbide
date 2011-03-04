
var dir = "";

var ScanSuccess = function(data, textStatus, jqXHR) {
	lines = data.split("\n")
	
	xml = "<root>"
	
	var curtarget
	
	for (i=0; i<lines.length-1; i++) {
		tokens = lines[i].split(" ")
		if (tokens[0] == "in") {
			curtarget = tokens[1].slice(0, tokens[1].length-1)
			kind = tokens[2]
			target = tokens[3]
			status = tokens[4]
			uptodate = status == "(up"
			installed = status == "(installed)"
			
			label = kind+" "+target
			
			xml += sprintf('<item path="%s" dir="true" state="closed" id="%s">'+
						   '<content>'+
						   '<name>%s</name>'+
						   '</content>'+
						   '</item>\n', curtarget, curtarget, label)
			

		}
		else {
			filename = tokens[0].slice(1)
			fullname = curtarget+"/"+filename
			
			xml += sprintf('<item path="%s" dir="false" id="%s" parent_id="%s">'+
						   '<content>'+
						   '<name>%s</name>'+
						   '</content>'+
						   '</item>\n', fullname, fullname, curtarget, filename)
			
		}
	}
	
	
	xml += "</root>"
	
	$("#pkgbrowser").jstree({ 
		"xml_data" : {
			"data" : xml
		},

		"ui" : {
			"select_limit" : 1,
			"selected_parent_close" : "select_parent",
		},

		"plugins" : [ "themes", "xml_data", "ui" ]
	});	  
	$("#pkgbrowser").jstree("set_theme","apple");
	$("#pkgbrowser").jstree("toggle_icons")
	$("#pkgbrowser").jstree("toggle_dots")
	
	$("#pkgbrowser").delegate('a', 'click', ClickFileTree); 
}

var ScanWorkspace = function() {
	
	$.ajax({
		type: "POST",
		url: "gb",
		data: {args:"-L"},
		context: document.body,
		success: ScanSuccess
	});
}
$(document).ready(function(){
	ScanWorkspace()
});
