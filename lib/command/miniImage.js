(function() {
	var Fs = require('fs');
	var cleanCss = require('clean-css');
	var imagemin = require('imagemin');
	var imageminJpegtran = require('imagemin-jpegtran');
	var imageminPngquant = require('imagemin-pngquant');
	var Path = require('path');
	console.log(cleanCss);
	this.command = function(command, callback) {
		var stat = Fs.statSync(command.inPath);
    	if(stat.isFile()) {
    		var dir = Path.dirname(command.outPath);
    		imagemin([command.inPath], dir, {
				plugins: [
					imageminJpegtran(),
					imageminPngquant({
						quality: '65-80'
					})
				]
			}).then(function(files) {
				console.log(files);
				if(command.outPath != files[0].path) {
					fs.rename(files[0].path, command.outPath, callback);
				}else{
					callback();
				}
			
			});
		}else{
			imagemin([command.inPath+'/*.{jpg,png}'], command.outPath, {
				plugins: [
					imageminJpegtran(),
					imageminPngquant({
						quality: '65-80'
					})
				]
			}).then(function(files) {
				console.log(files);
				callback();
			});
		}
		
	}
}).call(module.exports);