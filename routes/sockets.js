var io = require('socket.io');
var fs = require('fs');
var exec = require('child_process').exec;
var tmp = require('temporary');

exports.init = function(server) {
	console.log('JavaDec initialized');
	io = io.listen(server);

	io.on('connection', function(socket) { // triggered by io.connect('/') at the client side
		console.log('JavaDec on connection');

		socket.on('code_sent', function(data) {
			var javaFile = 'Something.java';
			console.log('code received');
			
			java2ByteCode(javaFile, data.code, socket);
		});
	});
}

function java2ByteCode(javaFile, code, socket) {
	var tmpDir = new tmp.Dir();
	console.log('tmpDir: ' + tmpDir.path);
	fs.writeFile(tmpDir.path + '/' + javaFile, code, function(err) {
		if(err) {
			// compile error doesn't go here...
			console.log(err);
			return;
		} 
		console.log('java file generated');
		compileJava(javaFile, socket, tmpDir);
	});
}

function compileJava(javaFile, socket, tmpDir) {
	var child = exec('jdk1.8.0_25\\bin\\javac.exe ' + tmpDir.path + '\\' + javaFile, function(error, stdout, stderr) {
		if ( error != null ) {
	        console.log(stderr);
	        socket.emit('wrong', {
	        	err: stderr
	        });
	        return;
	        // error handling & exit
	   }
	   console.log('class file generated');
	   genByteCode('Something.class', socket, tmpDir);
	});
}

function genByteCode(classFile, socket, tmpDir) {
	var child = exec('jdk1.8.0_25\\bin\\javap.exe -c ' + tmpDir.path + '\\'+classFile, function(error, stdout, stderr) {
		if ( error != null ) {
	        console.log(stderr);
	        socket.emit('wrong', {
	        	err: stderr
	        });
	        return;
	        // error handling & exit
	   }
	   console.log('bytecode file generated');
	   console.log(stdout);
	   socket.emit('byte_code', {
	   		code: stdout
	   });
	});
}