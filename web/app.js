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

	var queryObj = {};

	var regNrc = /NRC:\s"(.*?)"/i;
	var regTitle = /Titre:\s"(.*?)"/i;
	var regProfesseur = /Professeur:\s"(.*?)"/i;
	var regNum = /Numéro:\s"(.*?)"/i;
	var regProgramme = /Programme:\s"(.*?)"/i;
	var regYear = /Année:\s"(.*?)"/i;
	var regSession = /Session:\s"(.*?)"/i;

	if(regNrc.test(req.query.title)) {
		regNrc.exec(req.query.title);
		queryObj.nrc = parseInt(RegExp.$1);
		console.log("NRC " + RegExp.$1 + " taken.");
	}

	if(regTitle.test(req.query.title)) {
		regTitle.exec(req.query.title);
		queryObj.title = new RegExp(RegExp.$1, 'i');
		console.log("Titre " + RegExp.$1 + " taken.");
	}

	if(regProfesseur.test(req.query.title)) {
		regProfesseur.exec(req.query.title);
		queryObj.teachers = new RegExp(RegExp.$1, 'i');
		console.log("Professeur " + RegExp.$1 + " taken.");
	}

	if(regNum.test(req.query.title)) {
		regNum.exec(req.query.title);
		queryObj.number = new RegExp(RegExp.$1, 'i');
		console.log("Numéro " + RegExp.$1 + " taken.");
	}

	if(regProgramme.test(req.query.title)) {
		regProgramme.exec(req.query.title);
		queryObj.number = new RegExp(RegExp.$1, 'i');
		console.log("Programme " + RegExp.$1 + " taken.");
	}


	if(regYear.test(req.query.title)) {
		regYear.exec(req.query.title);
		queryObj.$where = "/" + RegExp.$1 + "/.test(this.session)";
		console.log("Année " + RegExp.$1 + " taken.");
	}

	if(regSession.test(req.query.title)) {
		regSession.exec(req.query.title);
		queryObj.$where = "/" + RegExp.$1 + "/.test(this.session)";
		console.log("Année " + RegExp.$1 + " taken.");
	}

	db.courses.find(queryObj).limit(25, function(err, data) {
    res.json(data);
	});
});

app.listen(8080);