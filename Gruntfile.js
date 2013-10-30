/*global require, module, process */
/*jshint devel:true */
module.exports = function (grunt) {
	var gruntPlugins = [
			'grunt-contrib-watch',
			'grunt-contrib-clean',
			'grunt-contrib-compass',
			//'grunt-contrib-requirejs',
			'grunt-contrib-uglify',
			'grunt-contrib-connect',
			'grunt-connect-proxy',
			//'grunt-contrib-jasmine',
			null
		],
		uglifyMapping = {
			'public/javascripts/min/vendor/custom.modernizr.js': 'public/javascripts/src/vendor/custom.modernizr.js',
			'public/javascripts/min/app/main.js': [
				'public/javascripts/src/app/main.js'
			],
			'public/javascripts/min/vendor/jquery.js': [
				'public/javascripts/src/vendor/jquery.js'
			],
			'public/javascripts/min/vendor/zepto.js': [
				'public/javascripts/src/vendor/zepto.js'
			]
		},
		connectServerPort = process.env.PORT || 4863;

	// Load grunt plugins
	gruntPlugins.forEach(function (gruntPluginName) {
		if (gruntPluginName) {
			grunt.loadNpmTasks(gruntPluginName);
		}
	});

	grunt.initConfig(
		{
			// expose current grunt config to tasks
			//config: gruntConfig,

			// Spool up a static web server
			connect: {
				server: {
					options: {
						hostname: '*',
						port: connectServerPort,
						base: 'public',
						keepalive: true,
						middleware: function (connect, options) {
							var config = [ // Serve static files.
								connect.static(options.base),
								// Make empty directories browsable.
								connect.directory(options.base)
							];
							var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
							config.unshift(proxy);

							return config;
						}
					}
				},
				proxies: [
					{ // Allows proxying of the node API server through grunt-contrib-connect
						context: '/api',
						host: 'localhost',
						port: 1337,
						https: false,
						changeOrigin: false,
						xforward: false,
						rewrite: {
							'^/api': ''
						}
					}
				]
			}, // end of connect

			// SASS compilation task
			compass: {
				prod: {
					options: {
						config: 'config.rb',
						environment: 'production',
						debugInfo: false
					}
				},
				debug: {
					options: {
						config: 'config.rb',
						environment: 'development',
						debugInfo: true
					}
				}
			}, // end of compass

			// Delete generated folders/files
			clean: {
				js: 'public/javascripts/min/**/*.*',
				css: 'public/stylesheets/*.css'
			},

			uglify: {
				debug: {
					options: {
						beautify: true,
						mangle: false,
						compress: {
							sequences: false,  // join consecutive statemets with the “comma operator”
							properties: false,  // optimize property access: a["foo"] → a.foo
							dead_code: false,  // discard unreachable code
							drop_debugger: false,  // discard “debugger” statements
							unsafe: false, // some unsafe optimizations (see below)
							conditionals: false,  // optimize if-s and conditional expressions
							comparisons: false,  // optimize comparisons
							evaluate: false,  // evaluate constant expressions
							booleans: false,  // optimize boolean expressions
							loops: false,  // optimize loops
							unused: false,  // drop unused variables/functions
							hoist_funs: false,  // hoist function declarations
							hoist_vars: false, // hoist variable declarations
							if_return: false,  // optimize if-s followed by return/continue
							join_vars: false,  // join var declarations
							cascade: false,  // try to cascade `right` into `left` in sequences
							side_effects: false,  // drop side-effect-free statements
							warnings: true,  // warn about potentially dangerous optimizations/code
							global_defs: {
								DEBUG: true,
								AUTORUN: true
							}     // global definitions
						}
					},
					files: uglifyMapping
				},
				prod: {
					options: {
						mangle: true,
						compress: {
							global_defs: { // global definitions
								DEBUG: false,
								AUTORUN: false
							}
						},
						report: 'min'
					},
					files: uglifyMapping
				}
			},

//			// Require JS Optimizer
//			requirejs: {
//				prod: _.extend({}, defaultRequireJsOptimizerConfig,
//					{
//						optimize: 'uglify2',
//						keepBuildDir: false,
//						preserveLicenseComments: true,
//						generateSourceMaps: true
//					}
//				),
//				debug: _.extend({}, defaultRequireJsOptimizerConfig,
//					{
//						optimize: 'none',
//						keepBuildDir: false
//					}
//				)
//			}, // end of requirejs

			// Watch folders for file changes and run target tasks
			watch: {
				js_debug: {
					files: 'public/javascripts/src/**/*.js',
					tasks: [
						'uglify:debug'
					]
				},
				js_prod: {
					files: 'public/javascripts/src/**/*.js',
					tasks: [
						'uglify:prod'
					]
				},
				compass_debug: {
					files: 'public/sass/**/*.scss',
					tasks: [
						'compass:debug'
					]
				},
				compass_prod: {
					files: 'public/sass/**/*.scss',
					tasks: [
						'compass:prod'
					]
				}
			}
		}
	);

	// Task groups
	// Build tasks
	grunt.registerTask(
		'build:debug',
		[
			'compass:debug',
			'uglify:debug'
		]
	);
	grunt.registerTask(
		'build',
		[
			'compass:prod',
			'uglify:prod'
		]
	);
	grunt.registerTask(
		'run',
		[
			'configureProxies',
			'connect:server'
		]
	);
	grunt.registerTask(
		'heroku',
		[
			'clean',
			'build:debug'
		]
	);
};