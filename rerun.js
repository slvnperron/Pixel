var exec = require('child_process').exec;
var argv = require('optimist').argv;
var numpad = require('numpad');
var databaseUrl = "127.0.0.1/pixel"; // "username:password@example.com/mydb"
var collections = ["courses"]
var db = require("mongojs").connect(databaseUrl, collections);

var nrcs = [];
var index = 0;

db.courses.find(function(err, docs) {
	console.log("All courses (" + docs.length + ")");

	nrcs = docs;
	index = 0;
	execNext();
});

var execNext = function() {

	if((argv.s.substring(5) == '1' && nrcs[index].nrc.substring(0,1) != '1') ||
		(argv.s.substring(5) == '5' && nrcs[index].nrc.substring(0,1) != '5') ||
		(argv.s.substring(5) == '9' && nrcs[index].nrc.substring(0,1) != '8')) {
		index++;
		execNext();
		return;
	}

	child = exec('node spider.js --u ' + argv.u + ' --p ' + argv.p + ' --s ' + argv.s + ' --nrc ' + nrcs[index].nrc, function(err, stdout, stderr) {
		console.log('NRC#', nrcs[index].nrc);
		console.log('stdout:', stdout);
		console.log('stderr:', stderr);

		if (err !== null) {
		  console.log('Output: ' + error);
		}
	});
	
	child.on('exit', function() {
		index++;
		execNext();
	});
};
