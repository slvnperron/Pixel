var express = require('express');
var app = express();

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.post('/query', function(req, res) {
    res.send('Username: ');
});

app.listen(8080);