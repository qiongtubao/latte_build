(function() {
	var Fs = require('fs');
	var latte_lib = require('latte_lib');
	this.toJs = function(jsFile, alias, callback) {
		var fileData = fs.readFileSync(jsFile);
		//var tempalteData = fs.readFileSync(__dirname + '/teamplateJs');
		return ['(function(define) {\'use strict\'',
				'define("' + alias+ '", ["require", "exports", "module", "window"],',
			 	'function(require, exports, module, window) {',
			 		fileData.toString()
			 	'});',
				'})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });'].join("\n");
	}
}).call(module.exports);