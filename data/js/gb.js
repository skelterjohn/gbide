
var dir = "";

var ScanSuccess = function(data, textStatus, jqXHR) {
	//newhtml = "<div id=\"pkgbrowser\">\n";
	newhtml = ""
	newhtml2 = ""
	lines = data.split("\n")
	section = 0
	file = 1
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
			
			if (section != 0) {
				newhtml += "</div>\n"
			}
			section++;
			newhtml += sprintf("<h6><a href=\"#section%d\">%s</a></h6>\n", section, label)
			newhtml += "<div>\n"
			newhtml += "in "+dir+"\n"
			
			iddir = dir.replace("/", "-")
			newhtml2 += sprintf("<tr id=\"file-%s\"><td>%s</td></tr>\n", iddir, label)
			
			file = 1
		}
		else {
			filename = tokens[0].slice(1)
			fullname = dir+"/"+filename
			newhtml += sprintf("<a id=\"%s\" href='javascript:LoadContents(\"%s\")'>%s</a>\n", fullname, fullname, filename)
			
			iddir = dir.replace("/", "-")
			idname = iddir+"-"+filename.replace("/", "-")
			newhtml2 += sprintf("<tr id=\"file-%s\" class=\"child-of-file-%s\"><td><a id=\"%s\" href='javascript:LoadContents(\"%s\")'>%s</a></td></tr>\n", idname, iddir, fullname, fullname, filename)
			file++
		}
	}
	newhtml += "</div>\n"
	//newhtml += "</div>\n";
	$( "#pkgbrowser" ).accordion("destroy")
	$( "#pkgbrowser" ).html(newhtml)
	$( "#pkgbrowser" ).accordion({fillSpace: true})
	
	//$("#filebrowser").treeTable("destroy")
	//$("#filebrowser").html(newhtml2)
	//$("#filebrowser").treeTable()	
	
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
