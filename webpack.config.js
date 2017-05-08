const webpack = require('webpack');
const path = require('path');
const webpackMerge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = require('./config.js');
const portals = require(path.join(path.resolve(__dirname, config.server.data.path), '/portals.json'));

const replacements = {
	'portals.json': () => portals,
	'config.js': () => config,
	'config.browser.js': () => config.client,
	'config.node.js': () => config.client
};

// config for client & server app

const defaultConfig = () => {
	// https://webpack.github.io/docs/configuration.html#devtool
	return {
		devtool: config.webpack.sourcemaps ? 'source-map' : undefined,
		context: __dirname,
		resolve: {
			extensions: ['*', '.ts', '.js']
		},
		output: {
			publicPath: path.resolve(__dirname),
			filename: 'index.js'
		},
		module: {
			loaders: [
				{test: /\.ts$/, loaders: ['awesome-typescript-loader', 'angular2-template-loader']},
				{test: /\.html$/, loader: 'raw-loader'},
				// {test: /\.css$/, loader: "style-loader!css-loader"},
				// {test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader'},
				// {test: /\.css$/, loader: 'raw-loader'},
				{test: /\.json$/, loader: 'raw-loader'}
			]
		},
		plugins: [
			new webpack.DefinePlugin({
				// do not use an object for 'process.env' otherwise all other environment
				// variables are set to 'undefined' see issue #291
				'process.env.NODE_ENV': JSON.stringify(config.webpack.debug ? 'development' : 'production'),
				'process.env.AOT': false
			}),
			new webpack.ContextReplacementPlugin(
				/angular(\\|\/)core(\\|\/)@angular/,
				root('../src')
				// path.resolve(__dirname, '../src')
			),
			new webpack.optimize.OccurrenceOrderPlugin(true),
			new webpack.LoaderOptionsPlugin({
				minimize: config.webpack.minimize,
				debug: config.webpack.debug
			})
		]
	};
};

// config for client app

const clientConfig = () => {
	let plugins = [
		new webpack.optimize.CommonsChunkPlugin({
			name: 'polyfills',
			chunks: ['polyfills']
		}),
		new webpack.optimize.CommonsChunkPlugin({
			// filename: 'vendor.js',
			// minChunks: Infinity,
			name: 'vendor',
			chunks: ['app'],
			minChunks: module => /node_modules/.test(module.resource)
		}),
		new webpack.NormalModuleReplacementPlugin(
			/zone\.js(\\|\/)dist(\\|\/)long-stack-trace-zone/,
			root('empty.js')
		)
	];

	// if (!config.webpack.debug) {
	// 	plugins = plugins.concat([
	// new webpack.ContextReplacementPlugin(
	// 	/angular(\\|\/)core(\\|\/)@angular/,
	// 	path.resolve(__dirname, '../src')
	// )
	// new webpack.NormalModuleReplacementPlugin(
	// 	/facade(\\|\/)async/,
	// 	root('node_modules/@angular/core/src/facade/async.js')
	// ),
	// new webpack.NormalModuleReplacementPlugin(
	// 	/facade(\\|\/)collection/,
	// 	root('node_modules/@angular/core/src/facade/collection.js')
	// ),
	// new webpack.NormalModuleReplacementPlugin(
	// 	/facade(\\|\/)errors/,
	// 	root('node_modules/@angular/core/src/facade/errors.js')
	// ),
	// new webpack.NormalModuleReplacementPlugin(
	// 	/facade(\\|\/)lang/,
	// 	root('node_modules/@angular/core/src/facade/lang.js')
	// ),
	// new webpack.NormalModuleReplacementPlugin(
	// 	/facade(\\|\/)math/,
	// 	root('node_modules/@angular/core/src/facade/math.js')
	// ),
	// new webpack.NormalModuleReplacementPlugin(
	// 	/@angular(\\|\/)upgrade/,
	// 	root('empty.js')
	// ),
	// new webpack.NormalModuleReplacementPlugin(
	// 	/dom(\\|\/)debug(\\|\/)ng_probe/,
	// 	root('empty.js')
	// ),
	// new webpack.NormalModuleReplacementPlugin(
	// 	/dom(\\|\/)debug(\\|\/)by/,
	// 	root('empty.js')
	// ),
	// new webpack.NormalModuleReplacementPlugin(
	// 	/src(\\|\/)debug(\\|\/)debug_node/,
	// 	root('empty.js')
	// ),
	// new webpack.NormalModuleReplacementPlugin(
	// 	/src(\\|\/)debug(\\|\/)debug_renderer/,
	// 	root('empty.js')
	// )
	// ]);
	// }

	if (config.webpack.minimize) {
		plugins.push(new webpack.optimize.UglifyJsPlugin({
			// beautify: true,
			// mangle: false,
			output: {
				comments: false
			},
			comments: false,
			compress: {
				warnings: false,
				conditionals: true,
				screw_ie8: true,
				unused: true,
				evaluate: true,
				loops: true,
				comparisons: true,
				sequences: true,
				dead_code: true,
				evaluate: true,
				if_return: true,
				join_vars: true,
				negate_iife: false // we need this for lazy v8
			},
			sourceMap: config.webpack.sourcemaps
		}));
	}

	if (config.webpack.analyze) {
		plugins.push(new BundleAnalyzerPlugin({
			analyzerMode: 'static', // server|disabled|static
			reportFilename: 'report.html',
			openAnalyzer: false,
			generateStatsFile: true,
			statsFilename: 'stats.json',
		}));
	}

	return {
		target: 'web',
		entry: {
			app: './src/client/client',
			polyfills: './src/client/polyfills'
		},
		recordsPath: root('webpack.records.json'),
		output: {
			path: root('dist/client'),
			filename: '[name].js'
		},
		externals: (context, request, cb) => {
			let replacement = replacements[request];
			if (!replacement) return cb();
			return cb(null, 'var ' + JSON.stringify(replacement()));
		},
		plugins: plugins,
		node: {
			global: true,
			crypto: 'empty',
			__dirname: true,
			__filename: true,
			process: true,
			Buffer: false
		}
	};
};

// config for server app

const serverConfig = () => {
	return {
		target: 'node',
		entry: './src/server/server', // use the entry file of the node server if everything is ts rather than es5
		output: {
			path: root('dist/server'),
			libraryTarget: 'commonjs2'
		},
		externals: (context, request, cb) => {
			let replacement = replacements[request];
			if (replacement) return cb(null, 'var ' + JSON.stringify(replacement()));
			if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
				return cb(null, 'commonjs ' + request);
			}
			cb();
		},
		// externals: includeClientPackages(
		// 	/@angularclass|@angular|angular2-|ng2-|ng-|@ng-|angular-|@ngrx|ngrx-|@angular2|ionic|@ionic|-angular2|-ng2|-ng/
		// ),
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

// config for css

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
			extensions: ['*', '.scss']
		},
		module: {
			loaders: [
				{
					test: /\.scss$/,
					use: ExtractTextPlugin
						.extract({
							fallback: 'style-loader',
							use: [
								{loader: 'css-loader', query: {modules: false, sourceMaps: true}},
								// { loader: 'postcss-loader' },
								{loader: 'sass-loader', query: {sourceMaps: true}}
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

// Helpers

function root(args) {
	args = Array.prototype.slice.call(arguments, 0);
	return path.join.apply(path, [__dirname].concat(args));
}

module.exports = [
	// Style
	styleConfig(),
	// Client
	webpackMerge({}, defaultConfig(), clientConfig()),
	// Server
	webpackMerge({}, defaultConfig(), serverConfig())
];