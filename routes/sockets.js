var io = require('socket.io');
var fs = require('fs');
var exec = require('child_process').exec;
var tmp = require('temporary');
var sep = getSeparator();

exports.init = function(server) {
	console.log('JavaDec initialized');
	io = io.listen(server);

	io.on('connection', function(socket) { // triggered by io.connect('/') at the client side
		console.log('JavaDec on connection');

		socket.on('code_sent', function(data) {
			var javaFile = data.className + '.java';
			console.log('code received');
			
			java2ByteCode(javaFile, data.code, socket);
		});
	});
}

function java2ByteCode(javaFile, code, socket) {
	var tmpDir = new tmp.Dir();
	console.log('tmpDir: ' + tmpDir.path);
	fs.writeFile(tmpDir.path + sep + javaFile, code, function(err) {
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
	console.log('seperator: ' + sep);
	var child = exec(getEnvVarWin('JAVA_HOME') + sep + 'bin' + sep + 'javac ' + 
		tmpDir.path + sep + javaFile, function(error, stdout, stderr) {
		if ( error != null ) {
	        console.log(stderr);
	        socket.emit('wrong', {
	        	err: stderr
	        });
	        return;
	        // error handling & exit
	   }
	   console.log('class file generated');
	   genByteCode(javaFile.replace('java', 'class'), socket, tmpDir);
	});
}

function genByteCode(classFile, socket, tmpDir) {
	var child = exec(getEnvVarWin('JAVA_HOME')+ sep + 'bin' + sep + 'javap -c ' + 
		tmpDir.path + sep + classFile, function(error, stdout, stderr) {
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

function getEnvVarWin(envVar) {
	if(process.platform.indexOf('win32') > -1) { // windows operating system
		return '%'+envVar+'%';
	} else {
		return '$'+envVar;
	}
}

function getSeparator() {
	if(process.platform.indexOf('win32') > -1) { // contains win32
		return '\\';
	} else {
		return '/';
	}
}