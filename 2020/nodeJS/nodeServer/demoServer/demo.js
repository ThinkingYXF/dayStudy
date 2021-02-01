const circle = require('./circle.js');
console.log(`半径为5的圆的面积为${circle.area(5)},周长为${circle.circumference(5)}`);

const qs = require('querystring');
var str = 'name=haha&arr=123&arr=234';
console.log(qs.parse(str));
var str1 = {
	name: '111',
	friends:['dgh','qe']
}
console.log(qs.stringify(str1))
