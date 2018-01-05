const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CompressionPlugin = require('compression-webpack-plugin');
let WebpackNotifierPlugin;
const CircularDependencyPlugin = require('circular-dependency-plugin');
const {NamedLazyChunksWebpackPlugin} = require('@angular/cli/plugins/webpack');
const {AngularCompilerPlugin, PLATFORM} = require('@ngtools/webpack');
const rxPaths = require('rxjs/_esm5/path-mapping');
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
const cssnano = require('cssnano');
const customProperties = require('postcss-custom-properties');
const {CommonsChunkPlugin, ModuleConcatenationPlugin, UglifyJsPlugin} = require('webpack').optimize;
const {PurifyPlugin} = require('@angular-devkit/build-optimizer');
const {ProgressPlugin, DefinePlugin, LoaderOptionsPlugin, NoEmitOnErrorsPlugin, SourceMapDevToolPlugin, NamedModulesPlugin, NormalModuleReplacementPlugin, ContextReplacementPlugin} = require('webpack');
const WebpackSynchronizableShellPlugin = require('webpack-synchronizable-shell-plugin');

const config = require('./config.js');
const pck = require('./package.json');
config.client.version = pck.version;

// Helpers

function rootFolder() {
	return path.resolve(__dirname);
}

function root(args) {
	args = Array.prototype.slice.call(arguments, 0);
	return path.join.apply(path, [__dirname].concat(args));
}

const NopePlugin = function () {
	this.apply = function () {
	};
};

