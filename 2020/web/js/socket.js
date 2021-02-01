var express = require('express');
var app = express();
var serever = require('http').creatSerever(app);
var io = require('socket.io')(serever);

serever.listen(port,function(data){
    
})

io.on('connection',function(socket){
    socket.emit('chat message');
    
    socket.on('new message',function(data){
        console.log(data);
        socket.broadcast.emit();
    });
    socket.on('message',function(data){
        console.log('receive message',data);
        socket.broadcast.emit();
    });
})