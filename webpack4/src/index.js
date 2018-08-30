import _ from "lodash";
import "./style.css";
import errImg from "./error.png";

// import printMe from './print.js'

import { cube } from './print.js'

if(process.env.NODE_ENV!='production')
	console.log('we are in development modal');

function component(){
	var element = document.createElement('div');
	element.innerHTML = _.join(['hello', 'webpack'], ' ');
	element.classList.add('div');
	//图片
	var img = new Image();
	img.src = errImg;
	//按钮
	var button = document.createElement('button');
	button.innerHTML = '按钮'
	button.onclick = function(){
		console.log('5的立方是：'+cube(5));
	};

	element.appendChild(img);
	element.appendChild(button);
	return element;
}
let element = component();
document.body.appendChild(element);

if(module.hot){
	module.hot.accept('./print.js', function(){
		console.log('updating print module');
		// printMe();

		document.removeChild(element);
		element = component();
		document.body.appendChild(element);
	})
}
