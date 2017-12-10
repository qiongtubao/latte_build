(function() {
	var Fs = require('fs');
	var uglifyJs = require('uglify-js');
	this.command = function(command, callback) {
		var data = Fs.readFileSync(command.inPath);
		var result = uglifyJs.minify([data.toString()]);
		if(result.code) {
			Fs.writeFile(command.outPath, result.code, callback);
		}else{
			result = uglifyJs.minify(['var a=' + data.toString()]);
			if(result.code) {
				Fs.writeFile(command.outPath, result.code.replace('var a=', ''), callback);
			}else{
				//throw result;
				callback(result);
			}
		}
		
	}
}).call(module.exports);