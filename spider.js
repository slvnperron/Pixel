var opts; 

var https = require('https');
var querystring = require('querystring');  
var pSession = require('./session.js');
var login = require('./login.js').login;
var Nrc = require('./nrc.js');
var Seq = require('./seq.js');
var argv = require('optimist').argv;
var databaseUrl = "127.0.0.1/pixel"; // "username:password@example.com/mydb"
var collections = ["courses"]
var db = require("mongojs").connect(databaseUrl, collections);

if(argv.session == undefined) {
    console.log("You need to specify a session (--session)");
    process.exit(0);
}

if(argv.nrc == undefined) {
    console.log("You need to specify a NRC (--nrc)");
    process.exit(0);
}

if(argv.u == undefined) {
    console.log("You need to specify an username (--u)");
    process.exit(0);
}

if(argv.p == undefined) {
    console.log("You need to specify a password (--p)");
    process.exit(0);
}

var l = login(argv.u, argv.p);

l.on('success', function(opts) {
    var s = pSession.change(opts, argv.session);
    
    s.on('success', function(nOpts, sessionCode) {
        console.log("Session changed to", sessionCode);
        
        var course = Nrc.change(nOpts, argv.nrc);
        
        course.once('success', function(o, n, nrcHtml) {
            course.scrap(nrcHtml);
        });
        
        course.once('parsed', function(COURSE) {
            if(COURSE.number == '/') { 
                console.log("Not a course.");
                process.exit(0);
            }
           
		if(COURSE.seqs == undefined || COURSE.seqs[0] == undefined) {
			console.log("Not a faculty course.");
			process.exit(0);
		}

        COURSE.nrc = argv.nrc;
        COURSE.session = argv.session;
 
            var n = 0;
            var r;
            if(COURSE.exams.length >= 1) {
               r = Seq.load(opts, COURSE.exams[n].seq);
            }
            else {
               r = Seq.load(opts, COURSE.homeworks[n].seq);
            }
            
            r.on('success', function(fSeq, seqHtml) {
                if(++n < COURSE.seqs.length) {
                    r.load(opts, COURSE.seqs[n]);
                }
                
                r.parse(fSeq, seqHtml);
            });
            
            r.on('parsed', function(parsedSeq, results) {
                for(var o = 0; o < COURSE.exams.length; o++) {
                    if(COURSE.exams[o].seq == parsedSeq) {
                        COURSE.exams[o].results = results;
                        lookIfCompleted(COURSE);
                        return;
                    }
                }
                
                for(var o = 0; o < COURSE.homeworks.length; o++) {
                    if(COURSE.homeworks[o].seq == parsedSeq) {
                        COURSE.homeworks[o].results = results;
                        lookIfCompleted(COURSE);
                        return;
                    }
                }
            });
  
        });
        
    });
    
});

var lookIfCompleted = function(COURSE) {
    var cnt = 0;
	for(var o = 0; o < COURSE.exams.length; o++) {
        if(COURSE.exams[o].results) {
            cnt++;
        }
    }
                    
    for(var o = 0; o < COURSE.homeworks.length; o++) {
        if(COURSE.homeworks[o].results) {
            cnt++;
        }
    }
    
	if(cnt != COURSE.seqs.length) return;

    // SAVE TO DATABASE
    console.log("Saving to database...");
    
    db.courses.remove({session: COURSE.session, nrc: COURSE.nrc});    
	db.courses.save(COURSE);
    
    // EXIT SUCCESSFULLY
    console.log("Done.");
    process.exit(0);
}
