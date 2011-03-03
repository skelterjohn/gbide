
var ListDir = function(dir) {
	$.ajax({
		type: "GET",
		url: "ls/"+dir,
		success: ListSuccess
	});
}

var fileList = []
var fileLongList = []
var fileMapping = [0]
var isDir = []

var FindIndex = function(dir) {
	for (var i=0; i<fileLongList.length; i++) {
		if (fileLongList[i] == dir) {
			return i+1
		}
	}
	return 0
}

var ListSuccess = function(data, textStatus, jqXHR) {
	lines = data.split("\n")
	var dir, dirIndex
	var insertFiles = []
	var insertLongFiles = []
	var insertMapping = []
	var insertDir = []
	var iterations = 0
	for (i=0; i<lines.length; i++) {
		iterations++
		line = lines[i]
		if (line == "") {
			continue
		}
		lineItems = line.split("\t")
		file = lineItems[0]
		if (file[0] == ":") {
			dir = file.substring(1)
			dirIndex = FindIndex(dir)
			continue
		}
		insertDir = insertDir.concat([file[0]==">"])
		if (file[0] == ">") {
			file = file.substring(1)
		}
		shortname = lineItems[1]
		
		insertFiles = insertFiles.concat([shortname])
		insertLongFiles = insertLongFiles.concat([file])
		insertMapping = insertMapping.concat([dirIndex])
	}
	newlist = fileList.slice(0, dirIndex)
	newlist = newlist.concat(insertFiles)
	newlist = newlist.concat(fileList.slice(dirIndex))
	newlonglist = fileLongList.slice(0, dirIndex)
	newlonglist = newlonglist.concat(insertLongFiles)
	newlonglist = newlonglist.concat(fileLongList.slice(dirIndex))
	newmapping = fileMapping.slice(0, dirIndex)
	newmapping = newmapping.concat(insertMapping)
	newmapping = newmapping.concat(fileMapping.slice(dirIndex))
	newdir = isDir.slice(0, dirIndex)
	newdir = newdir.concat(insertDir)
	newdir = newdir.concat(isDir.slice(dirIndex))
	
	for (i=dirIndex+1+insertMapping.length; i<newmapping.length; i++) {
		if (newmapping[i] > dirIndex) {
			newmapping[i] += insertMapping.length 
		}
	}
	
	fileList = newlist
	fileLongList = newlonglist
	fileMapping = newmapping
	isDir = newdir
	
	newhtml = ""
	for (i=0; i<fileList.length; i++) {
		if (isDir[i]) {
			newhtml += sprintf("<tr><td><a href='javascript:ListDir(\"%s\")'>%s</a></td></tr>\n", fileLongList[i], fileList[i])			
		} else {
			newhtml += sprintf("<tr><td><a href='javascript:LoadContents(\"%s\")'>%s</a></td></tr>\n", fileLongList[i], fileList[i])
		}
	}
	
	var opts = {
		openImg: "jqtreetable/images/minus.gif",
		shutImg: "jqtreetable/images/plus.gif",
		leafImg: "jqtreetable/images/tv-item.gif",
		lastOpenImg: "jqtreetable/images/minus.gif",
		lastShutImg: "jqtreetable/images/plus.gif",
		lastLeafImg: "jqtreetable/images/tv-item-last.gif",
		vertLineImg: "jqtreetable/images/blank.gif",
		blankImg: "jqtreetable/images/blank.gif"
	};
	
	
	/*
	text = aceEditor.getSession().getValue()+"\n----\n"
	
	text += data+"\n"
	text += "fileLongList:"+fileLongList.join("\n\t")+"\n"
	text += "insertLongFiles:"+insertLongFiles.join(",")+"\n"
	text += "dirIndex:"+dirIndex+"\n"
	text += "fileMapping:"+fileMapping.join("\n\t")+"-"+dir +"\n"
	text += "insertMapping:"+insertMapping.join(",")+"-"+dir  +"\n"
	
	aceEditor.getSession().setValue(text)
	*/
	
	$("#filebrowsertree").html(newhtml)
	$("#filebrowsertree").jqTreeTable(fileMapping, opts)
}

$(document).ready(function(){
});