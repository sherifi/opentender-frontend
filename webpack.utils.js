const fs = require('fs');
const path = require('path');
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
const cssnano = require('cssnano');
const customProperties = require('postcss-custom-properties');

const config = require('./config.js');
const pck = require('./package.json');
config.client.version = pck.version;

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

const styleLoaders = [
	{
		"exclude": [
			root("src/styles"),
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
			root("src/styles/styles")
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
			root("src/styles.scss"),
			root("src/fonts/icomoon/icomoon.css"),
			root("src/fonts/open-sans/open-sans.css")
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
			root("src/styles"),
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

module.exports = {
	rootFolder,
	root,
	styleLoaders,
	config: {
		devMode: config.client.devMode
	},
	NopePlugin,
	loadJSON
};
