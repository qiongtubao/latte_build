var make = require('../lib');
var json = require('./make.json');
make.make(json, 'mini', function(err) {
	console.log('mini', err);
});