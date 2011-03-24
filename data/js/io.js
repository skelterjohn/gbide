
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
			fileNodes[currentFile].css("background", oldColors[currentFile])
		}
	})
}

var currentFile = "";
var openFiles = {}

var LoadPackageInfo = function(path) {
	$.ajax({
		type: "GET",
		url: "gbpkg/"+path,
		context: document.body,
		success: function(data, textStatus, jqXHR) {
			$("#pkginfo").html(data)
			$("#pkginfo").show()
		    SelectFile(path)
		}
	});
}

disableEdit = false
var EditCallback = function() {
	if (disableEdit || currentFile == "") {
		return
	}
	TouchFile(currentFile)
	//oldColors[currentFile] = fileNodes[currentFile].css("background")
	//fileNodes[currentFile].css("background", "orange")
}

var lineNumbers = {}
var LoadDataToEditor = function(data, filename) {
	
	SelectFile(filename)
	
	currentFile = filename
	aceEditor.gotoLine(0)
	aceEditor.getSession().setValue(data)
	if (lineNumbers[filename] == null) {
		lineNumbers[filename] = 1
	}
	aceEditor.gotoLine(lineNumbers[filename])
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
	if (filename == "") {
		return
	}
	var fileid = GetIDSelector(filename)
	//alert("LoadContents("+fileid+")")
	$("#pkgbrowser").jstree("deselect_all")
	$("#pkgbrowser").jstree("select_node", $("#gb/gb_cgo.go"))
	
	
	
	//$("#pkgbrowser").jstree("search", filename)
	
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
			    /*
			    oldColor = oldColors[filename]
				if (oldColor != null) {
					fileNodes[filename].css("background", oldColor)
			    }
			    */
				UntouchFile(filename)
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
