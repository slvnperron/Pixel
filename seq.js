var querystring = require('querystring');  
var https = require('https');
var events = require('events');
var util = require('util');
var jsdom = require('jsdom');

var Seq = new events.EventEmitter();

Seq.load = function(opts, seq) {
    console.log('Loading seq', seq);
    opts.path = "/liste_cours/fiche_popup_stat_epreuve.pl?seq_epreuve=" + seq;
    
https.get(opts, function(res) {
  res.setEncoding('utf8');
  
  var pageHtml = '';	
			
  res.on('data', function(ds) {
    pageHtml += ds;
  });
  
  res.on('end', function() {
    Seq.emit('success', seq, pageHtml);
  });

}).on('error', function(e) {
  console.error(e);
});
   
    return Seq;
};

Seq.parse = function(seq, html) {
    jsdom.env(html, ['./jquery.js'],
    function(errors, window) {
    
        var elems = window.$("td[class='Form_Texte']").toArray();
        
        Seq.emit('parsed', seq, {
            average: window.$(elems[0]).text().trim(),
            mediane: window.$(elems[1]).text().trim(),
            derivation: window.$(elems[2]).text().trim(),
            minimum: window.$(elems[3]).text().trim(),
            maximum: window.$(elems[4]).text().trim(),
            ponderation: window.$(elems[5]).text().trim(),
            count: window.$(elems[6]).text().trim()
        });
        
    });
}

module.exports = Seq;
