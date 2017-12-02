(function() {
	var Fs = require('fs');
	var latte_lib = require('latte_lib');
	this.toJs = function(jsFile, alias, callback) {
		var fileData = fs.readFileSync(jsFile);
		var tempalteData = fs.readFileSync(__dirname + '/teamplateJs');
		return latte_lib.format.templateStringFormat(tempalteData.toString(), {
			path: alias,
			data: "module.exports = " + fileData.toString()
		});
	}
}).call(module.exports);