var http = require('http');
var url = require('url');
var qs = require('querystring');
var server = http.createServer(function(req,res){
	res.setHeader('Access-Control-Allow-Origin','*');
	var query = url.parse(req.url).query;
	var queryObj = qs.parse(query);
	var myUrl = queryObj.myUrl;
	var data = '';
	http.get(myUrl,function(request){
		request.setEncoding('utf8');
		request.on('data',function(response){
			data += response;
		})
	})
	console.log('someone conneted');
	res.writeHeader(200,{
		'content-type':'text/html;charset="utf-8"'
	});
	res.write('这是正文部分');
	res.end();
}).listen(8082);
console.log('server start success');
