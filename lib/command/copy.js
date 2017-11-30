(function() {
	var Fs = require('fs');
	var latte_lib = require('latte_lib');
	var Path = require('path');
	var mkdir = function(path, options, callback) {
      	Fs.exists(path, function(exists) {
			if(exists) {
				callback(null, path);
			}else{
				mkdir(Path.dirname(path), options, function(err) {
			  		if(err) { return callback(err); }
				  	Fs.mkdir(path, options, callback);
				});
			}
      	});
    }
    var copy = function(fromPath, toPath, callback) {
    	var stat = Fs.statSync(fromPath);
    	if(stat.isFile()) {
    		copyFile(fromPath, toPath, callback);
		}else{
			copyDir(fromPath, toPath, callback);
		}
    }
	var copyDir = function(fromPath, toPath, callback) {
		console.log(fromPath, toPath);
		mkdir(toPath, 0777, function() {
			var files = Fs.readdirSync(fromPath);
			var all = files.map(function(file) {
				return function(cb) {
					copy(fromPath + '/' + file, toPath + '/'+ file , cb);
				}
			});
			latte_lib.async.parallel(all, callback);		
		});
		

	}
	var copyFile = function(fromPath, toPath, callback) {
          //@finding best function
      	try {
	        var from = Fs.createReadStream(fromPath);
	        mkdir(Path.dirname(toPath), null, function(error) {
	          var to = Fs.createWriteStream(toPath);
	          from.pipe(to);
	          callback(null);
	        });
      	}catch(e) {
        	callback(e);
      	}
    }
	this.command = function(command, callback) {
		copy(command.inPath, command.outPath, callback);
	}
}).call(module.exports);