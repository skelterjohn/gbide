
var num = 0
var goto = function(file, line) {
	num++
	window.opener.document.location.href = '/#'+file+':'+line+':'+num
	window.opener.focus()
}
