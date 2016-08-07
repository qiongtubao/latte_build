(function() {
	var latte_lib = require("latte_lib")
		, Css = require("./css");

		var basicHtml = latte_lib.fs.readFileSync(__dirname+"/basic.html");
		var text2Html = function(config, data) {
			config.attrs.style["margin"] = "0px"
			var widget = widgets(config);
			if(config.text) {
				var names = getName(config.text, "{{", "}}");
				
				names.forEach(function(key) {
					data[key] = "string";
				});	
				
			}
			return latte_lib.format.templateStringFormat(basicHtml, {
				type: config.tag || "p",
				latte_dom_widget: widgets(config)
			});
		}

		var widgets = function(config) {
			var widgets = [];
			for(var i in config.attrs) {
				widgets.push(i+"='" + config.attrs[i].toString()+"'");
			}
			return  widgets.join(" ");
		}



		var getWidth = function(config) {
			if(config.width) {
				return config.width;
			} 
			return null;
		}
		var getHeight = function(config) {
			if(config.height) {
				return config.height;
			}
			return null;
		}
		var view2Html = function(config) {
			switch(config.layout) {
				case "horizontal":
					var allWidth = 0; 
					var ol; 

					config.childs.forEach(function(c) {
						c.attrs = c.attrs || {};
						c.attrs.style = Css.create(c.attrs.style);
						c.attrs.style.float = "left";
						if(!getWidth(c)) {
							ol = c;
						}else{
							allWidth += getWidth(c);
						}
					});
					var width = getWidth(config) ; 
					ol.attrs  = ol.attrs || {};
					ol.attrs.style =   Css.create(ol.attrs.style || ol.style);
			
					 if(width) { 
					 	ol.width = (width - allWidth)  
					 }else{
					 	ol.attrs.style.width = "calc(100% - "+allWidth+"px)";
					 } 
					 
				break;
				case "vertical":
					var allHeight = 0;
					var ol;
					config.childs.forEach(function(c) {
						c.attrs = c.attrs || {};
						if(!getHeight(c)) {
							ol = c;
						}else{
							allHeight += getHeight(c);
						}
						
					});
					var height = getHeight(config);
					if(!ol) {
						console.log(config);
						return;
					}
					ol.attrs  = ol.attrs || {};
					ol.attrs.style =   Css.create(ol.attrs.style || ol.style);
			
					if(height) {
						ol.height = (height - allHeight);
					}else{
						
						ol.attrs.style.height = "calc(100% - "+allHeight+"px)";
					}
				break;
			}
			
			return latte_lib.format.templateStringFormat(basicHtml, {
				type: config.tag || "div",
				latte_dom_widget:widgets(config)
			});
		}
		/**
			var bs = width / info.width 
			var div = Dom.createElement("div");
			div.style.overflow = "hidden";
			div.style.position = "relative";
			div.style.width= "100%";
			div.style.height= "100%";
			var img = Dom.createElement("img");
			img.width = infos.width * bs ;
			//img.height = height;
			img.src = ImagesMap[path].urlData;
			img.style.position = "absolute";
			img.style.left = "-" + info.x * bs +"px";
			img.style.top = "-" + info.y * bs+ "px";
		*/
		var imageHtml = "<div></div>";
		var getName = function(str, a, b) {
			var result = [];
			var startIndex = 0;
			while(startIndex != -1) {
				var s = str.indexOf(a, startIndex);
				if(s == -1) {
					break;
				}
				var e = str.indexOf(b , s);
				if(e == -1) {
					break;
				}
				result.push(str.substring(s+2, e));
				startIndex = e + 2;
			}
			
			return result;
		}
		var image2Html = function(config, data) {
			config.attrs = config.attrs || {};
			if(config.width) {
				config.attrs["latte-width"] = config.width;
			}

			if(config.height) {
				config.attrs["latte-height"] = config.height;
			}
			if(config.src) {
				config.attrs["latte-src"] = config.src;
				var names = getName(config.src, "{{", "}}");
				
				names.forEach(function(key) {
					data[key] = "string";
				});
			}
			//data[config.src] = "string";
			return latte_lib.format.templateStringFormat(basicHtml, {
				type: config.tag || "img",
				latte_dom_widget: widgets(config)
			});
		}
		var window2Html = function(config, data) {
			
			data.title = "title";
			data.left = 100;
			data.top = 100;
			data.zIndex = 100;
			data.width = 500;
			data.height = 500;
			data.show = true;
			data.close = function() {
				this.set("show", false);
			}
			data.open = function() {
				this.set("show", true)
			}
			
			config.attrs["latte-window"] = config.window;

			return latte_lib.format.templateStringFormat(basicHtml, {
				type: "div",
				latte_dom_widget: widgets(config)
			});
		}

		var editor2Html = function(config, data) {
			
			data.text="ace";
			data.type="js";
			config.attrs["latte-editor"] = config.editor;

			return latte_lib.format.templateStringFormat(basicHtml, {
				type: config.tag || "div",
				latte_dom_widget: widgets(config)
			});
		}

		var list2Html = function(config, data) {
			var one = {};
			//console.log(config.childs[0]);
			compile2Html(config.childs[0], one);
			data[config.list] = [one];
			config.attrs["latte-list"] = config.list ;
			return latte_lib.format.templateStringFormat(basicHtml, {
				type: config.tag || "div",
				latte_dom_widget: widgets(config)
			});
		}
	
		var page2Html = function(config, data) {
			config.attrs["latte-page"] = config.page ;
			return latte_lib.format.templateStringFormat(basicHtml, {
				type: config.tag || "div",
				latte_dom_widget: widgets(config)
			});
		}


		var doit = function(config, data) {
			//console.log(config.attrs.css);
			if(config.width) {
				
			 	config.attrs.style.width = config.width+"px";
			}
			if(config.height) {

				config.attrs.style.height = config.height + "px";
			}
			if(config.class) {
				config.attrs.class =  config.class.join(" ");
			}
			if(config.click) {
				config.attrs["latte-click"] = config.click;
				data[config.click] = function() {
					console.log("is click");
				}
			}
			if(config.controller) {
				config.attrs["latte-controller"] = config.controller;
			}
			if(config.location) {
				config.attrs.style["margin-left"] = "auto";
				config.attrs.style["margin-right"] = "auto";
				config.attrs.style["text-align"] = "center";
			}
			
		}


			var typeFunctions = {
				"text": text2Html,
				"view": view2Html,
				"image": image2Html,
				"window": window2Html,
				"editor": editor2Html,
				"list": list2Html,
				"page": page2Html
			};

	var compile2Html = this.compile2Html = function(config, data) {
		var htmlTemplate;
		config.attrs  = config.attrs || {};
		config.attrs.style =   Css.create(config.attrs.style || config.style);
			
		if(config.data) {
			data[config.data] = {};
			config.attrs["latte-data"] = config.data;
			data = data[config.data];
		}
		doit(config, data);
		var doFunction = typeFunctions[config.type];
		if(doFunction) {
			htmlTemplate = doFunction(config, data);
		}else{
			htmlTemplate = "";
		}
		
		var childs = "";
		if(!config.childs || config.childs.length == 0) {
			childs = config.text || "";
		}else{
			childs = config.childs.map(function(c) {
				return compile2Html(c, data);
			}).join("");
		}
		html = latte_lib.format.templateStringFormat(htmlTemplate, {
			childs: childs 
		});
		return html;
	}
	var formatHtml = require("./format");
	this.compile = function(config) {
		var data = {};
		var html = formatHtml.format(compile2Html(config, data));
		
		return {
			html: html,
			data: latte_lib.format.jsonFormat(data)
		};
	}


	this.insert = function(fileName, opts) {
		var html = latte_lib.fs.readFileSync(fileName);
		return latte_lib.format.templateStringFormat(html, opts);
	}
}).call(module.exports);