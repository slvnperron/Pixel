var exec = require('child_process').exec;
var argv = require('optimist').argv;
var numpad = require('numpad');
var nrc = 0;
var child;
if(argv.c == undefined) argv.c = 1;

var databaseUrl = "127.0.0.1/pixel"; // "username:password@example.com/mydb"
var collections = ["courses"]
var db = require("mongojs").connect(databaseUrl, collections);

db.courses.find(function(err, co) {
	console.log("All courses (" + co.length + ")");
});

var execNext = function() {
	child = exec('node spider.js --u ' + argv.u + ' --p ' + argv.p + ' --s ' + argv.s + ' --nrc ' + numpad(argv.nrc, 5), function(err, stdout, stderr) {
		console.log('NRC#', numpad(argv.nrc, 5));
		console.log('stdout:', stdout);
		console.log('stderr:', stderr)
		if (err !== null) {
		  console.log('Output: ' + error);
		}
	});
	
	child.on('exit', function() {
		console.log("Finished.");
		
		if(numpad(argv.nrc, 5) == '100000') {
			console.log("REACHED 99999! Session is over.");
			process.exit(0);	
		}
		else {
			argv.nrc += argv.c;
			execNext();
		}
	});
};

execNext();