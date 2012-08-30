var express = require('express');
var app = express();
var databaseUrl = "127.0.0.1/pixel"; // "username:password@example.com/mydb"
var collections = ["courses"]
var db = require("mongojs").connect(databaseUrl, collections);
var inspect = require('util').inspect;

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use(express.bodyParser());

app.post('/title', function(req, res) {
	console.log(req.query);
	var instantEval = function() {
		if(this.title.indexOf(req.query.title) != -1) return true;
		return false;
	};

	db.courses.find(instantEval, function(err, data) {
    res.json(data);
	}).limit(10);
});

app.listen(8080);