
var ScanSuccess = function(data, textStatus, jqXHR) {
	//newhtml = "<div id=\"pkgbrowser\">\n";
	newhtml = ""
	lines = data.split("\n");
	section = 1;
	files = 0
	for (i=0; i<lines.length-1; i++) {
		tokens = lines[i].split(" ")
		if (tokens[0] == "in") {
			dir = tokens[1].slice(0, tokens[1].length-1);
			kind = tokens[2];
			target = tokens[3];
			status = tokens[4];
			uptodate = status == "(up";
			installed = status == "(installed)";
			
			
			if (files != 0) {
				newhtml += "</div>\n";
			}
			newhtml += "<h6><a href=\"#section";
			newhtml += section;
			newhtml += "\">"+target+"</a></h6>\n";
			section++;
			files = 0
		}
		else {
			filename = tokens[0].slice(1);
			if (files == 0) {
				newhtml += "<div>\n";
			}
			newhtml += filename+"\n";
			files++;	
		}
	}
	if (files != 0) {
		newhtml += "</div>\n";
	}
	//newhtml += "</div>\n";
	$( "#pkgbrowser" ).html(newhtml);
	aceEditor.getSession().setValue(newhtml)
	$( "#pkgbrowser" ).accordion();
	
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
