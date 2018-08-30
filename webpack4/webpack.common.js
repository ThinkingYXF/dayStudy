//webpack公共配置文件

const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		app: './src/index.js',
		another: './src/another-module.js',			//模块分离
		lazy: './src/lazy-module.js'
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			title: 'Production'
		}),
		new webpack.HashedModuleIdsPlugin()			//vendors不会在重新编译
	],
	output: {
		// filename: '[name].bundle.js',
		filename: '[name].[chunkhash].js',			//使用hash (利于缓存与更新)
		path: path.resolve(__dirname, 'dist')
	},
	optimization: {
		// splitChunks: {
		// 	chunks: 'all'							//去除重复的依赖模块
		// }

		runtimeChunk: 'single',
		splitChunks: {
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,	//缓存消除请求 并及时更新不同文件
					name: 'vendors',
					chunks: 'all'
				}
			}
		}
	},
	module:{
		rules:[{
			test: /\.css$/,
			use: ['style-loader', 'css-loader']		//加载css文件
		}, {
			test: /\.(png|jpg|jpeg|gif)$/,			//加载文件(图片，字体等)
			use: ['file-loader']
		}]
	}
}
