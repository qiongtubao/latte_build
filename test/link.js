var make = require('../lib');
var json = require('./make.json');
make.make(json, 'link', function(err) {
	console.log('link', err);
});