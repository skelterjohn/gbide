


var aceEditor = null
window.onload = function() {
    aceEditor = ace.edit("editor");
	aceEditor.setTheme("ace/theme/clouds");
    var mode = require("ace/mode/c_cpp").Mode;
    aceEditor.getSession().setMode(new mode());
	
	aceEditor.getSession().on('change', EditCallback);
};