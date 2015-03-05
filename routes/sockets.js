var fs = require('fs');
var exec = require('child_process').exec;
var tmp = require('temporary');
var sep = getSeparator();
var express = require('express');
var router = express.Router();

router.get('/getByteCode', function (req, res) {
	var javaFile = req.query.className + '.java';
	console.log('code received');
	java2ByteCode(javaFile, req.query.code, res);
});

function java2ByteCode(javaFile, code, res) {
	var tmpDir = new tmp.Dir();
	console.log('tmpDir: ' + tmpDir.path);
	fs.writeFile(tmpDir.path + sep + javaFile, code, function(err) {
		if(err) {
			console.log(err);
			return;
		} 
		console.log('java file generated');
		compileJava(javaFile, res, tmpDir);
	});
}

function hideErrorMsgPath(tmpDirPath, stderr) {
	var tmp = tmpDirPath.replace(/[\/\\]/g, '');
	return stderr.replace(/[\/\\]/g, '').replace(tmp, '');
}

function compileJava(javaFile, res, tmpDir) {
	console.log('seperator: ' + sep);
	var child = exec('javac ' + tmpDir.path + sep + javaFile, function(error, stdout, stderr) {
		if ( error != null ) {
	        console.log('stderr(compieJava): ' + stderr);
	        var errMsg = hideErrorMsgPath(tmpDir.path, stderr);        
			res.send({err: errMsg});
	        return;
	   }
	   console.log('class file generated');
	   genByteCode(javaFile.replace('java', 'class'), res, tmpDir);
	});
}

function genByteCode(classFile, res, tmpDir) {
	var child = exec('javap -c ' + tmpDir.path + sep + classFile, function(error, stdout, stderr) {
		if ( error != null ) { 
			console.log('stderr(genByteCode): ' + stderr);
			var errMsg = hideErrorMsgPath(tmpDir.path, stderr);
	        res.send({err: errMsg});
	        return;
		}
	console.log('bytecode file generated');
		//console.log(stdout);
		res.send({code: stdout});
	});
}

function getSeparator() {
	if(process.platform.indexOf('win32') > -1) { // contains win32
		return '\\';
	} else {
		return '/';
	}
}

module.exports = router;