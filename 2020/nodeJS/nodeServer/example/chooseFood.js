var http = require('http');
var fs = require('fs');
var urlRoot = '/home/yangxuefeng/Documents/work/study/server/nodeServer/example/';

var server = http.createServer((req, res)=>{
	res.setHeader("Access-Control-Allow-Origin" , "*");
	var file = urlRoot + req.url;
	fs.readFile(file, (err, data)=>{
		var fileTypes = {
			'.html': 'text/html;charset="utf-8"',
			'.css': 'text/css',
			'.js': 'application/javascript',
			'.json': 'application/json',
			'.txt': 'text/plain',
			'.java': 'java/*'
		};
		for(var i in fileTypes){
			if(file.indexOf(i)!==-1){
				fileType = fileTypes[i];
			}
		}
		if(err){
			res.write('error:' + err);
			res.end();
		}else{
			res.writeHead(200, {
				'content-type': fileType
			});
			res.write(data);
			res.end();
		}
	})
}).listen(8088);

server.on('request',(req, res)=>{
	if(req.method == 'POST'){
		var data = '';
		req.on('data',(chunk)=>{
			data+= chunk;
		});
		req.on('end',()=>{
			var result = JSON.parse(fs.readFileSync( urlRoot + 'food.json'));
			if(result.food.indexOf(data) != -1)
				return false;
			result.food.push(data);
			fs.writeFile('food.json', JSON.stringify(result), (err) => {
				if (err) throw err;
			});
		})
	}
})
