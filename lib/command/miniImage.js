(function() {
	var Fs = require('fs');
	var cleanCss = require('clean-css');
	var imagemin = require('imagemin');
	var imageminJpegtran = require('imagemin-jpegtran');
	var imageminPngquant = require('imagemin-pngquant');
	console.log(cleanCss);
	this.command = function(command, callback) {
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
}).call(module.exports);