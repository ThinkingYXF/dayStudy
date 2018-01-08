var fs = require('fs');
var express = require('express');
var app = express();
var dir = './interface';
fs.readdir(dir,function(err,files){
	if(err){
		console.log('读取服务器接口目录错误');
	}else{
		for(var i in files){
			var filename = files[i];
			var last = filename.lastIndexOf('.');
			if(last > 0){
				filename = filename.substring(0, last);
				console.log(filename,'aa');
				app.get('/' + filename, function(req, res){
					res.setHeader('Access-Control-Allow-Origin','*');
					progress(req, res);
				});
				app.post('/' + filename, function(req, res){
					res.setHeader('Access-Control-Allow-Origin','*');
					progress(req, res);
				});
				app.put('/' + filename, function(req, res){
					res.setHeader('Access-Control-Allow-Origin', '*');
					progress(req, res);
				});
				app.options('/' + filename, function(req, res){
					res.setHeader('Access-Control-Allow-Origin', '*');
					progress(req, res);
				})
			}
		}
	}
});
var server = app.listen(8082,function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log(host,port);
})
function progress(req, res){
	var name = dir + '/' + req.path + '.json';
	fs.readFile(name,function(err, data){
		if(err){
			var msg = '请求失败' + req.path;
			console.log(msg);
			res.send(msg);
		}else{
			var content = data.toString();
			res.send(content);
		}
	})
}
