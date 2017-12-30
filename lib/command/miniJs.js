(function() {
	var Fs = require('fs');
	var uglifyJs = require('uglify-js');
	this.command = function(command, callback) {
		/*try {
			require(process.cwd() + '/' + command.inPath);
		}catch(err) {
			console.log(err);
		}*/
		var data = Fs.readFileSync(command.inPath);
		var result = uglifyJs.minify([data.toString()]);
		if(result.code) {
			Fs.writeFile(command.outPath, result.code, callback);
		}else{
			console.log(result);
			result = uglifyJs.minify(['var a=' + data.toString()]);
			if(result.code) {
				Fs.writeFile(command.outPath, result.code.replace('var a=', ''), callback);
			}else{
				//throw result;
				console.log('miniJs Error', command.inPath);
				callback(result);
			}
		}
		
	}
}).call(module.exports);