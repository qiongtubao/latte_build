var make = require('../lib');
var json = require('./make.json');
make.make(json, 'remove', function(err) {
	console.log('remove', err);
});