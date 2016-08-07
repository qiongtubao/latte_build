(function() {
	var latte_lib = require("latte_lib");
	var  toString = function() {
			var list = [];
			for(var i in this) {
				if( !latte_lib.isFunction(this[i]) ) {
					list.push(i+":"+this[i]); 
				}
			}
			return list.join(";");
		};
	this.create = function(css) {
		css = css || {};
		if(css.toString != toString) {
			css.toString = toString;
		}
		return css;
	}
}).call(module.exports);