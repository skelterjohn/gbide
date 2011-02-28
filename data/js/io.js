
var SaveContents = function(filename) {
	data = aceEditor.getSession().getValue();
	$.ajax({
				type: "POST",
				url: "save",
				data: {filename:filename, data:data},
				context: document.body,
				success: function(data, textStatus, jqXHR){
					if (data != null) {
						alert(data);
					}
				}
			});
}

var LoadContents = function(filename) {
	$.ajax({
				type: "POST",
				url: "load",
				data: {filename:filename},
				context: document.body,
				success: function(data, textStatus, jqXHR) {
					aceEditor.getSession().setValue(data)
				}
			});
}
