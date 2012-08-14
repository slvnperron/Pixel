var querystring = require('querystring');  
var https = require('https');
var events = require('events');
var util = require('util');

var Login = new events.EventEmitter();

Login.login = function(username, password) {
    var login_data = querystring.stringify({  
        'code_utilisateur' : username, 
      	'password': password,
        'envoi': 'Se connecter'  
    });
    
    var opts = {
        host: 'pixel.fsg.ulaval.ca',
        port: 443,
        path: '/index.pl',
        method: 'POST',
        headers: {  
            'Content-Type': 'application/x-www-form-urlencoded' 
          } 
    };
    
    opts.headers['Content-Length'] = login_data.length;
    
    var post_req = https.request(opts, function(res) {  
        res.setEncoding('utf8');  
        res.on('data', function (chunk) {
        if(chunk.indexOf("Le nom d'utilisateur et le mot de passe ne correspondent pas.") != -1) { // Login failed
            console.log("Wrong login");
            process.exit(1);
        }
        else { // Login successful
            console.log("Logged in.");
            login_cookies = res.headers['set-cookie'];
            if (login_cookies) {
              login_cookies = (login_cookies + "").split(";").shift();
              opts.headers['Cookie'] = login_cookies;
              Login.emit('success', opts);
            }
        }
        });  
    });
   
    // write parameters to post body  
    post_req.write(login_data);  
    post_req.end();
    return Login;
};

module.exports = Login;
