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


// func must return a string
var commandList = {
	emote: {
		name: "/emote",
		desc: "Creates a random face",
		regex: /^\/emote$/,
		func: cool
	},
	roll: {
		name: "/roll",
		desc: "Roll the dice (1-100)",
		regex: /^\/roll$/,
		func: function() {
			var num = Math.floor(Math.random() * Math.floor(101)).toString();
			return req.name + " - " + num;
		}
	},
	math: {
		name: "/math",
		desc: "Solves math equations.",
		regex: /^\/math/,
		func: function() {
			var mathExpr = request.text.slice(5);
			console.log("Solving " + mathExpr);
			return req.name + " - " + mathExpr + " is " + limitedEval(mathExpr).toString();
		}
	},
};

function generateResponse(req) {
	var resp = false;

	for (var comm in commandList) {
		if (commandList.hasOwnProperty(comm)) {
			if(comm.regex.test(request.text)) {
				resp = comm.func();
				break;
			}
		}
	}

	return resp;
}

exports.generateResponse = generateResponse;

