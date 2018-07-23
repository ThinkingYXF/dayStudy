define(['./a', './b', './c'],function(a, b, c){
	console.log('main');
	a.hello();
	b.hello();
	c.hello();
	return {
		hello: function(){
			console.log('hello main');
		}
	}
});
