(function() {
	var Fs = require('fs');
	var latte_lib = require('latte_lib');
	this.toJs = function(jsFile, alias, callback) {
		var fileData = Fs.readFileSync(jsFile);
		var tempalteData = Fs.readFileSync(__dirname + '/teamplateJs');
		return callback(null,latte_lib.format.templateStringFormat(tempalteData.toString(), {
			path: alias,
			data: "module.exports = '" + fileData.toString().replace(/[\n]/, "\\n").replace(/'/g, '\"') + "'"
		}));
	}
}).call(module.exports);