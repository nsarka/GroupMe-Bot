var cool = require('cool-ascii-faces');

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
		func: function(req) {
			return cool();
		}
	},
	{
		name: "/roll",
		desc: "Roll the dice (1-100)",
		regex: /^\/roll$/,
		func: function(req) {
			var num = Math.floor(Math.random() * Math.floor(101)).toString();
			return req.name + " - " + num;
		}
	},
	{
		name: "/math",
		desc: "Solves math equations.",
		regex: /^\/math/,
		func: function(req) {
			var mathExpr = req.text.slice(5);
			console.log("Solving " + mathExpr);
			var ans;

			try {
				ans = limitedEval(mathExpr);
	                        return req.name + " - " + mathExpr + " is " + ans.toString();
			} catch(err) {
				//console.log(err);
				return req.name + " - yo that expression is wack";
			}
		}
	},
];


function generateResponse(req) {
	var resp = false;

	for(var i = 0; i < commandList.length; i++) {
		var comm = commandList[i];
                if(comm.regex.test(req.text)) {
                        resp = comm.func(req);
			break;
        	}
	};

	// Send them the help message for /help
	if(!resp && /^\/help$/.test(req.text)) {
		resp = "Go to http://sarka.io to read a list of available commands";
	}

	return resp;
}

exports.generateResponse = generateResponse;

