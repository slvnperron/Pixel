var exec = require('child_process').exec;
var argv = require('optimist').argv;
var numpad = require('numpad');
var databaseUrl = "127.0.0.1/pixel"; // "username:password@example.com/mydb"
var collections = ["courses"]
var db = require("mongojs").connect(databaseUrl, collections);

db.courses.find(function(err, docs) {
	console.log("All courses (" + docs.length + ")");
});