
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

var LoadContents = function(filename) {
	$.ajax({
				type: "GET",
				url: "load/"+filename,
				context: document.body,
				success: function(data, textStatus, jqXHR) {
					aceEditor.getSession().setValue(data)
				}
			});
}
