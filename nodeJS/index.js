exports.handler = function(){
	console.log('start');
	var WebSocketServer = require('ws').Server;
	var wss = new WebSocketServer({port: 8083});
	wss.on('connection',function(ws){
		console.log('client connected');
		ws.on('message',function(message){
			console.log(message);
		});
	});
	console.log('end');
}
