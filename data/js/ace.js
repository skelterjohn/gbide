
var aceEditor = null
window.onload = function() {
    aceEditor = ace.edit("editor");
	aceEditor.setTheme("ace/theme/twilight");
    var mode = require("ace/mode/c_cpp").Mode;
    aceEditor.getSession().setMode(new mode());
};