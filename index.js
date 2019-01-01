var http, director, cool, bot, router, server, port;

http        = require('http');
director    = require('director');
cool        = require('cool-ascii-faces');
bot         = require('./bot.js');
commandList = require('./commands.js').commandList;

// Grab environment variables from .env file
//require('dotenv').config();

router = new director.http.Router({
  '/' : {
    post: bot.respond,
    get: help_page
  }
});

server = http.createServer(function (req, res) {
  req.chunks = [];
  req.on('data', function (chunk) {
    req.chunks.push(chunk.toString());
  });

  router.dispatch(req, res, function(err) {
    res.writeHead(err.status, {"Content-Type": "text/plain"});
    res.end(err.message);
  });
});

port = Number(process.env.PORT || 5000);
console.log("Listening on port " + port);
server.listen(port);

function listCommands() {
	var commands = "";

        for(var i = 0; i < commandList.length; i++) {
                var comm = commandList[i];
		commands += comm.name + ": " + comm.desc + "\n";
        };

	return commands;
}

function help_page() {
  this.res.writeHead(200);
  this.res.end("Big Chungus Says...\n\nAvailable commands are:\n\n" + listCommands());
}
