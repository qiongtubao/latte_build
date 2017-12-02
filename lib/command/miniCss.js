(function() {
	var Fs = require('fs');
	var cleanCss = require('clean-css');
	console.log(cleanCss);
	this.command = function(command, callback) {
		var data = Fs.readFileSync(command.inPath);
		var c = new cleanCss({});
		var result = c.minify(data.toString());
		Fs.writeFile(command.outPath, result.styles, callback);
	}
}).call(module.exports);