
var dir = "";

var ScanSuccess = function(data, textStatus, jqXHR) {
	//newhtml = "<div id=\"pkgbrowser\">\n";
	newhtml = ""
	lines = data.split("\n");
	section = 1;
	for (i=0; i<lines.length-1; i++) {
		tokens = lines[i].split(" ")
		if (tokens[0] == "in") {
			dir = tokens[1].slice(0, tokens[1].length-1);
			kind = tokens[2];
			target = tokens[3];
			status = tokens[4];
			uptodate = status == "(up";
			installed = status == "(installed)";
			
			label = kind+" "+target;
			
			if (section != 1) {
				newhtml += "</div>\n";
			}
			newhtml += "<h6><a href=\"#section";
			newhtml += section;
			newhtml += "\">"+label+"</a></h6>\n";
			newhtml += "<div>\n";
			newhtml += "in "+dir+"\n";
			section++;
		}
		else {
			filename = tokens[0].slice(1);
			fullname = dir+"/"+filename
			newhtml += "<a href='javascript:LoadContents(\""+fullname+"\")'>";
			newhtml += filename+"</a>\n";
		}
	}
	newhtml += "</div>\n";
	//newhtml += "</div>\n";
	$( "#pkgbrowser" ).accordion("destroy");
	$( "#pkgbrowser" ).html(newhtml);
	//aceEditor.getSession().setValue(newhtml)
	$( "#pkgbrowser" ).accordion({fillSpace: true});
	
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
