//懒加载模块

import _ from 'lodash';

function lazyModule(){
	var element = document.createElement('div');
	var button = document.createElement('button');
	button.innerHTML = 'lazy-load';

	element.innerHTML = _.join(['This', 'is a', 'lazy module'], ' ');
	element.appendChild(button);

	button.onclick = e => import('./lazy').then(module => {
		var lazy = module.default;
		lazy();
	})
	return element;
}
document.body.appendChild(lazyModule());


