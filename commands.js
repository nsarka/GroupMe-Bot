var cool = require('cool-ascii-faces');
var bot = require('./bot.js');
var db = require('./db.js');

// Math.js stuff
var math = require('mathjs');
var limitedEval = math.eval

// Make math.js more secure
math.import({
  'import': function () { throw new Error('Function import is disabled') },
  'createUnit': function () { throw new Error('Function createUnit is disabled') },
  'eval': function () { throw new Error('Function eval is disabled') },
  'parse': function () { throw new Error('Function parse is disabled') },
  'simplify': function () { throw new Error('Function simplify is disabled') },
  'derivative': function () { throw new Error('Function derivative is disabled') }
}, { override: true })


/* Callbacks look like this
{
  "attachments": [],
  "avatar_url": "https://i.groupme.com/123456789",
  "created_at": 1302623328,
  "group_id": "1234567890",
  "id": "1234567890",
  "name": "John",
  "sender_id": "12345",
  "sender_type": "user",
  "source_guid": "GUID",
  "system": false,
  "text": "Hello world ☃☃",
  "user_id": "1234567890"
}
*/


// func must return a string
var commandList = [
	{
		name: "/emote",
		desc: "Creates a random face",
		regex: /^\/emote$/,
		func: function(req, callback) {
			callback(cool());
		}
	},
	{
		name: "/roll",
		desc: "Roll the dice (1-100)",
		regex: /^\/roll$/,
		func: function(req, callback) {
			var num = Math.floor(Math.random() * Math.floor(101)).toString();
			callback(req.name + " - " + num);
		}
	},
	{
		name: "/math",
		desc: "Solves math equations i.e. sqrt(3^2 + sin(4*5)) / 2",
		regex: /^\/math/,
		func: function(req, callback) {
			var mathExpr = req.text.slice(5);
			console.log("Solving " + mathExpr);
			var ans, resp;

			try {
				ans = limitedEval(mathExpr);
	                        resp = req.name + " - " + mathExpr + " is " + ans.toString();
			} catch(err) {
				//console.log(err);
				resp = req.name + " - yo that expression is wack";
			}

			callback(resp);
		}
	},
        {
                name: "/remind <hours> <message>",
                desc: "Repeats <message> after <hours> hours. Hours can be decimals (0.5, 2.5, ...). FYI: If Big Chungus dies, the reminder won't go off.",
                regex: /^\/remind/,
                func: function(req, callback) {
                        var params = req.text.split(" ");
			var hours = params[1];

			var nonmsg = params[0] + " " + params[1];
			var msg = req.text.slice(nonmsg.length + 1);

                        console.log("Setting reminder for " + msg + " in " + hours + " hour(s)");

			setTimeout(function() {
				bot.postMessage(req.name + " - Reminder: " + msg);
			}, hours * 60 * 60 * 1000); // ms

			var resp = req.name + " - " + "Setting reminder for " + msg + " in " + hours + " hour(s)";
			callback(resp);
                }
        },
	{
		name: "/getgbp",
		desc: "Gets your current Good Boy Points",
		regex: /^\/getgbp/,
		func: function(req, callback) {
			// This callback stuff is confusing af
			db.getUserGbp(req.sender_id, function(gbp) {
	                        callback(req.name + " - " + gbp.toString());
			});
		}
	},
        {
                name: "/setgbp <gbp>",
                desc: "Sets your current Good Boy Points",
                regex: /^\/setgbp/,
                func: function(req, callback) {
			var params = req.text.split(" ");
                        db.setUserGbp(req.sender_id, parseInt(params[1]));
                        callback(req.name + " - Set gbp to " + params[1]);
                }
        }
];


function generateResponse(req, callback) {
	var resp = false;

	for(var i = 0; i < commandList.length; i++) {
		var comm = commandList[i];
                if(comm.regex.test(req.text)) {
			resp = true;
                        comm.func(req, (response) => {
	                        callback(response);
			});
			break;
        	}
	};

	// Send them the help message for /help
	if(!resp && /^\/help$/.test(req.text)) {
		resp = "Go to http://sarka.io to read a list of available commands";
	        callback(resp);
	}
}

exports.generateResponse = generateResponse;
exports.commandList = commandList;

