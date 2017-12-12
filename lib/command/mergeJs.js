(function() {
	var latte_lib = require('latte_lib');
	var Path = require("path");
	var mergeFile = function(fromPath, alias, callback) {
		var type =Path.extname(fromPath).substring(1);
		//latte_lib.fs.mkdirSync(Path.dirname(toPath), 0777);

		var data = require('./mergeJs/' + type + "File").toJs(fromPath, alias, callback);
		//callback(null, data);
	}
	var mergeDir = function(fromPath, alias, callback) {
		var files = latte_lib.fs.readdirSync(fromPath);
		var all = files.map(function(file) {
			return function(cb) {
				merge(fromPath + '/' + file, alias + '/' + file ,cb);
			}
		});
		latte_lib.async.parallel(all, function(err, data) {
			if(err) {
				return callback(err);
			}
			callback(null, data.join("\n"));
		});	
	}
	var merge = function(fromPath, alias, callback) {
		var stat = latte_lib.fs.statSync(fromPath);
    	if(stat.isFile()) {
    		mergeFile(fromPath, alias, callback);
		}else{
			mergeDir(fromPath, alias, callback);
		}
	}
	this.command = function(command, callback) {
		merge(command.inPath, command.alias, function(err, data) {
			if(err) {
				return callback(err)
			}
			latte_lib.fs.mkdirSync(Path.dirname(command.outPath));
			if(command.root) {
				var rootFile = latte_lib.fs.readFileSync(__dirname + "/mergeJs/root.js");
				data = rootFile + data; 
			}
			latte_lib.fs.writeFileSync(command.outPath,  data);
			callback();
		});

	}
}).call(module.exports);