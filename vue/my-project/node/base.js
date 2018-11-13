exports.success = function(message, data){
    var json = {
        success: true
    }
    if(message)
        json['message'] = message;
    if(data)
        json['data'] = data;
    return json;
}
exports.getTimestamp = function(){
    return parseInt((new Date().getTime()) / 1000);
}