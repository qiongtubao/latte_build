(function(define) {'use strict'
	define("latte_build/lib/child", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		process.on("message", function(m) {
 			switch(m.type) {
 				case "copy":
 					require("./copy")(m.key, m.value, m.mini, function(err, result) {
 						if(err) {
 							return process.send({
 								err: err,
 								key: m.key,
 								value: m.value
 							});
 						}else{
 							process.send({
 								key: m.key
 							});
 						}
 					}, m.keys);
 				break;
 				
 			} 
 			
 		});
 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
