var socket = io.connect('/'); 
var idleSec = 0;

socket.on('byte_code', function(data) {
	$('#output_bc').val(data.code);
});

socket.on('wrong', function(data) {
	$('#output_bc').val(data.err);
});

$(function() {
	var waitMilliSec = 1000;
	var idleIntervalId = setInterval(tick, waitMilliSec);
	var codeSentTimeStamp = new Date().getTime() - waitMilliSec;
	//console.log('codeSentTimeStamp: ' + codeSentTimeStamp);
	$('#input_java').bind('input propertychange', function() {
		var now = new Date().getTime();
		var className = $('#class_name').val();
		//console.log('now: ' + now);
		//console.log('diff: ' + (now - codeSentTimeStamp));
		console.log('className not empty : ' + (className !== ''));
		console.log('class Name: ' + className);
		if (now - codeSentTimeStamp >= waitMilliSec && className !== '') {
			console.log('upload from top');
			socket.emit('code_sent', {
				code: $('#input_java').val(),
				className: className
			});	
			codeSentTimeStamp = new Date().getTime();
			idleIntervalId = setInterval(tick, waitMilliSec);
		} 
	});

	$(this).mousemove(function (e) {
        idleSec = 0;
    });
    $(this).keypress(function (e) {
        idleSec = 0;
    });
	
	function tick() {
		console.log('tick: ' + idleSec);
		var className = $('#class_name').val();
    	idleSec = idleSec + 1;
    	if (idleSec >= 1 && className !== '') {
    		// if idle for more than 1 second upload the code
    		console.log('upload from tick()');
        	socket.emit('code_sent', {
				code: $('#input_java').val(),
				className: className
			});
			clearInterval(idleIntervalId);
    	}
	}
});
