var delayMilliSec = 1000;
var inputJavaCM;
var outputBcCM;
var codeUploader;

function delayedUpload() {
	clearTimeout(codeUploader);
	codeUploader = setTimeout(function() {
		var code = {
			code: inputJavaCM.getValue(),
			className: $('#class_name').val()
		};
		$.post('/getByteCode', code, function(data) {
			console.log('data.err: ' + data.err);
			console.log('data.code: ' + data.code);
			if(typeof data.code != 'undefined') {
				outputBcCM.setValue(data.code);
			} else if(typeof data.err != 'undefined') {
				outputBcCM.setValue(data.err);
			}
			
		});
		outputBcCM.setValue('// Processing...');
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