const postcssPlugins = function () {
	const minimizeCss = false;
	const baseHref = "";
	const deployUrl = "";
	const projectRoot = process.cwd();

	// safe settings based on: https://github.com/ben-eb/cssnano/issues/358#issuecomment-283696193
	const importantCommentRe = /@preserve|@licen[cs]e|[@#]\s*source(?:Mapping)?URL|^!/i;
	const minimizeOptions = {
		autoprefixer: false,
		safe: true,
		mergeLonghand: false,
		discardComments: {remove: (comment) => !importantCommentRe.test(comment)}
	};
	return [
		postcssUrl({
			filter: ({url}) => url.startsWith('~'),
			url: ({url}) => path.join(projectRoot, 'node_modules', url.substr(1)),
		}),
		postcssUrl([
			{
				// Only convert root relative URLs, which CSS-Loader won't process into require().
				filter: ({url}) => url.startsWith('/') && !url.startsWith('//'),
				url: ({url}) => {
					if (deployUrl.match(/:\/\//) || deployUrl.startsWith('/')) {
						// If deployUrl is absolute or root relative, ignore baseHref & use deployUrl as is.
						return `${deployUrl.replace(/\/$/, '')}${url}`;
					}
					else if (baseHref.match(/:\/\//)) {
						// If baseHref contains a scheme, include it as is.
						return baseHref.replace(/\/$/, '') +
							`/${deployUrl}/${url}`.replace(/\/\/+/g, '/');
					}
					else {
						// Join together base-href, deploy-url and the original URL.
						// Also dedupe multiple slashes into single ones.
						return `/${baseHref}/${deployUrl}/${url}`.replace(/\/\/+/g, '/');
					}
				}
			},
			{
				// TODO: inline .cur if not supporting IE (use browserslist to check)
				filter: (asset) => !asset.hash && !asset.absolutePath.endsWith('.cur'),
				url: 'inline',
				// NOTE: maxSize is in KB
				maxSize: 10
			}
		]),
		autoprefixer(),
		customProperties({preserve: true})
	].concat(minimizeCss ? [cssnano(minimizeOptions)] : []);
};

const loadJSON = (context, request, cb) => {
	if (request.charAt(1) === '.') request = './' + request;
	let filename = path.resolve(context + request.slice(1));
	fs.readFile(filename, (err, result) => {
		if (!result) {
			console.error(filename, result);
		}
		if (err) console.error(err);
		result = JSON.parse(result.toString());
		cb(null, 'var ' + JSON.stringify(result));
	});
};

const replacements = {
	// 'config.js': () => config
};

const styleLoaders = [
	{
		"exclude": [
			path.join(process.cwd(), "src/styles"),
		],
		"test": /\.css$/,
		"use": [
			"exports-loader?module.exports.toString()",
			{
				"loader": "css-loader",
				"options": {
					"sourceMap": false,
					"importLoaders": 1
				}
			},
			{
				"loader": "postcss-loader",
				"options": {
					"ident": "postcss",
					"plugins": postcssPlugins,
					"sourceMap": false
				}
			}
		]
	},
	{
		"exclude": [
			path.join(process.cwd(), "src/styles/styles"),
		],
		"test": /\.scss$|\.sass$/,
		"use": [
			"exports-loader?module.exports.toString()",
			{
				"loader": "css-loader",
				"options": {
					"sourceMap": false,
					"importLoaders": 1
				}
			},
			{
				"loader": "postcss-loader",
				"options": {
					"ident": "postcss",
					"plugins": postcssPlugins,
					"sourceMap": false
				}
			},
			{
				"loader": "sass-loader",
				"options": {
					"sourceMap": false,
					"precision": 8,
					"includePaths": []
				}
			}
		]
	},
	{
		"exclude": [
			path.join(process.cwd(), "src/styles.scss"),
			path.join(process.cwd(), "src/fonts/icomoon/icomoon.css"),
			path.join(process.cwd(), "src/fonts/open-sans/open-sans.css")
		],
		"test": /\.less$/,
		"use": [
			"exports-loader?module.exports.toString()",
			{
				"loader": "css-loader",
				"options": {
					"sourceMap": false,
					"importLoaders": 1
				}
			},
			{
				"loader": "postcss-loader",
				"options": {
					"ident": "postcss",
					"plugins": postcssPlugins,
					"sourceMap": false
				}
			},
			{
				"loader": "less-loader",
				"options": {
					"sourceMap": false
				}
			}
		]
	},
	{
		"exclude": [
			path.join(process.cwd(), "src/styles"),
		],
		"test": /\.styl$/,
		"use": [
			"exports-loader?module.exports.toString()",
			{
				"loader": "css-loader",
				"options": {
					"sourceMap": false,
					"importLoaders": 1
				}
			},
			{
				"loader": "postcss-loader",
				"options": {
					"ident": "postcss",
					"plugins": postcssPlugins,
					"sourceMap": false
				}
			},
			{
				"loader": "stylus-loader",
				"options": {
					"sourceMap": false,
					"paths": []
				}
			}
		]
	}
];

// config for client browser app

const clientAppConfig = () => {
	const nodeModules = root('node_modules');
	const realNodeModules = fs.realpathSync(nodeModules);
	const genDirNodeModules = path.join(process.cwd(), 'src', '$$_gendir', 'node_modules');
	let plugins = [];
	if (config.webpack.analyze) {
		plugins.push(new BundleAnalyzerPlugin({
			analyzerMode: 'static', // server|disabled|static
			reportFilename: '../reports/report.html',
			openAnalyzer: false,
			generateStatsFile: true,
			statsFilename: '../reports/stats.json',
		}));
		plugins.push(new CompressionPlugin({
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: /\.(js|html)$/,
			threshold: 10240,
			minRatio: 0.8
		}));
	}
	if (config.client.devMode) {
		if (!WebpackNotifierPlugin) {
			WebpackNotifierPlugin = require('webpack-notifier');
		}
		plugins.push(new WebpackNotifierPlugin({title: "Opentender Client Build", alwaysNotify: true}));
	}
	let minifiyplugins = [];
	if (config.webpack.minimize) {
		minifiyplugins = [
			new PurifyPlugin(),
			// new UglifyJsPlugin({
			// 	beautify: false,
			// 	comments: false,
			// 	output: {
			// 		comments: false
			// 	},
			// 	mangle: {
			// 		screw_ie8: true
			// 	},
			// 	compress: {
			// 		loops: true,
			// 		comparisons: true,
			// 		conditionals: true,
			// 		dead_code: true,
			// 		evaluate: true,
			// 		if_return: true,
			// 		join_vars: true,
			// 		screw_ie8: true,
			// 		sequences: true,
			// 		unused: true,
			// 		negate_iife: false, // we need this for lazy v8
			// 		warnings: false
			// 	},
			// 	sourceMap: config.webpack.sourcemaps
			// })
			// new UglifyJsPlugin({
			// 	sourceMap: false,
			// 	parallel: true,
			// 	uglifyOptions: {
			// 		compress: {warnings: false, drop_console: true},
			// 		output: {comments: false},
			// 		ie8: true,
			// 	},
			// })
		];
	}
	return {
		"resolve": {
			"extensions": [
				".ts",
				".js"
			],
			"modules": [
				"./node_modules",
				"./node_modules"
			],
			"symlinks": true,
			"alias": rxPaths(),
			"mainFields": [
				"browser",
				"module",
				"main"
			]
		},
		"resolveLoader": {
			"modules": [
				"./node_modules",
				"./node_modules"
			],
			"alias": rxPaths()
		},
		"entry": {
			"app": [
				"./src/client/client.ts"
			],
			"polyfills": [
				"./src/client/polyfills.ts"
			],
			"polyfills_ie": [
				"./src/client/polyfills_ie.ts"
			]
		},
		"output": {
			"path": path.join(process.cwd(), "dist", 'client'),
			"filename": "assets/js/[name].bundle.js",
			"chunkFilename": "assets/js/[id].chunk.js",
			"crossOriginLoading": false,
			"publicPath": "/"
		},
		"module": {
			"rules": [
				{
					"test": /\.html$/,
					"loader": "raw-loader"
				},
				{
					"test": /\.(eot|svg|cur)$/,
					"loader": "file-loader",
					"options": {
						"name": "assets/js/[name].[hash:20].[ext]",
						"limit": 10000
					}
				},
				{
					"test": /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
					"loader": "url-loader",
					"options": {
						"name": "assets/js/[name].[hash:20].[ext]",
						"limit": 10000
					}
				},
				...styleLoaders,
				{
					"test": /\.ts$/,
					"loader": "@ngtools/webpack"
				}
			]
		},
		"plugins": [
			...plugins,
			new LoaderOptionsPlugin({
				minimize: config.webpack.minimize,
				debug: config.webpack.debug
			}),
			new NoEmitOnErrorsPlugin(),
			config.webpack.progress ? new ProgressPlugin() : new NopePlugin(),
			new CircularDependencyPlugin({
				exclude: /src\/app\/thirdparty|node_modules/,
				"failOnError": false,
				"onDetected": false,
				"cwd": process.cwd()
			}),
			new NamedLazyChunksWebpackPlugin(),
			new CommonsChunkPlugin({
				"name": [
					"inline"
				],
				"minChunks": null
			}),
			new CommonsChunkPlugin({
				"name": [
					"vendor"
				],
				"minChunks": (module) => {
					return module.resource
						&& (module.resource.startsWith(nodeModules)
							|| module.resource.startsWith(genDirNodeModules)
							|| module.resource.startsWith(realNodeModules));
				},
				"chunks": [
					"app"
				]
			}),
			new SourceMapDevToolPlugin({
				"filename": "[file].map[query]",
				"moduleFilenameTemplate": "[resource-path]",
				"fallbackModuleFilenameTemplate": "[resource-path]?[hash]",
				"sourceRoot": "webpack:///"
			}),
			new CommonsChunkPlugin({
				"name": [
					"app"
				],
				"minChunks": 2,
				"async": "common"
			}),
			new NamedModulesPlugin({}),
			new NormalModuleReplacementPlugin(
				/zone\.js(\\|\/)dist(\\|\/)long-stack-trace-zone/,
				root('empty.js')
			),
			new ContextReplacementPlugin(/rxjs[\/\\]testing/, /nope/),
			new ContextReplacementPlugin(/moment[\/\\]locale$/, /de.js|it/),
			new AngularCompilerPlugin({
				"mainPath": "client/client.ts",
				"platform": PLATFORM.Browser,
				// "hostReplacementPaths": {
				// "environments/environment.ts": "environments/environment.ts"
				// },
				"sourceMap": config.webpack.sourcemaps,
				"tsConfigPath": "src/tsconfig.browser.json",
				"skipCodeGeneration": true,
				"compilerOptions": {},
				"exclude": ['src/server/**/*', 'server/**/*']
			}),
			...minifiyplugins
		],
		"node": {
			"fs": "empty",
			"global": true,
			"crypto": "empty",
			"tls": "empty",
			"net": "empty",
			"process": true,
			"module": false,
			"clearImmediate": false,
			"setImmediate": false
		},
		externals: (context, request, cb) => {
			if (request.indexOf('.json') >= 0 && request.charAt(0) === '.') {
				return loadJSON(context, request, cb);
			}
			cb();
		},
		"devServer": {
			"historyApiFallback": true
		}
	};

};

// config for server app build by angular-cli

const serverAppConfigAngularCLI = () => {
	return {
		output: {
			filename: 'dummy',
			path: root('dist/temp'),
		},
		resolve: {extensions: ['.js']},
		entry: './config.js',
		stats: {
			colors: true,
			hash: false,
			version: false,
			timings: false,
			assets: false,
			chunks: false,
			modules: false,
			reasons: false,
			children: false,
			source: false,
			errors: false,
			errorDetails: false,
			warnings: false,
			publicPath: false
		},
		plugins: [
			new WebpackSynchronizableShellPlugin({
				onBuildStart: {scripts: ['npm run build:universal' + (config.client.devMode ? '' : ':prod')], blocking: true, parallel: false}
			})
		]
	};
};

// config for server app (not working, since for lazy route loading support, the server app MUST be build with angular-cli (januar 2018)

const serverAppConfig = () => {
	return {
		target: 'node',
		entry: './src/server/server.main.ts',
		output: {
			filename: 'server.app.js',
			path: root('dist/server'),
			libraryTarget: 'commonjs2',
			chunkFilename: "[id].chunk.js",
			publicPath: rootFolder(),
		},
		module: {
			rules: [
				{test: /\.html$/, loader: 'raw-loader'},
				{test: /\.json$/, loader: 'raw-loader'},
				...styleLoaders,
				{
					test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
					use: [
						{
							loader: '@angular-devkit/build-optimizer/webpack-loader',
							options: {
								sourceMap: false
							}
						},
						'@ngtools/webpack'
					]
				}
			]
		},
		plugins: [
			new DefinePlugin({
				// do not use an object for 'process.env' otherwise all other environment
				// variables are set to 'undefined' see issue #291
				'process.env.NODE_ENV': JSON.stringify(config.client.devMode ? 'development' : 'production'),
				'process.env.AOT': false
			}),
			new ModuleConcatenationPlugin(),
			new NoEmitOnErrorsPlugin(),
			config.webpack.progress ? new ProgressPlugin() : new NopePlugin(),
			new CircularDependencyPlugin({
				exclude: /src\/app\/thirdparty|node_modules/,
				"failOnError": false,
				"onDetected": false,
				"cwd": process.cwd()
			}),
			new NamedLazyChunksWebpackPlugin(),
			new SourceMapDevToolPlugin({
				"filename": "[file].map[query]",
				"moduleFilenameTemplate": "[resource-path]",
				"fallbackModuleFilenameTemplate": "[resource-path]?[hash]",
				"sourceRoot": "webpack:///"
			}),
			new NamedModulesPlugin({}),
			new AngularCompilerPlugin({
				"platform": PLATFORM.Server,
				"sourceMap": true,
				"tsConfigPath": "src/tsconfig.server.json",
				"skipCodeGeneration": true,
				"compilerOptions": {},
				"exclude": ['src/client/**/*']
			})
		],
		externals: (context, request, cb) => {
			let replacement = replacements[request];
			if (replacement) {
				return cb(null, 'var ' + JSON.stringify(replacement()));
			}
			if (request.indexOf('.json') >= 0 && request.charAt(0) === '.') {
				return loadJSON(context, request, cb);
			}
			if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
				return cb(null, 'commonjs ' + request);
			}
			cb();
		},
		node: {
			global: true,
			crypto: true,
			__dirname: true,
			__filename: true,
			process: true,
			Buffer: true
		}
	};
};

// config for server.js (express app)

const serverConfig = () => {
	return {
		target: 'node',
		resolve: {extensions: ['*', '.js', '.ts']},
		entry: './server.ts',
		output: {
			path: root('dist/server'),
			filename: 'index.js'
		},
		module: {
			rules: [
				{
					test: /\.ts$/, loader: 'ts-loader', options: {
						configFile: 'tsconfig.node.json'
					}
				}
			]
		},
		externals: (context, request, cb) => {
			if (request.indexOf('.json') >= 0 && request.charAt(0) === '.') {
				return loadJSON(context, request, cb);
			}
			if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
				return cb(null, 'commonjs ' + request);
			}
			cb();
		},
		plugins: [
			// Temporary Fix for issue: https://github.com/angular/angular/issues/11580
			// for "WARNING Critical dependency: the request of a dependency is an expression"
			new webpack.ContextReplacementPlugin(
				/(.+)?angular(\\|\/)core(.+)?/,
				root('src'), // location of your src
				{} // a map of your routes
			),
			new webpack.ContextReplacementPlugin(
				/(.+)?express(\\|\/)(.+)?/,
				root('src'),
				{}
			)
		],
		node: {
			global: true,
			crypto: true,
			__dirname: true,
			__filename: true,
			process: true,
			Buffer: true
		}
	};
};

// config for global css

const styleConfig = () => {
	return {
		target: 'node',
		entry: './src/style/style.scss',
		output: {
			path: root('dist/style'),
			filename: '_style.js'
		},
		devtool: config.webpack.sourcemaps ? 'source-map' : undefined,
		context: __dirname,
		resolve: {
			extensions: ['.scss']
		},
		module: {
			loaders: [
				{
					test: /\.scss$/,
					exclude: /node_modules/,
					use: ExtractTextPlugin
					.extract({
						use: [
							{
								loader: 'css-loader',
								query: {
									modules: false,
									minimize: config.webpack.minimize,
									sourceMap: config.webpack.sourcemaps,
									importLoaders: 2,
									localIdentName: '[name]__[local]___[hash:base64:5]'
								}
							},
							{loader: 'postcss-loader'},
							{loader: 'sass-loader', query: {sourceMaps: config.webpack.sourcemaps}}
						]
					})
				},
				{
					test: /\.(woff|woff2|ttf|eot|svg|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
					loader: 'file-loader?name=res/[name].[ext]?[hash]'
				}
			]
		},
		plugins: [
			new ExtractTextPlugin("style.css")
		]
	};
};

module.exports = [serverAppConfigAngularCLI(), clientAppConfig(), serverConfig(), styleConfig()];
