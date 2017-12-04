var make = require('../lib');
var json = require('./make.json');
make.make(json, 'miniImage', function(err) {
	console.log('miniImage', err);
});