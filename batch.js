var exec = require('child_process').exec;
var argv = require('optimist').argv;
var numpad = require('numpad');
var nrc = 0;
var children;

if(argv.c == undefined) argv.c = 1;

console.log("Ran with nrc:", numpad(argv.nrc, 5));

var execNext = function() {
	
	for(var i = 1; i <= argv.c; i++) {
		childLoop(i);
	}
	
	argv.nrc+=argv.c;
};


var childLoop = function(offset) {
	children[offset] = exec('node spider.js --u ' + argv.u + ' --p ' + argv.p + ' --s ' + argv.s + ' --nrc ' + numpad(argv.nrc+offset, 5), function(err, stdout, stderr) {
		console.log('NRC#', numpad(argv.nrc+offset, 5));
		console.log('stdout:', stdout);
		console.log('stderr:', stderr)
		if (err !== null) {
		  console.log('Output: ' + error);
		}
	});
	
	children[offset].on('exit', function() {
		console.log("Finished.");
		
		if(numpad(argv.nrc, 5) == '100000') {
			console.log("REACHED 99999! Session is over.");
			process.exit(0);	
		}
		else {
			if(offset == argv.c) execNext();
		}
	});	
};

execNext();