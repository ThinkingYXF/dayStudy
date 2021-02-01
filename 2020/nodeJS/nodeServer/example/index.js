window.onload = function(){
	var globalFood = '';
	//选择
	var button = document.getElementById('choose');
	var h3 = document.getElementById('h3');
	function getData(url, callback){
		var httpRequest = new XMLHttpRequest();
		httpRequest.open('GET',url);
		httpRequest.send();
		httpRequest.onreadystatechange = function(json){
			var result = json.target.response;
			if(!result.length)
				return false;
			if(typeof callback == 'function')
				callback(JSON.parse(result));
		};
	}
	getData('food.json',function(json){
		globalFood = json.food;
	});

	button.onclick = function(){
		if(globalFood.length === 0){
			h3.innerText = '暂无食物';
			return false;
		}
		var i = 0;
		var timer = setInterval(function(){
			var number = parseInt(Math.random()*globalFood.length);
			h3.innerText = globalFood[number];
			i++;
			if(i > 20){
				clearInterval(timer);
				var random = parseInt(Math.random()*globalFood.length);
				h3.innerText = globalFood[random];
			}
		},50);
	}
	//添加
	var add = document.getElementById('add');
	var input = document.getElementById('like');
	add.onclick = function(){
		var value = input.value;
		if(value){
			var http = new XMLHttpRequest();
			http.open('POST','http://192.168.1.219:8088');
			http.send(value);
			http.onreadystatechange = function(json){
				var result = json.target.response;
				input.value = '';

				var tip = document.getElementById('tip');
				var h4 = tip.getElementsByTagName('h4')[0];
				tip.style.display = 'block';
				h4.innerText = '添加成功';
				var timer = setInterval(function(){
					var height = tip.offsetHeight;
					height -= 5;
					tip.style.height = height + 'px';
					if(height <= 0){
						tip.style.display = 'none';
						tip.style.height = '92px';
						clearInterval(timer);
					}
				},100);

				getData('food.json',function(json){
					globalFood = json.food;
				});
			}
		}
	}
	//显示
	var show = document.getElementById('show');
	var showDiv = document.getElementById('showDiv');
	show.onclick = function(){
		if(showDiv.style.display == '' || showDiv.style.display == 'none'){
			showDiv.style.display = 'block';
		}else{
			showDiv.style.display = 'none';
			return false;
		}
		// var result = json.target.response;
		// if(!result.length)
		// 	return false;
		// var globalFood = JSON.parse(result).food;

		var content = globalFood.join(' ');
		showDiv.innerText = content;
	}
}
