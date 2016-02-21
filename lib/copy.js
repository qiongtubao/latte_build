(function(define) {'use strict'
	define("latte_/lib/copy", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		var latte_lib = require("latte_lib")
 			, http = require("http");
 		/**
 			@namespace latte_build
 			@method copyFile
 			@param 	fIn {String}
 			@param 	fOut {String}
 			@param  callback {Function}
 		*/
 		var copyFile = function(fIn, fOut,callback) {
 			var readFileSteam = latte_lib.fs.createReadStream( fIn );
			var writeFileSteam = latte_lib.fs.createWriteStream( fOut );
		 	readFileSteam.pipe( writeFileSteam );
		 	readFileSteam.on("end", function() {
		 		callback();
		 	});
		 	readFileSteam.on("error", function(err) {
		 		callback(err);
		 	});
 		}
 		module.exports = copyFile;
 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
