var theJobType = 'FOO';
var exec = require('child_process').exec;
var child = exec('jdk1.8.0_25\\bin\\javap.exe -c Something.class', function(error, stdout, stderr) {
	if ( error != null ) {
        console.log(stderr);
        // error handling & exit
   } else {
   		console.log(stdout);
   }
});