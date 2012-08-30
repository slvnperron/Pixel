var express = require('express');
var app = express();
var databaseUrl = "127.0.0.1/pixel"; // "username:password@example.com/mydb"
var collections = ["courses"]
var db = require("mongojs").connect(databaseUrl, collections);

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use(express.bodyParser());

app.post('/query', function(req, res) {

	var instantEval = function() {
		if(typeof(res.body.NRC) != 'undefined' && res.body.NRC == this.NRC) return true;
	};

	db.courses.find(instantEval, function(err, data) {
    res.json(data);
	}).limit(10);
});

app.listen(8080);