const path = require('path');
const {ContextReplacementPlugin} = require('webpack');
const utils = require('./webpack.utils.js');

// config for server.js (express app)

const serverConfig = () => {
	return {
		target: 'node',
		resolve: {extensions: ['*', '.js', '.ts']},
		entry: './server.ts',
		output: {
			path: utils.root('dist/server'),
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
				return utils.loadJSON(context, request, cb);
			}
			if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
				return cb(null, 'commonjs ' + request);
			}
			cb();
		},
		plugins: [
			// Temporary Fix for issue: https://github.com/angular/angular/issues/11580
			// for "WARNING Critical dependency: the request of a dependency is an expression"
			new ContextReplacementPlugin(
				/(.+)?angular(\\|\/)core(.+)?/,
				utils.root('src'), // location of your src
				{} // a map of your routes
			),
			new ContextReplacementPlugin(
				/(.+)?express(\\|\/)(.+)?/,
				utils.root('src'),
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

module.exports = serverConfig();
