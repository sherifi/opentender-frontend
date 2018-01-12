const fs = require('fs');
const path = require('path');
const {AngularCompilerPlugin, PLATFORM} = require('@ngtools/webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const {NamedLazyChunksWebpackPlugin} = require('@angular/cli/plugins/webpack');
const {DefinePlugin, NoEmitOnErrorsPlugin, SourceMapDevToolPlugin, NamedModulesPlugin} = require('webpack');
const {ModuleConcatenationPlugin} = require('webpack').optimize;

const utils = require('./webpack.utils.js');

// config for server app (not working, since for lazy route loading support, the server app MUST be build with angular-cli (januar 2018)

const serverAppConfig = () => {
	return {
		target: 'node',
		entry: './src/server/server.main.ts',
		output: {
			filename: 'server.app.js',
			path: utils.root('dist/server'),
			libraryTarget: 'commonjs2',
			chunkFilename: "[id].chunk.js",
			publicPath: utils.rootFolder(),
		},
		module: {
			rules: [
				{test: /\.html$/, loader: 'raw-loader'},
				{test: /\.json$/, loader: 'raw-loader'},
				...utils.styleLoaders,
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
				'process.env.NODE_ENV': JSON.stringify(utils.config.devMode ? 'development' : 'production'),
				'process.env.AOT': false
			}),
			new ModuleConcatenationPlugin(),
			new NoEmitOnErrorsPlugin(),
			new CircularDependencyPlugin({
				exclude: /src\/app\/thirdparty|node_modules/,
				"failOnError": false,
				"onDetected": false,
				"cwd": utils.rootFolder()
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
				"compilerOptions": {
					"fullTemplateTypeCheck": true
				},
				"exclude": ['src/client/**/*']
			})
		],
		externals: (context, request, cb) => {
			if (request.indexOf('.json') >= 0 && request.charAt(0) === '.') {
				return utils.loadJSON(context, request, cb);
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

module.exports = serverAppConfig();
