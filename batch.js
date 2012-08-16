var exec = require('child_process').exec;
var argv = require('optimist').argv;
var numpad = require('numpad');
var nrc = 0;
var child = exec('node spider.js --u SYPER54 --p b1idyq54 --session 201001 --nrc ' + argv.nrc, function(err, stdout, stderr) {
	console.log('stdout: ' + stdout);
	console.log('stderr: ' + stderr);
	if (err !== null) {
	  console.log('exec error: ' + error);
	}	
});

console.log("Ran with nrc:", numpad(argv.nrc, 5));

child.on('exit', function() {
	console.log("Finished.");
	exec('node batch --nrc ' + numpad(argv.nrc, 5));
});