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
			'src/client/js_min/vendor/custom.modernizr.js': 'src/client/js/vendor/custom.modernizr.js',
			'src/client/js_min/app/main.js': [
				'src/client/js/vendor/underscore.js',
				'src/client/js/app/main.js'
			],
			'src/client/js_min/vendor/jquery.js': [
				'src/client/js/vendor/jquery.js'
			]
		},
		connectServerPort = process.env.PORT || 8080;

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
						base: 'src/client',
						keepalive: true
					}
				}
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
				js: 'src/client/js_min/**/*.*',
				css: 'src/client/css/*.css'
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
					files: 'src/client/js/**/*.js',
					tasks: [
						'uglify:debug'
					]
				},
				js_prod: {
					files: 'src/client/js/**/*.js',
					tasks: [
						'uglify:prod'
					]
				},
				compass_debug: {
					files: 'src/client/sass/**/*.scss',
					tasks: [
						'compass:debug'
					]
				},
				compass_prod: {
					files: 'src/client/sass/**/*.scss',
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