

var SaveContents = function(filename) {
	data = aceEditor.getSession().getValue();
	$.ajax({
				type: "POST",
				url: "save/"+filename,
				data: {data:data},
				context: document.body,
				success: function(data, textStatus, jqXHR){
					if (data != null) {
						alert(data);
					}
				}
			});
}

var currentFile = "";

var LoadContents = function(filename) {
	$.ajax({
		type: "GET",
		url: "load/"+filename,
		context: document.body,
		success: function(data, textStatus, jqXHR) {
			currentFile = filename;
			aceEditor.getSession().setValue(data)
		}
	});
}

var SaveCurrentContents = function() {
	if (currentFile != "") {
		SaveContents(currentFile)
	}
}
