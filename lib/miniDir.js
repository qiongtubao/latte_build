(function(define) {'use strict'
	define("latte_/lib/copy", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		var latte_lib = require("latte_lib")
 			, http = require("http")
 			, Path = require("path")
 			, Fs = latte_lib.fs;
 		/**
 			@namespace latte_build
 			@method copyFile
 			@param 	fIn {String}
 			@param 	fOut {String}
 			@param  callback {Function}
 		*/
 		var miniFile = function(fIn, fOut,callback) {
 			var type = Path.extname(fIn).substring(1);
 			switch(type) {
 				case "json":
 					var data = Fs.readFileSync(fIn);
					data = data.split("\n").join(" ");
					var t = [];
					var inString = false;
					for (var i = 0, len = data.length; i < len   ; i++) {
						var c = data.charAt(i);
						if (inString && c === inString  ) {
							// TODO: \\"
							if (data.charAt(i - 1) !== '\\') {
								inString = false;
							}
						} else if (!inString && (c === '"' || c === "'")) {
							inString = c;
						} else if (!inString && (c === ' ' || c === "\t")) {
							c = '';
						}
						t.push(c);
					}
					data= t.join('');
					Fs.writeFile(fOut , data, callback);
 				break;
 				case "js":
 					var result = uglifyJs.minify(fIn);
					var data = latte_lib.format.templateStringFormat(result.code, keys);
					Fs.writeFile(fOut , data, callback);
 				break;
 				default:
 					var readFileSteam = latte_lib.fs.createReadStream( fIn );
					var writeFileSteam = latte_lib.fs.createWriteStream( fOut );

				 	readFileSteam.pipe( writeFileSteam );
				 	readFileSteam.on("end", function() {
				 		callback();
				 	});
				 	readFileSteam.on("error", function(err) {
				 		callback(err);
				 	});
 				break;
 			}
 			
 		}
 		module.exports = miniFile;
 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
