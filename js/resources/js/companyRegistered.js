$(function() {
	$(document).ready(function() {
		jQuery.validator.addMethod("telemobile", function(value, element) {
			var mobile = /^\d{3,4}-?\d{7,9}$/;
			return this.optional(element) || (mobile.test(value));
		}, "请输入正确的座机号");

		$("#registerBtn").click(function(event) {
			event.preventDefault();
			$("#CreateMerchantForm").submit();
		});
		$("#CreateMerchantForm").validate({
			rules: {
				phone: {
					telemobile: true,
				},
				//						name: {
				//							required: true
				//						},
				password: {
					required: true,
					//							minlength: 6,
					//							maxlength: 20
				},
				confirmPassword: {
					required: true,
					//							minlength: 6,
					//							maxlength: 20,
					equalTo: "#password"
				}
			}

		});
		$("#loginForm").validate({
			rules: {
				companyEncod: {
					companyNumber: true,
				},
				mobilePhone: {
					mobile: true,
				},
				password: {
					required: true,
					minlength: 6
				}
			},
			messages: {

				password: {
					required: '请输入密码',
					minlength: '不能小于{0}个字符'
				}
			}
		})

	})

	var sheng = document.getElementById('sheng');
	var shi = document.getElementById('shi');
	var qu = document.getElementById('qu');

	function ajax(url, fnsucc, fnfail) {
		var xhr = new XMLHttpRequest();
		xhr.open('get', url, true);
		xhr.send();
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				if(xhr.status == 200) {
					fnsucc(xhr.responseText);
				} else {
					fnfail();
				};
			};
		};
	};

	ajax('citylist.json', function(str) {
		//	var json=eval('('+str+')');
		var json = JSON.parse(str);

		console.log(json)
			//console.log(json.citylist[0].p);//北京  获取示例
			// console.log(json.citylist[0].c[0].n)//东城区  获取示例
			// console.log(json.citylist.length);//35  获取示例
		var opt1 = '<option value="-1">请选择</option>';
		for(var i = 0; i < json.citylist.length; i++) { //省份初始值
			opt1 = opt1 + '<option value="' + i + '">' + json.citylist[i].p + '</option>';
			sheng.innerHTML = opt1;
		}
		sheng.onchange = function() { //选择省份后
			var opt2 = '<option value="-1">请选择</option>'; //初始值
			if(sheng.value == -1) {
				shi.innerHTML = opt2;
				qu.innerHTML = opt2;
			} else {
				if(json.citylist[sheng.value].c[0].a) { //是省份执行这
					for(var i = 0; i < json.citylist[sheng.value].c.length; i++) {
						opt2 = opt2 + '<option value="' + i + '">' + json.citylist[sheng.value].c[i].n + '</option>';
						shi.innerHTML = opt2;
					}
				} else { //是直辖市执行这
					opt2 = opt2 + '<option value="0">' + json.citylist[sheng.value].p + '</option>';
					shi.innerHTML = opt2;
				};
			}
		}
		shi.onchange = function() { //选择城市后
			var opt3 = '<option value="-1">请选择</option>'; //初始值
			if(shi.value == -1) {
				qu.innerHTML = opt3;
			} else {
				if(json.citylist[sheng.value].c[0].a) { //是省份执行这
					for(var i = 0; i < json.citylist[sheng.value].c[shi.value].a.length; i++) {
						opt3 = opt3 + '<option value="' + i + '">' + json.citylist[sheng.value].c[shi.value].a[i].s + '</option>';
						qu.innerHTML = opt3;
					}
				} else { //是直辖市执行这
					for(var i = 0; i < json.citylist[sheng.value].c.length; i++) {
						opt3 = opt3 + '<option value="' + i + '">' + json.citylist[sheng.value].c[i].n + '</option>';
						qu.innerHTML = opt3;
					}
				};
			}
		}
	}, function() {
		alert('失败')
	})

})