var make = require('../lib');
var json = require('./make.json');
make.make(json, 'miniJs', function(err) {
	console.log('mini', err);
});