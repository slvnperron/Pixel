var querystring = require('querystring');  
var https = require('https');
var events = require('events');
var util = require('util');

var Session = new events.EventEmitter();

Session.change = function(opts, sessionCode) {
    console.log('changing session to', sessionCode);
    opts.path = "/cadre_gauche.pl?code_session=" + sessionCode;
    opts.method = 'GET';
    opts.headers['Content-Length'] = null;
    
    var nOpts = { host: opts.host, path: opts.path, port: opts.port, headers:{ Cookie: opts.headers.Cookie}};
    
https.get(nOpts, function(res) {
    res.setEncoding('utf8');
  res.on('data', function(d) {
    Session.emit('success', nOpts, sessionCode);
  });

}).on('error', function(e) {
  console.error(e);
});
   
    return Session;
};

module.exports = Session;
