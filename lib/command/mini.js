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
    var mini = function(fromPath, toPath, callback) {
    	var stat = Fs.statSync(fromPath);
    	if(stat.isFile()) {
    		miniFile(fromPath, toPath, callback);
		}else{
			miniDir(fromPath, toPath, callback);
		}
    }
	var miniDir = function(fromPath, toPath, callback) {
		console.log(fromPath, toPath);
		mkdir(toPath, 0777, function() {
			var files = Fs.readdirSync(fromPath);
			var all = files.map(function(file) {
				return function(cb) {
					mini(fromPath + '/' + file, toPath + '/'+ file , cb);
				}

			});
			latte_lib.async.parallel(all, callback);		
		});
		

	}
	var miniFile = function(fromPath, toPath, callback) {
          //@finding best function
      	/*try {
	        var from = Fs.createReadStream(fromPath);
	        mkdir(Path.dirname(toPath), null, function(error) {
	          var to = Fs.createWriteStream(toPath);
	          from.pipe(to);
	          callback(null);
	        });
      	}catch(e) {
        	callback(e);
      	}*/
      	var type = Path.extname(fromPath);
      	switch(type) {
      		case '.js':
      			require('./miniJs').command({
      				inPath: fromPath,
      				outPath: toPath
      			}, callback);
      		break;
      		case '.jpg':
      		case '.png':
      			require('./miniImage').command({
      				inPath: fromPath,
      				outPath: toPath
      			}, callback);
      		break;
      		case '.css':
      			require('./miniCss').command({
      				inPath: fromPath,
      				outPath: toPath
      			}, callback);
      		break;
      		default:
      			require('./copy').command({
      				inPath: fromPath,
      				outPath: toPath
      			}, callback);
      		break;
      	}

    }
	this.command = function(command, callback) {
		mini(command.inPath, command.outPath, callback);
	}
}).call(module.exports);