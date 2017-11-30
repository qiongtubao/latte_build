var make = require('../lib');
var json = require('./make.json');
make.make(json, 'copy', function(err) {
	console.log('copy', err);
});