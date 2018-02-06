const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');	//打包html
const CleanWebpackPlugin = require('clean-webpack-plugin');	//清除dist无用文件
const webpack = require('webpack');

module.exports = {
	// entry: './src/index.js',
	entry: {
		// app: './src/index.js',
		// print: './src/print.js',
		app: './src/index.js'
	},
	devServer: {
		contentBase: './dist',
		hot: true
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Output Management'
		}),
		new CleanWebpackPlugin(['dist']),
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin()
	],
	output: {
		// filename: 'bundle.js',
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/'
	},
	module: {
		rules: [{
			test: /\.css$/,
			use: ['style-loader', 'css-loader']
		},{
			test: /\.(png|svg|jpg|gif)$/,
			use: ['file-loader']
		}]
	}
}
