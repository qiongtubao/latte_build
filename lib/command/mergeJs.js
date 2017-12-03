(function() {
	var latte_lib = require('latte_lib');
	var Path = require("path");
	var mergeFile = function(fromPath, alias, toPath, callback) {
		var type =Path.extname(fromPath).substring(1);
		latte_lib.fs.mkdirSync(Path.dirname(toPath), 0777);

		var data = require('./mergejs/' + type + "File").toJs(fromPath, alias);
		callback(null, data);
	}
	var mergeDir = function(fromPath, alias, toPath, callback) {
		var files = latte_lib.fs.readdirSync(fromPath);
		var all = files.map(function(file) {
			return function(cb) {
				merge(fromPath + '/' + file, alias + '/' + file, toPath + '/'+ file ,cb);
			}
		});
		latte_lib.async.parallel(all, function(err, data) {
			if(err) {
				return callback(err);
			}
			callback(null, data.join("\n"));
		});	
	}
	var merge = function(fromPath, alias, toPath, callback) {
		var stat = latte_lib.fs.statSync(fromPath);
		var cb = function(err, data) {
			if(err) {
				return callback(err)
			}
			latte_lib.fs.writeFileSync(toPath, data);
			callback();
		}
    	if(stat.isFile()) {
    		mergeFile(fromPath, alias, toPath, cb);
		}else{
			mergeDir(fromPath, alias, toPath, cb);
		}
	}
	this.command = function(command, callback) {
		merge(command.inPath, command.alias, command.outPath, callback);

	}
}).call(module.exports);