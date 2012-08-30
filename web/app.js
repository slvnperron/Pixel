var express = require('express');
var app = express();

app.post('/query', function(req, res) {

	res.writeHead(200, {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
});

    res.send('Username: ');
});

app.listen(8080);