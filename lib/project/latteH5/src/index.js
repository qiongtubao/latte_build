var latte_lib = require("latte_lib");
var latteView = latte.require("latte_view");
var route = require("./route");
var latteView = latteView.create("latte");
latteView.route(route);