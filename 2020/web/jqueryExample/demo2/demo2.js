window.onload = function(){
	var btns = document.getElementsByClassName('btn'),
	// imgs = document.getElementsByClassName('box')[0].getElementsByTagName('img');
	imgs = document.getElementsByClassName('box')[0].getElementsByTagName('section');

	var index = 2,
		front = 0,
		back = 0,
		offset = false;
		// timer = setInterval(timer,5000);



	for(var i=0;i<btns.length;i++){
		(function(i){
		btns[i].onclick = function(){click(i)};
		})(i);

		btns[i].onmouseover = function(){
		offset = true;
		}
		btns[i].onmouseout = function(){
		offset = false;
		}
	}

	for(var i=0;i<imgs.length;i++){
		imgs[i].onmouseover = function(){
		offset = true;
		}
		imgs[i].onmouseout = function(){
		offset = false;
		}
	}

	function timer(){
		console.log(offset)
		if(offset){
			return;
		}
		else{
			click(1)
		}
	}

	function click(x){
		imgs[index].setAttribute('class','');
		if(x === 0){
			if(--index < 0){
				index = --imgs.length;
			}
			front = back = index;
			if(++front > --imgs.length){front = 0}
			if(--back < 0){back = --imgs.length}
			imgs[front].style.zIndex = '1';
			imgs[back].style.zIndex = '0';
		}
		else{
			if(++index > --imgs.length){
				index = 0;
			}
			front = back = index;
			if(++front > --imgs.length){front = 0}
			if(--back < 0){back = --imgs.length}
			imgs[front].style.zIndex = '0';
			imgs[back].style.zIndex = '1';
		}
		imgs[index].style.zIndex = '10';
		imgs[front].setAttribute('class','front')
		imgs[back].setAttribute('class','back')
		imgs[index].setAttribute('class','active');
	}
}
