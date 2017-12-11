(function() {
	var Fs = require('fs');
	var latte_lib = require('latte_lib');
	var Path = require('path');
	this.toJs = function(jsFile, alias, callback) {
		var fileData = Fs.readFileSync(jsFile);
		try {
			var js = require(Path.normalize(process.cwd() +'/'+jsFile));
		}catch(err) {
			if(err instanceof SyntaxError) {
				return callback(new Error(jsFile + " code Error" ));
			} 
			
		}
		//var tempalteData = fs.readFileSync(__dirname + '/teamplateJs');
		callback(null, ['(function(define) {\'use strict\'',
				'\tdefine("' + alias+ '", ["require", "exports", "module", "window"], function(require, exports, module, window) {',
			 		"\t\t"+fileData.toString().split("\n").join("\n\t\t"),
			 	'\t});',
				'})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });'].join("\n")
		);
	}
}).call(module.exports);