(function() {
	var fs = require('fs');
	this.command = function(command, callback) {
		fs.symlink(command.inPath, command.outPath, callback);
	}
}).call(module.exports);