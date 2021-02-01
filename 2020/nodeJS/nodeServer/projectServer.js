
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

//加密
const crypto = require('crypto');

if(cluster.isMaster){
	console.log(`主进程${process.pid}正在运行`);
	for(var i = 0; i < numCPUs; i++){
		cluster.fork();
	}
	cluster.on('exit',(worker, code, single)=>{
		console.log(`工作进程${worker.process.pid}已退出`);
	})
}else{
	http.createServer((req, res)=>{
		res.writeHead(200);
		res.end('Hello World');
	}).listen(8083);
	console.log(`工作进程${process.pid}已启动`);
}
const secret = 'abcdf';
const hash = crypto.createHmac('sha256',secret).update('').digest('hex');
console.log(hash);
