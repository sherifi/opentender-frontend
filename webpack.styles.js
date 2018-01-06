const ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = require('./config.js');
const utils = require('./webpack.utils.js');

const styleConfig = () => {
	return {
		target: 'node',
		entry: './src/style/style.scss',
		output: {
			path: utils.root('dist/style'),
			filename: '_style.js'
		},
		devtool: utils.config.devMode ? 'source-map' : undefined,
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
									minimize: !utils.config.devMode,
									sourceMap: utils.config.devMode,
									importLoaders: 2,
									localIdentName: '[name]__[local]___[hash:base64:5]'
								}
							},
							{loader: 'postcss-loader'},
							{loader: 'sass-loader', query: {sourceMaps: utils.config.devMode}}
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

module.exports = styleConfig();
