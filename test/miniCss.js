var make = require('../lib');
var json = require('./make.json');
make.make(json, 'miniCss', function(err) {
	console.log('miniCss', err);
});