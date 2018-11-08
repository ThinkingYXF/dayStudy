import axios from 'axios';
//公共地址
const baseUrl = 'http://localhost:8099/';

var extend = function(a, b){
	var c = {};
	for(let k in a){
		c[k] = a[k];
	}
	for(let k in b){
		c[k] = b[k];
	}
	return c;
}

var middleAjax = {
	url: '',
	type: 'post',
	save: function(data, callback, type, errback){
		type = type ? type : this.type;
		var ajaxType = axios[type];
		ajaxType(this.url, data).then(function(res){
			callback(res);
		});
	}
}

var ajaxRequest = {
	getDate: extend(middleAjax, {
		type: 'get',
		url: 'https://yesno.wtf/api'
	}),
	//登录接口
	login: extend(middleAjax, {
		url: baseUrl + 'login'
	})
}

export { ajaxRequest }
