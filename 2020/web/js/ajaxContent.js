//AJAX 连接池
var AJAXConnectionPool = function() {
    // 任务队列
    var taskQueue = [];
    // 请求缓冲池
    var requestBufferPool = [];
    // 最大连接数
    var maxThreadNumber = 5;
    return {
        /**
        * 发送请求
        *
        * @param {请求方法 post|get} method
        * @param {请求URL地址} url
        * @param {数据} data
        * @param {回调函数} callback
        */
        send : function(method, url, data, callback) {
            // 这是一个空闲请求
            if(requestBufferPool.length <= maxThreadNumber){
                var request = $.ajax({
                    url: url,
                    method: method,
                    data: data
                }).success(function(json){
                    if(callback && $.isFunction(callback))
                        callback(json);
                    requestBufferPool.shift();
                    if (taskQueue.length > 0) {
                        // 这里有多个任务处于队列中等待连接，首先执行第一个任务
                        var task = taskQueue.shift();
                        AJAXConnectionPool.send(task.method, task.url, task.data,task.callback);
                    }
                });
                requestBufferPool.push(request);
            }
            else {
                var task = {
                    method : method,
                    url : url,
                    data : data,
                    callback : callback
                };
                taskQueue.push(task);
            }
        }
    };
}();
var urls = ['../json/data.json','../json/data1.json',
'../json/data2.json','../json/data3.json',
'../json/data4.json','../json/table.json','../json/rowData.json'];
var count = 0;
function sendAjax(method,url){
    // 发送数据并通过异步回调处理函数
    var method = method;
        url    = url;
    AJAXConnectionPool.send(method, url, null, function(json) {
        count++;
        if(count == 7){
            console.log(new Date().getTime());
        }
        // 回调函数处理逻辑
        console.log('finished!',json);
    });
}
(function(){
    console.log(new Date().getTime());
    $.each(urls,function(k,v){
        sendAjax('GET',v);
    });
})();

