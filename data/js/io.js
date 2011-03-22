
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
			touchedFiles[filename] = false
			fileNodes[currentFile].css("background", oldColors[currentFile])
		}
	})
}

var currentFile = "";
var openFiles = {}
var touchedFiles = {}
var fileNodes = {}
var oldColors = {}

var LoadGodoc = function(path) {
    $("#godoc").html('GODOC for '+path)
}

disableEdit = false
var EditCallback = function() {
	if (disableEdit || currentFile == "") {
		return
	}
	touchedFiles[currentFile] = true
	oldColors[currentFile] = fileNodes[currentFile].css("background")
	fileNodes[currentFile].css("background", "orange")
}

var LoadDataToEditor = function(data, filename) {
	currentFile = filename
	aceEditor.getSession().setValue(data)
	disableEdit = false
	openFiles[filename] = data
}

var RevertCurrentContents = function() {
	openFiles[currentFile] = null
	filename = currentFile
	currentFile = ""
	LoadContents(filename)
}

var LoadContents = function(filename) {
	disableEdit = true
	if (currentFile != "") {
		openFiles[currentFile] = aceEditor.getSession().getValue()
	}
	
	data = openFiles[filename]
	if (data != null) {
		LoadDataToEditor(data, filename)
	} else {
		$.ajax({
			type: "GET",
			url: "load/"+filename,
			context: document.body,
			success: function(data, textStatus, jqXHR) {
				LoadDataToEditor(data, filename)
			}
		});
	}
}

var SaveCurrentContents = function() {
	if (currentFile != "") {
		SaveContents(currentFile)
	}
}
