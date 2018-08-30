const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const webpack = require('webpack');

module.exports = {
	// entry: './src/index.js',
	entry: {
		app: './src/index.js',						//入口
		// print: './src/print.js'
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),			//清除dist下冗余文件
		new HtmlWebpackPlugin({
			title: 'webpack html'					//更新index.html文件
		}),
		new webpack.HotModuleReplacementPlugin()	//模块热替换
	],
	devServer: {
		contentBase: './dist',						//开发工具  实时编译
		hot: true									//模块热替换
	},
	output: {
		// filename: 'main.js',
		filename: '[name].bundle.js',				//出口
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/'								//模块热替换
	},
	module:{
		rules:[{
			test: /\.css$/,
			use: ['style-loader', 'css-loader']		//加载css文件
		}, {
			test: /\.(png|jpg|jpeg|gif)$/,			//加载文件(图片，字体等)
			use: ['file-loader']
		}]
	},
	mode: 'development'								//开发模式
	// mode: 'production'									//生产模式
}
