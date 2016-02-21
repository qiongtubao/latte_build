#!/usr/bin/env node
(function(define) {'use strict'
	define("latte", ["require", "exports", "module", "window"], 
		function(require, exports, module, window) {
			var Path = require("path")
				, latte_lib = require("latte_lib")
				, Fs = latte_lib.fs;
			var GetConfig = function() {
				var config;
				var index = process.argv.indexOf("-c");
				if(index != -1) {
					config = process.argv[index+1];
				}
				config = config || ".latte/build.json";
				var buildConfigPath = Path.join(process.cwd()+"/"+config);
				var buildConfig;
				try {
					buildConfig = require(buildConfigPath);
				}catch(e) {
					return null;
				}
				return buildConfig;
			};

			var build = function() {
				//var applyArray = Array.prototype.splice.call(arguments, 1);
	 			var config = GetConfig();
	 			if(!config) {
	 				return console.log("not find config");
	 			}
	 			var packageJson;
				try {
					packageJson = require(process.cwd() + "/" + "package.json");
				}catch(e) {
					packageJson = {};
				}
	         	var config = JSON.parse(
		           latte_lib.format.templateStringFormat(JSON.stringify(config), packageJson)
	         	);
	         	var buildFunc ,cleanFunc;
	         	buildFunc = cleanFunc = function(callback) {
	         		callback && callback();
	         	};
	         	if(config.clean) {
	         		cleanFunc = function(callback) {
	         			var funcs = config.clean.map(function(command) {
		         			var handle = build.clean[command.command];
			             	if(!handle) {
			             		throw "no find module " + command.command; 
			             	}
			             	return handle(command, config);
		         		});
		         		latte_lib.async.series(funcs, function(error) {
				             if(error) {
				               console.log("clean not ok");
				               return 
				             }
				             callback && callback();
				             //console.log("build ok!");
			         	});
	         		}
	         		

	         	}
	         	if(config.build) {
	         		buildFunc = function(callback) {
	         			var funcs = config.build.map(function(command) {	             	
			             	var handle = build.build[command.command];
			             	if(!handle) {
			             		throw "no find module " + command.command; 
			             	}
			             	return handle(command, config);
			         	});
			         	latte_lib.async.series(funcs, function(error) {
				             if(error) {
				               console.log("buiild not ok");
				               return clean();
				             }
				             
			         	});
	         		}
	         		
	         	}
	         	cleanFunc(function(err) {
	         		//console.log("clean ok");
	         		buildFunc();
	         	});


			};
			(function() {
				this.build = {};
				this.clean = {};
			}).call(build);
			(function() {
				this.mergerFile = function(command, keys){
					return function(callback) {
						var files = [];
						var cwd = process.cwd();
						var type = "." + command.type || ".js";
						var read = function(path) {
							if(!command.ignores || command.ignores.indexOf(path) == -1) {
								var stat = Fs.lstatSync(cwd + "/" + path);
								if(stat.isFile()) {
									if(Path.extname(path) == type) {
										file.push(path);
									}
								}else if(stat.isDirectory()) {
									Fs.readdirSync(path).forEach(function(filename) {
										read(path + "/" + filename);
									});
								}else if(stat.isSymbolicLink()) {
									try {
										Fs.readdirSync(path).forEach(function(filename) {
											read(path + "/" + filename);
										});
									}catch(e) {
										files.push(path);
									}
								}
							}
						}
						command.in.forEach(function(filename) {
							read(filename);
						});
						var datas = files.map(function(filename) {
							return Fs.readFileSync(cwd + "/" + filename);
						});
						var time = Date.now();
						var data = datas.join("\n");
						data = latte_lib.format.templateStringFormat(data, keys);
						latte_lib.fs.writeFileSync(cwd + "/"+command.out , data);
						console.log("mergerFile over:", Date.now() - time + "ms");
					}
				}
				/**
					command: {
						types: <Array>
						in: <Array or String>
						out: <String>
						ignores: <Array>
					}
				*/
				this.miniDir = function(command, key) {
					return function(callback) {
						var files = [];
						var cwd = process.cwd();
						command.types = command.types || ["js", "json"];
						var read = function(dir, path) {
							if(!command.ignores || command.ignores.indexOf(path) == -1) {
								var stat = Fs.lstatSync(cwd + "/"+ dir + path);
								if(stat.isFile()) {
									var type = Path.extname(path).substring(1);
									if(command.types.indexOf(type) != -1) {
										//files[dir + path] = command.out + path;
										Fs.mkdirSync(Path.dirname(cwd + "/" +command.out + path));
										files.push({
											key: cwd + "/" + dir + path,
											value: cwd + "/" +command.out + path
										});
									}
								}else{
									Fs.readdirSync(dir + path).forEach(function(filename) {
										read(dir, path +"/"+filename);
									});
								}
							}
						}
						if(!latte_lib.isArray(command.in)) {
							command.in = [command.in];
						}
						command.in.forEach(function(filename) {
							read(filename, "");
						});


						var time = Date.now();
						var runs = [];
						var allLength = files.length;
						var access = 0;
						var fp = function(work) {
							var o = files.shift();
							if(!o) {
								//console.log("work over:",work.id);
								work.kill();
								if(runs.length == 0) {
									console.log("copy over :", access, allLength, Date.now() - time + "ms" );
									callback();
								}
								return;
							}
							runs.push(o.key);
							work.send({
								type: "miniDir",
								key: o.key,
								value: o.value
							});
						}
						var fpok = function(m,work) {
							var index = runs.indexOf(m.key);
							if(index != -1) {
								runs.splice(index, 1);
							}
							if(m.err) {
								console.log(m.err);
								files.push({
									key: m.key,
									value: m.value
								});
							}else{
								access++;
							}
							fp(work);
						}
						var childs =[];
						var createWork = function(i) {
							var work= child.fork(Path.join(__dirname,"../lib/child.js"));
							work.id = i;
							work.on("message", function(m) {
								fpok(m,work);
							});
							work.on("error", function() {
								createWork(work.id);
							});
							fp(work);
							childs[i] = work;
						}
						var len = require("os").cpus().length;
						for(var i = 0; i < len; i++) {
							createWork(i);
						}


						/**
						var funcs = [];
						var uglifyJs = require("uglify-js");
						for(var key in files) {
							var type = Path.extname(key).substring(1);
							switch(type) {
								case "json":
									var data = Fs.readFileSync(key);
									data = data.split("\n").join(" ");
									var t = [];
									var inString = false;
									for (var i = 0, len = data.length; i < len   ; i++) {
										var c = data.charAt(i);
										if (inString && c === inString  ) {
											// TODO: \\"
											if (data.charAt(i - 1) !== '\\') {
												inString = false;
											}
										} else if (!inString && (c === '"' || c === "'")) {
											inString = c;
										} else if (!inString && (c === ' ' || c === "\t")) {
											c = '';
										}
										t.push(c);
									}
									data= t.join('');
									Fs.writeFileSync(files[key] , data);
								break;
								case "js":
									
								break;
								default:
									var copyModule = require("../lib/copy");	
									funcs.push(function(cb) {
										copyModule(key, files[key], cb);
									});
								break;
							}
							
							
						}
						latte_lib.async.parallel(funcs, function() {
							callback();
						});
						*/
						//callback();
					}
				}
				
				this.mini = function(command, keys) {
					return function(callback) {
							var files = [];
							var cwd = process.cwd();
							command.types = command.types || ["js", "json"];
							var read = function(path) {
								if(!command.ignores || command.ignores.indexOf(path) == -1 ) {
									var stat = Fs.lstatSync(cwd + "/"+path);
									if(stat.isFile()) {
										var type = Path.extname(path).substring(1);
										if(command.types.indexOf(type) != -1) {	
									
											files.push(path);
										}

									}else{
											Fs.readdirSync(path).forEach(function(filename) {
												read(path+"/"+filename);
											});
									}
								};
							}
							if(!latte_lib.isArray(command.in)) {
								command.in = [command.in];
							}
							command.in.forEach(function(filename) {
									read(filename);
							});
							var uglifyJs = require("uglify-js");
							var result = uglifyJs.minify(files);
							var data = latte_lib.format.templateStringFormat(result.code, keys);
							Fs.writeFile(cwd + "/"+command.out , data, callback);
					};
				}
				
				this.tsc = function(command, keys) {
					return function(callback) {
						var files = [];
						var cwd = process.cwd();
						var argv = process.argv;
						console.log(command);
						var files = [];
						var type = "."+command.type;
						var read = function(path) {
							if(!command.ignores || command.ignores.indexOf(path) == -1 ) {
								var stat = Fs.lstatSync(path);
								if(stat.isFile()) {
									if(Path.extname(path) == type){
										files.push(path);
									}

								}else{
									Fs.readdirSync(path).forEach(function(filename) {
										read(path+"/"+filename);
									});
								}
							};
						}
						command.in.forEach(function(filename) {
							read(filename);
						});
						var filename = ".latte/buildFiles";
						if(process.argv.indexOf("-debug")) {
							console.log(files);
						}
						try {
							latte_lib.fs.writeFileSync(filename, files.join("\n"));
						}catch(e) {
							console.log(e.stack);
						}
						command.module = command.module || "commonjs" || "amd";
						process.argv = [process.argv[0], "tsc", "-d", "@"+filename, "--out", command.out, "-t" , "ES5","--sourceMap","--noEmitOnError", "--experimentalDecorators", "--module", command.module];
						require("typescript/lib/tsc");
						callback();
					}
				}
				/**
					command: {
						types: <Array or String>
						in: <String>
						out: <String>
					}

				*/
				var child = require("child_process");
				this.copy = function(command, keys) {
					var files = [];
					/**
					var copyPhotoFile = function(fIn, fOut) {
						var readFileSteam = latte_lib.fs.createReadStream( fIn );
						var writeFileSteam = latte_lib.fs.createWriteStream( fOut );
					 	readFileSteam.pipe( writeFileSteam );
					}
					*/
					var copyFile = function(fIn, fOut) {
						try{
							latte_lib.fs.mkdirSync(Path.dirname(fOut));
						}catch(e) {

						}						
						files.push({
							key: fIn,
							value: fOut
						});
						//latte_lib.fs.writeFileSync(fOut, latte_lib.fs.readFileSync(fIn, "utf8"), "utf8");
						//var readFileSteam = latte_lib.fs.createReadStream( fIn );
						//var writeFileSteam = latte_lib.fs.createWriteStream( fOut );
					 	//readFileSteam.pipe( writeFileSteam );
					};
					var copyDir = function(dIn, dOut) {
						var files = latte_lib.fs.readdirSync(dIn);
						files.forEach(function(file) {
							var stat = latte_lib.fs.lstatSync(dIn + "/" + file);
							if(stat.isDirectory()) {
								copyDir(dIn + "/"+ file, dOut+"/" + file);
							}else{
								var type = Path.extname(file).substring(1);
								if(!command.types || command.types.indexOf(type) != -1) {
									
									copyFile(dIn + "/"+ file, dOut + "/" + file);
									
								}
							}
						});
					}
					return function(callback) {
						
						var stat = latte_lib.fs.lstatSync(command.in);
						if(stat.isFile()) {
							copyFile(command.in, command.out);
						}else{
							copyDir(command.in, command.out);
						}

						if(files.length > 20) {
							//open file too many will throw Error
							var time = Date.now();
							var runs = [];
							var allLength = files.length;
							var access = 0;
							var fp = function(work) {
								var o = files.shift();
								if(!o) {
									//console.log("work over:",work.id);
									work.kill();
									if(runs.length == 0) {
										console.log("copy over :", access, allLength, Date.now() - time + "ms" );
										callback();
									}
									return;
								}
								runs.push(o.key);
								work.send({
									type: "copy",
									key: o.key,
									value: o.value
								});
							}
							var fpok = function(m,work) {
								var index = runs.indexOf(m.key);
								if(index != -1) {
									runs.splice(index, 1);
								}
								if(m.err) {
									res.push(m.key);
								}else{
									access++;
								}
								fp(work);
							}
							var childs =[];
							var createWork = function(i) {
								var work= child.fork(Path.join(__dirname,"../lib/child.js"));
								work.id = i;
								work.on("message", function(m) {
									fpok(m,work);
								});
								work.on("error", function() {
									createWork(work.id);
								});
								fp(work);
								childs[i] = work;
							}
							var len = require("os").cpus().length;
							for(var i = 0; i < len; i++) {
								createWork(i);
							}
						}else{
							var copyModule = require("../lib/copy");	
							var time = Date.now();
							var funcs = files.map(function(o) {
								return function(cb) {
									copyModule(o.key, o.value, cb);
								}	
							});
							latte_lib.async.parallel(funcs, function() {
								console.log("copy over :", files.length, files.length, Date.now() - time + "ms");
								callback();
							});
							
							
						}
						

						//callback();
						
						
					}
				}
				
			}).call(build.build);
			(function() {
				this.clean = function(command, keys) {
					var removeDir = function(dirName, callback) {
						//latte_lib.fs.removeDir(dirName);
						var exec = require('child_process').exec,child;

						child = exec('rm -rf '+dirName,function(err,out) { 
						  err && console.log(err); 
						  callback(err);
						});
					}
					var removeFile = function(fileName, callback) {
						latte_lib.fs.unlinkSync(dirName);
						callback();
					}
					return function(callback){
						try{
							var stat = latte_lib.fs.lstatSync(command.in);
						}catch(e) {
							return callback();
						}
						
						if(stat.isDirectory()) {
							removeDir(command.in, callback);
						}else{
							removeFile(command.in, callback);
						}
						//callback();
					}
				}
			}).call(build.clean);
			module.exports = build;
		});
})(typeof define === "function"? define: function(name, reqs, factory) { factory(require, exports, module); });
