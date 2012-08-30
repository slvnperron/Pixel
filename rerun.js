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

});

var execNext = function() {
	child = exec('node spider.js --u ' + argv.u + ' --p ' + argv.p + ' --s ' + nrcs[index].session + ' --nrc ' + numpad(nrcs[index].nrc, 5), function(err, stdout, stderr) {
		console.log('NRC#', numpad(argv.nrc, 5));
		console.log('stdout:', stdout);
		console.log('stderr:', stderr)
		if (err !== null) {
		  console.log('Output: ' + error);
		}
	});
	
	child.on('exit', function() {
		index++;
		execNext();
		}
	});
};