var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var sUrl = require('url');
var documentRoot = '/home/yangxuefeng/Documents/work/study';
var server = http.createServer(function(req,res){
	//设置请求头,允许所有域名访问 防止跨域
	res.setHeader("Access-Control-Allow-Origin" , "*");
	var url = req.url;
	var file = documentRoot + url;
	console.log(url);
	fs.readFile(file, function(err, data){
		var fileTypes = {
			'.html': 'text/html;charset="utf-8"',
			'.css': 'text/css',
			'.js': 'application/javascript',
			'.txt': 'text/plain',
			'.java': 'java/*'
		};
		var fileType = 'text/html';
		for(var i in fileTypes){
			if(file.indexOf(i)!==-1){
				fileType = fileTypes[i];
			}
		}
		if(err){
			res.writeHeader(404,{
				'content-type': fileType
			});
			res.write('<h1>404 error,<p>Can\'t find your page!</p></h1>');
			res.end();
		}else{
			res.writeHeader(200,{
				'content-type': fileType
			});
			res.write(data);
			res.end();
		}
	});
}).listen(8082);
console.log('server start success');
