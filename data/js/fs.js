$(document).ready(function(){
	LoadFileBrowser()
	window.location = '/#'
});

var NewFile = function(obj) {
    var $t = $.jstree._focused()
	$t.create()
}

var CreateFileHandler = function(event, data) {
	var dir = data.rslt.parent.attr("path")
	var name = data.rslt.name
	filename = dir+"/"+name
	SaveContents(filename)
}

var DeleteFile = function(obj) {
	
	$.ajax({
		   type: "GET",
		   url: "rm/"+filename,
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

var RenameFile = function(obj) {
    var $t = $.jstree._focused()
	$t.rename()
}

var RenameFileHandler = function(event, data) {
	var dir = data.rslt.parent.attr("path")
	var name = data.rslt.name
	filename = dir+"/"+name
	SaveContents(filename)
}

var fileBrowserTree

var LoadFileBrowser = function(){
	
	var UrlFinder = function(node) {
		if (node == -1) {
			return "/ls/"
		} else {
			return "/ls/"+node.attr("id")
		}
	}
	
	$("#filebrowser").jstree({ 
		"core" : { "animation" : 0 },
							 
		"xml_data" : {
			"ajax" : {
				"url" : UrlFinder,
			},
		},

		"ui" : {
			"select_limit" : 1,
			"selected_parent_close" : "select_parent",
		},

		"plugins" : [ "themes", "xml_data", "ui" ]
	})
	
	$("#filebrowser").bind("select_node.jstree", SelectAux) 
	$("#filebrowser").bind("load_node.jstree", LoadNodeAux) 
	$("#filebrowser").jstree("set_theme","apple")
	$("#filebrowser").jstree("toggle_icons")
	$("#filebrowser").jstree("toggle_dots")
	
	$("#filebrowser").delegate('a', 'click', ClickFileTree) 
	
	fileBrowserTree = $.jstree._reference('#filebrowser')
	
	setBrowsers()
}

var SelectAux = function (e, data) {
	var SelectOpen = function () { 
		if (!data.inst.is_open(this)) {
			data.inst.open_node(this);
		}
	}
	data.rslt.obj.parents('.jstree-closed').each(SelectOpen)
}

var LoadNodeAux = function (e, data) {
	OpenFileAncestorsAux()
}

var ReplaceAll = function(x, p, r) {
	var y = null
	while (y != x) {
		x = y
		y = x.replace(p, r)
	}
	return y
}
var disableEdit = false
var EditCallback = function() {
	if (disableEdit || currentFile == "") {
		return
	}
	TouchFile(currentFile)
}

var TouchFile = function(filename) {
	var sel = GetIDSelector(filename)
	$(sel).addClass("marked")
}

var UntouchFile = function(filename) {
	var sel = GetIDSelector(filename)
	$(sel).removeClass("marked")
}

var ofaDirs = null
var ofaDir = null
var OpenFileAncestors = function(path) {
	ofaDir = ""
	ofaDirs = path.split("/")
	OpenFileAncestorsAux()
}

var OpenFileAncestorsAux = function() {
	if (ofaDirs.length == 0) {
		return
	}
	if (ofaDir != "") {
		ofaDir += "/"
	}
	ofaDir += ofaDirs[0]
	ofaDirs = ofaDirs.slice(1)
	
	var j = $.jstree._reference("#filebrowser");
	var sel = GetIDSelector(ofaDir)
	j.open_node(sel)
	j.deselect_all()
	j.select_node(sel)
}
								
var SelectFile = function(filename) {
	OpenFileAncestors(filename)
	
	var sel = GetIDSelector(filename);
	var SelectInTree = function(tsel) {
								
		var j = $.jstree._reference(tsel);
		j.deselect_all()
		j.select_node(sel)
	}
	SelectInTree("#pkgbrowser")
	SelectInTree("#filebrowser")
}


var ClickFileTree = function(e) {
	var n = $.jstree._focused()._get_node(this)
	
	var path = n.attr("path")
	
	if (n.attr("dir") == "false") {
		LoadContents(path)
		$("#editor").show()
		$("#pkginfo").hide()
	} else {
		LoadPackageInfo(path)
		$("#editor").hide()
		$("#pkginfo").show()
	}
	window.location = "/#"+path
}


var LocationHashChanged = function() {
	tokens = location.hash.split(":")
	file = tokens[0].substring(1)
	LoadContents(file)
	if (tokens.length > 1) {
		num = parseInt(tokens[1])
		aceEditor.gotoLine(num)
	}
}

whichBrowser = "#pkgbrowser"
allBrowsers = ["#filebrowser", "#pkgbrowser"]

setBrowsers = function() {
	for (i=0;i<allBrowsers.length; i++ ) {
		if (allBrowsers[i] != whichBrowser) {
			$(allBrowsers[i]).hide()
		}
	}
	$(whichBrowser).show()
}

chooseBrowser = function(which) {
	whichBrowser = which
	setBrowsers()
}


var GetIDSelector = function(filename) {
	return "#"+filename.replace(/\//g,"\\/").replace(/\./g, "\\.")
}
