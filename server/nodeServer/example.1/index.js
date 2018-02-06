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

	var isRun = true;
	button.onclick = function(){
		if(globalFood.length === 0){
			h3.innerText = '暂无食物';
			return false;
		}
		var weightSum = 0;
		var weightObj = {};
		for(var j = 0;j < globalFood.length; j++){
			var num = weightSum;
			weightSum += globalFood[j].weight;
			weightObj[globalFood[j].value] = [num, weightSum];
		}
		if(isRun){
			var i = 0;
			isRun = false;
			var timer = setInterval(function(){
				var number = parseInt(Math.random()*globalFood.length);
				h3.innerText = globalFood[number].value;
				i++;
				if(i > 20){
					clearInterval(timer);
					var random = parseInt(Math.random()*weightSum);
					// var random = parseInt(Math.random()*globalFood.length);
					// h3.innerText = globalFood[random].value;
					h3.innerText = judgeLocation(weightObj, random);
					isRun = true;
				}
			},50);
		}
	}
	function judgeLocation(obj, random){
		var str = '';
		for(let key in obj){
			if(obj[key].length == 2){
				if(random >= obj[key][0] && random < obj[key][1]){
					str = key;
					break;
				}
			}
		}
		return str;
	}
	//添加
	var add = document.getElementById('add');
	var input = document.getElementById('like');
	add.onclick = function(){
		var data = JSON.stringify({
			food:input.value
		});
		if(input.value){
			var http = new XMLHttpRequest();
			http.open('POST','http://192.168.1.115:8099/add');
			http.send(data);
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
		var arr = [];
		for(var i=0;i<globalFood.length;i++){
			var str = '';
			if(globalFood[i].weight > 1)
				str = globalFood[i].value + '+' + globalFood[i].weight;
			else
				str = globalFood[i].value;
			arr.push(str);
		}
		var content = arr.join(' ');
		showDiv.innerText = content;
	}
}
