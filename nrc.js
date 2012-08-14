var querystring = require('querystring');  
var https = require('https');
var events = require('events');
var util = require('util');
var jsdom = require('jsdom');

var Nrc = new events.EventEmitter();

Nrc.change = function(opts, nrc) {
    console.log('changing nrc to', nrc);
    opts.path = "/liste_cours/sommaire_cours_popup_fiche_etudiant.pl?source_appel=principal&submit_action=Detailler&nrc=" + nrc;
    
https.get(opts, function(res) {
  res.setEncoding('utf8');
  
  var pageHtml = '';	
			
  res.on('data', function(ds) {
    pageHtml += ds;
  });
  
  res.on('end', function() {
    Nrc.emit('success', opts, nrc, pageHtml);
  });

}).on('error', function(e) {
  console.error(e);
});
   
    return Nrc;
};

Nrc.scrap = function(html) {
    jsdom.env(html, ['./jquery.js'],
    function(errors, window) {
        var COURSE = {};
        var fullTitle = window.$("td[class='Boite_Entete_Popup_Texte']").text().trim();
        fullTitle.match(/^(.+)\s+\(\d+\)(.+?)$/m);
        COURSE.number = RegExp.$1.trim();
        COURSE.title = RegExp.$2.trim();
        COURSE.plan = window.$("table td tr:has(td > b:contains('Plan de cours')) tr:last-child").text().trim();
        COURSE.description = window.$("table td tr:has(td > b:contains('Description')) tr:last-child").text().trim();
        COURSE.teachers = window.$("table td tr:has(td > b:contains('Enseignant')) tr:last-child").text().trim();
        COURSE.helpers = window.$("table td tr:has(td > b:contains('Responsable')) tr:last-child").text().trim();
        COURSE.website = window.$("table td tr:has(td > b:contains('Site Web')) tr:last-child").text().trim();
        COURSE.mails = window.$("table td tr:has(td > b:contains('Liste de courriel')) tr:last-child").text().trim();
        COURSE.comment = window.$("table td tr:has(td > b:contains('Commentaire')) tr:last-child").text().trim();
        COURSE.count = window.$("table td tr:has(td > b:contains('Nombre')) tr:last-child").text().trim();
        
        COURSE.exams = [];
        COURSE.homeworks = [];
        COURSE.seqs = [];
        
        var seqs = window.$("a:contains('Statistiques')").each(function(i) {
            window.$(this)[0].outerHTML.match(/seq_epreuve=(\d+)/);
            COURSE.seqs.push(RegExp.$1);
        });
        
        var examens = window.$("table td tr:has(td > b:contains('Examens')) table td").toArray();
        
        for(var i = 0; i < examens.length / 16; i++) {
            var exam = {
              title: window.$(examens[i * 16]).text().trim(),
              date: window.$(examens[i * 16 + 2]).text().trim(),
              time: window.$(examens[i * 16 + 3]).text().trim(),
              place: window.$(examens[i * 16 + 5]).text().trim(),
              ponderation: window.$(examens[i * 16 + 10]).text().trim(),
              docs: window.$(examens[i * 16 + 14]).text().trim(),
              seq: COURSE.seqs[i]
            };
            
            COURSE.exams.push(exam);
        }
        
        var homeworks = window.$("table td tr:has(td > b:contains('Travaux')) table td").toArray();
        
        for(var i = 0; i < homeworks.length / 16; i++) {
            var hw = {
              title: window.$(homeworks[i * 16]).text().trim(),
              date: window.$(homeworks[i * 16 + 2]).text().trim(),
              time: window.$(homeworks[i * 16 + 3]).text().trim(),
              team: window.$(homeworks[i * 16 + 6]).text().trim(),
              ponderation: window.$(homeworks[i * 16 + 11]).text().trim(),
              seq: COURSE.seqs[i + COURSE.exams.length]
            };
            
            COURSE.homeworks.push(hw);
        }
        
        Nrc.emit('parsed', COURSE);
    });
}

module.exports = Nrc;
