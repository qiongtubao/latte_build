(function() {
	var Fs = require('fs');
	var uglifyJs = require('uglify-js');
	this.command = function(command, callback) {
		var data = Fs.readFileSync(command.inPath);
		var result = uglifyJs.minify([data.toString()]);
		Fs.writeFile(command.outPath, result.code, callback);
	}
}).call(module.exports);