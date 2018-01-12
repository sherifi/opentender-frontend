const fs = require('fs');
const path = require('path');
const rxPaths = require('rxjs/_esm5/path-mapping');
const {CommonsChunkPlugin} = require('webpack').optimize;
const {AngularCompilerPlugin, PLATFORM} = require('@ngtools/webpack');
const {NoEmitOnErrorsPlugin, SourceMapDevToolPlugin, NamedModulesPlugin, NormalModuleReplacementPlugin, ContextReplacementPlugin} = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const {NamedLazyChunksWebpackPlugin} = require('@angular/cli/plugins/webpack');
const utils = require('./webpack.utils.js');

let WebpackNotifierPlugin;

const clientAppConfig = () => {
	const nodeModules = utils.root('node_modules');
	const realNodeModules = fs.realpathSync(nodeModules);
	const genDirNodeModules = path.join(utils.root('src'), '$$_gendir', 'node_modules');
	let plugins = [];
	if (utils.config.devMode) {
		if (!WebpackNotifierPlugin) {
			WebpackNotifierPlugin = require('webpack-notifier');
		}
		plugins.push(new WebpackNotifierPlugin({title: "Opentender Client Build", alwaysNotify: true}));
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
			"path": utils.root("dist/client"),
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
				...utils.styleLoaders,
				{
					"test": /\.ts$/,
					"loader": "@ngtools/webpack"
				}
			]
		},
		"plugins": [
			...plugins,
			new NoEmitOnErrorsPlugin(),
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
				utils.root('empty.js')
			),
			new ContextReplacementPlugin(/rxjs[\/\\]testing/, /nope/),
			new ContextReplacementPlugin(/moment[\/\\]locale$/, /de.js|it/),
			new AngularCompilerPlugin({
				"mainPath": "client/client.ts",
				"platform": PLATFORM.Browser,
				"hostReplacementPaths": {
					"environments/environment.ts": utils.config.devMode ? "environments/environment.ts" : "environments/environment.prod.ts"
				},
				"sourceMap": utils.config.devMode,
				"tsConfigPath": "src/tsconfig.browser.json",
				"skipCodeGeneration": true,
				"compilerOptions": {
					"fullTemplateTypeCheck": true
				},
				"exclude": ['src/server/**/*', 'server/**/*']
			})
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
				return utils.loadJSON(context, request, cb);
			}
			cb();
		},
		"devServer": {
			"historyApiFallback": true
		}
	};

};

module.exports = clientAppConfig();
