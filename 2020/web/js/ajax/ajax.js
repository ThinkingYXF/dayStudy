// import baseConfig from './config';
// import util from './util';

let baseConfig = {
  url: '',
  method: 'get',
  baseUrl: 'http://47.93.232.133:8080/',
  // baseUrl: '/',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  responseType: 'json'
}

let util = {
  merge: function(now, target){
    now = now || {};
    for(let i in target){
      if(target[i] == '')
        continue;
      if(!now[i] || now[i] !== target[i])
        now[i] = target[i];
      else if(target[i].constructor == Object){
        util.merge(now[i], target[i]);
      }
    }
    return now;
  },
  dealUrl: function(url){
    let reg1 = /\.\//g;
    let reg = /\.\.\//g;
    url = url.replace(reg, '');
    url = url.replace(reg1, '');
    return url;
  },
  /**
   * 将json数据处理成form-data格式  (name=123&age=21); 
   */
  formatData: function(data){
    if(typeof data == 'string'){
      try{
        data = JSON.parse(data);
      }catch(e){
        return false;
      }
    }
    let str = '';
    for(let key in data){
      str += key + '=' + data[key] + '&';
    }
    str += '_timestamp=' + new Date().getTime();
    return str;
  }
}




/**
 * 原生ajax封装
 */
var Ajax = function(config){
  // this.config = util.merge(config, baseConfig);
}
Ajax.prototype.ajaxRequest = function(config, callback, errback){
  var xhr = new XMLHttpRequest();
  config.url = config.baseUrl + util.dealUrl(config.url);
  xhr.open(config.method, config.url);
  xhr.setRequestHeader('Content-Type', config.headers['Content-Type']);
  xhr.responseType = config.responseType;

  if(config.headers['Content-Type'] == 'application/x-www-form-urlencoded'){
    config.data = util.formatData(config.data);
  }

  xhr.send(config.data);
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4){
      if(xhr.status == 200){
        callback && callback(xhr.response);
      }else{
        errback && errback(xhr.response);
      }
    }
  }
}

let arr = ['get', 'delete', 'options'];
arr.forEach(method => {
  Ajax.prototype[method] = function(config, callback, errback){
    config = util.merge(config, baseConfig);
    return this.ajaxRequest(util.merge(config, {
      method: method,
      url: config.url,
      data: config.data
    }), callback, errback);
  }
});
let arr1 = ['put', 'post'];
arr1.forEach(method => {
  Ajax.prototype[method] = function(config, callback, errback){
    config = util.merge(config, baseConfig);
    return this.ajaxRequest(util.merge(config, {
      method: method,
      data: config.data,
      url: config.url
    }), callback, errback);
  }
});


// export default Ajax;