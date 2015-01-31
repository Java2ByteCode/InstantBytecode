var socket = io.connect('/'); 

socket.on('byte_code', function(data) {
	// alert(data.code);
	$('#output_bc').val(data.code);
});

socket.on('wrong', function(data) {
	$('#output_bc').val(data.err);
});

$(function() {
	var waitMilliSec = 1000;
	var codeSentTimeStampe = new Date().getTime() - waitMilliSec;
	//console.log('codeSentTimeStampe: ' + codeSentTimeStampe);
	$('#input_java').bind('input propertychange', function() {
		var now = new Date().getTime();
		//console.log('now: ' + now);
		//console.log('diff: ' + (now - codeSentTimeStampe));
		if (now - codeSentTimeStampe >= waitMilliSec) {
			socket.emit('code_sent', {
				code: $('#input_java').val()
			});	
			codeSentTimeStampe = new Date().getTime();
		} 
	});
});
