let bodyParser = require('body-parser');							//解析params
// var urlencodedParser = bodyParser.urlencoded({ extended: false });	//

let base = require('./base');
let md5 = require('md5');

var Apis = function(app, connection){
    //解析json
    app.use(bodyParser.json());
    //解析formdata
    app.use(bodyParser.urlencoded({extended: false}));

    //注册接口
    app.post('/register', function(req, res){
        var data = req.body;
        if(data.password != data.checkPass){
            res.status(200);
            res.json(base.success('密码输入不一致'));
            return false;
        }else
            delete data.checkPass;
        data.password = md5(data.password);
        data.created_time = base.getTimestamp();
        connection.query("insert into usr_user set ?", data, function(err, results, fields){
            if(err) throw err;
            res.status(200);
            res.json(base.success());
        });
    });

    //登录接口
    app.post('/login', function(req, res){
        var data = req.body;
        connection.query("select * from usr_user where name=?", [data.name], function(err, results, fields){
            if(err) throw err;
            res.status(200);
            if(results.length){
                if(results[0].password === md5(data.password)){
                    res.json(base.success());
                }else{
                    res.json(base.success('账号密码不匹配'));
                }
            }else{
                res.json(base.success('用户名不存在'));
            }
        });
    });

    //查询用户
    app.post('/searchUser', function(req, res){
        var data = req.body;
        connection.query("select id, name, phone, email, icon, created_time, flag from usr_user where name=?", [data.name], function(err, results, fields){
            if(err) throw err;
            res.status(200);
            if(results.length){
                res.json(base.success(null, results));
            }else{
                res.json(base.success(null, []));
            }
        });
    });


    app.post('/abc', function(req, res){
        connection.query('select * from city where ID="1001"', function(err, results, fields){
            if(err) throw err;
            console.log(results);
        });
        console.log(req.body);
        res.status(200);
        res.json({
            success: true
        });
        
    })
} 


exports.Apis = Apis;