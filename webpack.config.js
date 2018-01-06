const WebpackSynchronizableShellPlugin = require('webpack-synchronizable-shell-plugin');

const utils = require('./webpack.utils.js');

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
				onBuildStart: {scripts: ['npm run build:universal' + (utils.config.devMode ? '' : ':prod')], blocking: true, parallel: false}
			})
		]
	};
};

module.exports = [
	require('webpack.styles.js'),
	require('webpack.app-client.js'),
	serverAppConfigAngularCLI(),
	// require('webpack.app-server.js'),
	require('webpack.server.js')
];
