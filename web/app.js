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


	var regNrc = /NRC:\s"(.*?)"/i;
	regNrc.exec(req.query.title);
	console.log("NRC : " + RegExp.$1);
	console.log(regNrc.test(req.query.title));



	db.courses.find({title: new RegExp(req.query.title, 'i')}).limit(25, function(err, data) {
    res.json(data);
	});
});

app.listen(8080);