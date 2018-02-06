import _ from 'lodash';				//文件加载
import './style.css';				//样式加载
import Icon from './wlogo.png';		//图片加载
import Data from './data.json';		//数据加载
import printMe from './print.js';	//加载js方法

function component(){
	var element = document.createElement('div');
	element.innerHTML = _.join(['Hello', 'webpack1'],' ');

	//加入图片
	var icon = new Image();
	icon.src = Icon;
	element.appendChild(icon);
	console.log(Data);

	var btn = document.createElement('button');
	btn.innerHTML = 'Button';
	btn.onclick = printMe;
	element.appendChild(btn);

	return element;
}
document.body.appendChild(component());

if(module.hot){
	module.hot.accept('./print.js', function(){
		console.log('Accept the updated printMe module');
		printMe();
	});
}
