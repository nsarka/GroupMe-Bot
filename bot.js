var HTTPS = require('https');
var commands = require('./commands.js');

require('dotenv').config();

// Printidk means bot will print it cant do a command it was given instead of ignoring it
var botID = process.env.BOT_ID;
var botPrintIdk = process.env.BOT_PRINT_IDK;
var nodeEnv = process.env.NODE_ENV;

console.log("BOT_ID=" + botID);
console.log("BOT_PRINT_IDK=" + botPrintIdk);

function respond() {
  var request = JSON.parse(this.req.chunks[0]);

  // Command begins with a slash
  var botRegex = /^\//;

  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);

    var idkMsg = request.name + " - wtf does that even MEAN. Type /help";
    var resp = commands.generateResponse(request);

    if(!resp && botPrintIdk) {
        postMessage(idkMsg);
    } else {
        postMessage(resp);
    }

    this.res.end();
  } else {
    // Not a message the bot cares about
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(botResponse) {
  var options, body, botReq;

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('Sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('Rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('Error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('Timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}

if(nodeEnv == "production") {
	postMessage("Big Chungus died a horrible death and had to be restarted");
}

exports.respond = respond;
exports.postMessage = postMessage;

