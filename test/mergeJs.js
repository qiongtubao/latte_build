var make = require('../lib');
var json = require('./make.json');
make.make(json, 'mergeJs', function(err) {
	console.log('mergeJs', err);
});