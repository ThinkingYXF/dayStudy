var ajaxRequest = function(){
	this.getDate = function(url,callback){
			var xhrHttp = new XMLHttpRequest();
			xhrHttp.open('GET',url);
			xhrHttp.send();
			xhrHttp.onload = function(){
				var response = xhrHttp.response;
				if(typeof callback === 'function' && callback)
					callback(response);
			}
		}
}
export {ajaxRequest}
