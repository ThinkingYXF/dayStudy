'use strict'
const vm = require('vm');

const code = `(function(require){
	const http = require('http');
	http.createServer((req,res)=>{
		res.writeHead(200,{'Content-Type': 'text-plain'});
		res.end('Hello World\\n');
	}).listen(8083);
	console.log('The server is success running at http://localhost:8083/');
})`;
vm.runInThisContext(code)(require);
