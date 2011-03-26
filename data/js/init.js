
$(document).ready(Init);

var Init = function() {
	alert("init")
	LoadFileBrowser()
	ScanWorkspace()
	window.onhashchange = LocationHashChanged
	window.location = '/#'
}
