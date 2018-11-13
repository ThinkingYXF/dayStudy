let express = require('express'),
    app = express(),
    http = require('http');

//跨域
var domain = 'http://localhost:8090';
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", domain);
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


//mysql 连接
let config = require('./config'),
    dbconfig = config.config.dbconfig,
    mysql = require('mysql'),
    connection = mysql.createConnection(dbconfig);
connection.connect();

//后台接口模块
var apiInterface = require('./interface');
apiInterface.Apis(app, connection);

// connection.end();

var server = http.createServer(app);
server.listen(8888);