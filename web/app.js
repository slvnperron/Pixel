var express = require('express');
var app = express();

app.post('/query', function(req, res){
  res.send('hello world');
});

app.listen(8080);