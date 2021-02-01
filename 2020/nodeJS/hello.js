var helloModule = function(){
	var name = 'hello ***';
	return {
		a: function(){
			console.log(name);
		},
		b: function(){
			console.log(111);
		}
	}
}
module.exports = helloModule;
