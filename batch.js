var exec = require('child_process').exec;
var argv = require('optimist').argv;
var numpad = require('numpad');
var nrc = 0;
var child = exec('node spider.js --u SYPER54 --p b1idyq54 --session 201001 --nrc' + argv.nrc);
console.log("Ran with nrc:", argv.nrc);

child.on('exit', function() {
	exec('node batch.js --nrc' + numpad(argv.nrc, 5));
});