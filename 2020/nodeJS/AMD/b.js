define(function(require, exports, module){
	console.log('b', module.uri);
	module.exports = {
		name: 'b moudle',
		hello: function(){
			console.log('hello bbb');
		}
	}
});
