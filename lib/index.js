(function() {
	var latte_lib = require('latte_lib');
	var makeCallback = function(c) {
		return function(cb) {
			console.log('cccc',c);
			var command = require("./command/" + c.type);
			command.command(c, cb);
		}
	}
	var make = function(value, json , map) {
		Object.keys(value).forEach(function(key) {
			if(latte_lib.isArray(value[key])) {
				map[key] = value[key].map(function(v) {
					if(latte_lib.isString(v)) {
						if(value[v]) {
							return v;
						}else if(json[v]){
							make(json[v], json, map);
							return v;
						}else{
							throw new Error('param Error');
						}
					}else{
						return makeCallback(v);
					}
				});
			}else{
				console.log(value[key]);
				map[key] = makeCallback(value[key])
			}
		});
	}
	this.make = function(json, key, callback) {
		var value = json[key];
		if(value === undefined) {
			return callback(new Error("param error"));
		}
		var map = {};
		make(value, json, map);
		latte_lib.async.auto(map, callback);
	}
}).call(module.exports);