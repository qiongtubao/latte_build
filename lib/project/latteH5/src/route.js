var latte_lib = require("latte_lib");
var route = latte_lib.object.create(
	{
		index: "latte",
		latte: require("./latte/index.js")
	}
);
route.go = function(path) {
	route.set("index", path);
};
module.exports = route;