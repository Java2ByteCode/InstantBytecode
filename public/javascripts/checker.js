var socket = io.connect('/'); 
var waitMilliSec = 1000;
var oldJavaCode = '';
var oldClassName = '';


socket.on('byte_code', function(data) {
	$('#output_bc').val(data.code);
});

socket.on('wrong', function(data) {
	$('#output_bc').val(data.err);
});

$(function() {
	var newJavaCode = $('#input_java').val();
	var newClassName = $('#class_name').val();



	var idleIntervalId = setInterval(function() {
		newJavaCode = $('#input_java').val();
		newClassName = $('#class_name').val();
		checkDiff(newJavaCode, newClassName);
	} , waitMilliSec);

	function checkDiff(newJavaCode, newClassName) {
		if((newJavaCode != oldJavaCode) || (newClassName != oldClassName)) {
			socket.emit('code_sent', {
				code: $('#input_java').val(),
				className: $('#class_name').val()
			});	
			oldJavaCode = newJavaCode;
			oldClassName = newClassName;
			
			var myCodeMirror = CodeMirror(function(elt) {
				console.log('code mirror triggered');
				elt.id = 'input_java';
				var inputJavaTextArea = document.getElementById('input_java');
				console.log('inputJavaTextArea:' + inputJavaTextArea);
				inputJavaTextArea.parentNode.replaceChild(elt, inputJavaTextArea);
			}, {mode: 'clike'});
		}
	}
});
