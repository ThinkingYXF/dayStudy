var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var sUrl = require('url');
var documentRoot = '/home/yangxuefeng/Documents/work/study/';
//var documentRoot = '/home/yangxuefeng/Documents/work/nodeSocket/nodejs-socketio-chat/'
var server = http.createServer(function(req,res){
	//设置请求头,允许所有域名访问 防止跨域
	res.setHeader("Access-Control-Allow-Origin" , "*");
	var url = req.url;
	var file = documentRoot + url;
	fs.readFile(file, function(err, data){
		var fileTypes = {
			'.html': 'text/html;charset="utf-8"',
			'.css': 'text/css',
			'.js': 'application/javascript',
			'.json': 'application/json',
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

server.on('request',(req, res)=>{
	if(req.method == 'POST' && req.url == '/product'){
		var data = '';
		req.on('data',(chunk)=>{
			chunk = JSON.parse(chunk.toString()).data;
			var id = '';
			for(var k in chunk)
				id = k;
			var json = {
				data: chunk[id]
			}
			json['data']['id'] = id;
			data = json;
		});
		// req.end(data);
		req.on('end',()=>{
			var result = JSON.parse(fs.readFileSync( documentRoot + 'web/mobile/data.json'));
			for(var i=0;i<result.data.length;i++){
				if(result.data[i].id == data.data['id']){
					dealObj(result.data[i],data.data);
				}
			}
			// if(!isRepeat){
			// 	var newFood = {
			// 		id: result.length,
			// 		value: data,
			// 		weight: 1
			// 	}
			// 	result.food.push(newFood);
			// }
			fs.writeFile('data.json', JSON.stringify(result), (err) => {
				if (err) throw err;
			});
			// return data;

			function dealObj(result,obj){
				for(var k in obj){
					if(typeof obj[k] != 'object')
						result[k] = obj[k];
					else{
						dealObj(result[k],obj[k]);
					}
				}
			}
		});
	}
})

