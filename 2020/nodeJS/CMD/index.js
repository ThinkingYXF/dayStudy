define(function(require, exports){
	console.log('main');
	var a = require('./a');
	var b = require('./b');
	var c = require('./c');
	var json = require('./json');
	console.log(json);
	a.hello();
	b.hello();
	c.hello();
	//如果 条件依赖  则是用require.async();					直接使用require会将js文件都下载下来
	//if() require.async('./a', function(a){a.hello()});

	require('jquery');			//引入jquery
	$('body').append('<h1>hello world</h1>');

	require('{locale}');		//config  vars 配置
});
