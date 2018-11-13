import axios from 'axios';
import { Message } from 'element-ui';

//公共地址
const baseUrl = 'http://localhost:8888/';

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
	// contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
	contentType: 'application/json; charset=UTF-8',
	save: function(data, callback, type, errback){
		type = type ? type : this.type;
		var ajaxType = axios[type];
		ajaxType(this.url, data, {
			contentType: this.contentType,
		}).then(function(res){
			//成功后的回调
			callback(res);
		}).catch(error =>{
			errback(error);
			Message({
				message: '系统出错',
				type: 'error'
			});
		});
	}
}

var ajaxRequest = {
	test: extend(middleAjax, {
		// type: 'get',
		url: baseUrl + 'abc'
	}),
	getDate: extend(middleAjax, {
		type: 'get',
		url: 'https://yesno.wtf/api'
	}),
	//注册接口
	register:extend(middleAjax, {
		url: baseUrl + 'register'
	}),
	//登录接口
	login: extend(middleAjax, {
		url: baseUrl + 'login'
	}),
	//查询用户
	searchUser: extend(middleAjax, {
		url: baseUrl + 'searchUser'
	}),
	//获取省市县
	getCity: extend(middleAjax, {
		url: '/server/city.json',
		type: 'get'
	}),
	//获取西方city
	getWestCity: extend(middleAjax, {
		url: '/server/westCity.json',
		type: 'get'
	})
}

export { ajaxRequest }
