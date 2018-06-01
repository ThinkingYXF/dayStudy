var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http');


var app = express();
http.createServer(app).listen(8099);

urlencodedParser = bodyParser.urlencoded({ extended: false });

app.get('/demo', function(req, res){
	res.json({name: '111'});
});
app.post('/register', urlencodedParser, function(req, res){
	console.log(req.body);
});
app.post('/login', urlencodedParser, function(req, res){
	console.log(req.body);
});
