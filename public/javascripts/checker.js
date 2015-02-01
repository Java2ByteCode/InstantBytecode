var socket = io.connect('/'); 
var waitMilliSec = 1000;
var oldJavaCode = '';
var oldClassName = '';
var outputBcCM;

socket.on('byte_code', function(data) {
	outputBcCM.setValue(data.code);
});

socket.on('wrong', function(data) {
	outputBcCM.setValue(data.err);
});

$(function() {
	var inputJavaCM = CodeMirror.fromTextArea(document.getElementById('input_java'), {
		mode: 'clike',
		lineNumbers: true
	});
	outputBcCM = CodeMirror.fromTextArea(document.getElementById('output_bc'), {
		mode: 'clike',
		lineNumbers: true
	});

	var idleIntervalId = setInterval(function() {
		newJavaCode = inputJavaCM.getValue();
		newClassName = $('#class_name').val();
		checkDiff(newJavaCode, newClassName);
	} , waitMilliSec);

	function checkDiff(newJavaCode, newClassName) {
		if((newJavaCode != oldJavaCode) || (newClassName != oldClassName)) {
			socket.emit('code_sent', {
				code: newJavaCode,
				className: newClassName
			});	
			oldJavaCode = newJavaCode;
			oldClassName = newClassName;	
		}
	}
});
