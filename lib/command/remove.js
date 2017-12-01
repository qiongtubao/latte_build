(function() {
	var fs = require('fs');
	this.command = function(command, callback) {
		fs.unlink(command.path, callback);
	}
}).call(module.exports);