var socket = io.connect('/'); 
var delayMilliSec = 1000;
var inputJavaCM;
var outputBcCM;
var codeUploader;

socket.on('byte_code', function(data) {
	outputBcCM.setValue(data.code);
});

socket.on('wrong', function(data) {
	outputBcCM.setValue(data.err);
});

function delayedUpload() {
	clearTimeout(codeUploader);
	codeUploader = setTimeout(function() {
		socket.emit('code_sent', {
			code: inputJavaCM.getValue(),
			className: $('#class_name').val()
		});	
	}, delayMilliSec);	
}

$(function() {
	
	$('#class_name').bind('input propertychange', function(){
		delayedUpload();
	});

	inputJavaCM = CodeMirror.fromTextArea(document.getElementById('input_java'), {
		styleActiveLine: true,
		mode: 'clike',
		lineNumbers: true
	});
	inputJavaCM.on('change', function(cMirror) {
		delayedUpload();
	});
	inputJavaCM.setSize("100%", "100%");

	outputBcCM = CodeMirror.fromTextArea(document.getElementById('output_bc'), {
		mode: 'clike',
		lineNumbers: true,
		readOnly: true
	});
	outputBcCM.setSize("100%", "100%");

});
