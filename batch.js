var exec = require('child_process').exec;
var argv = require('optimist').argv;
var numpad = require('numpad');
var nrc = 0;
var child;

if(argv.nrc == 99999) {
	console.log(finished);
	process.exit(0);	
}

console.log("Ran with nrc:", numpad(argv.nrc, 5));

var execNext = function() {
	child = exec('node spider.js --u SYPER54 --p b1idyq54 --session 201001 --nrc ' + numpad(argv.nrc++, 5), function(err, stdout, stderr) {
		console.log('NRC#', numpad(argv.nrc, 5));
		if (err !== null) {
		  console.log('Output: ' + error);
		}
	});
	
	child.on('exit', function() {
		console.log("Finished.");
		execNext();
	});
};

execNext();