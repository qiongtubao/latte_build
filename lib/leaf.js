(function(define) {'use strict'
	define("{{path}}", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		{{data}}
 	});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });