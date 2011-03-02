
var trim = function(s) {
	return s.replace(/^\s*((?:[\S\s]*\S)?)\s*$/, '$1')
}

var SaveContents = function(filename) {
	data = aceEditor.getSession().getValue()
	$.ajax({
		type: "POST",
		url: "save/"+filename,
		data: {data:data},
		context: document.body,
		success: function(data, textStatus, jqXHR) {
			alert(data)
		}
	})
}

var currentFile = "";

var LoadContents = function(filename) {
	$.ajax({
		type: "GET",
		url: "load/"+filename,
		context: document.body,
		success: function(data, textStatus, jqXHR) {
			currentFile = filename
			$("file").effect("highlight", {color:"#b1b1b1"}, 3000)
			aceEditor.getSession().setValue(data)
			
			toks = filename.split("/")
			basename = toks[toks.length-1]
		   
			if (basename == "Makefile" || basename == "makefile") {
				var mode = require("ace/mode/python").Mode
				aceEditor.getSession().setMode(new mode())
			} else if (/\.template$/.test(basename)) {
				var mode = require("ace/mode/html").Mode
				aceEditor.getSession().setMode(new mode())
			}
			else {
				var mode = require("ace/mode/c_cpp").Mode
				aceEditor.getSession().setMode(new mode())
			}
		}
	});
}

var SaveCurrentContents = function() {
	if (currentFile != "") {
		SaveContents(currentFile)
	}
}
