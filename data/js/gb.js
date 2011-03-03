
var dir = "";

var ScanSuccess = function(data, textStatus, jqXHR) {
	newhtml = ""
	lines = data.split("\n")
	
	mapping = []
	lastpkg = 0
	
	for (i=0; i<lines.length-1; i++) {
		tokens = lines[i].split(" ")
		if (tokens[0] == "in") {
			dir = tokens[1].slice(0, tokens[1].length-1)
			kind = tokens[2]
			target = tokens[3]
			status = tokens[4]
			uptodate = status == "(up"
			installed = status == "(installed)"
			
			label = kind+" "+target
			
			newhtml += sprintf("<tr><td>%s</td></tr>\n", label)
			
			mapping = mapping.concat([0])
			lastpkg = i+1

		}
		else {
			filename = tokens[0].slice(1)
			fullname = dir+"/"+filename
			
			newhtml += sprintf("<tr><td><a href='javascript:LoadContents(\"%s\")'>%s</a></td></tr>\n", fullname, filename)
			
			mapping = mapping.concat([lastpkg])
		}
	}
	//mapping = [0,1,1,1,0,5,5,5,0,9,9,9,0,13,13,0,16,16]
	$("#pkgbrowsertree").html(newhtml)
	//aceEditor.getSession().setValue(newhtml+"\n"+(mapping.join(",")))
	
	$("#pkgbrowsertree").jqTreeTable(mapping, jq_defaults);
	
	
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
