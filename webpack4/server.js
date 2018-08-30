//结合nodejs服务端实现开发环境

const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

var app = express();
var config = require('./webpack.config');
var compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
	publicPath: config.output.publicPath
}));

app.listen(3000, function(){
	console.log('server start success, listen 3000 port');
})
