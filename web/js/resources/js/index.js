			$(document).ready(function() {
				$("#").click(function(){ 
					$.ajax({
   						type: "post",
  						url: "http://127.0.0.1:8080/signup",
   						data: $("#regForm").serialize(),
   						success: function(data){
						if(data.success){
							alert(data.message);
						} else {
							alert(data.message);
							location.href='http://127.0.0.1:8080';
						}
						}
					});
				});

//				jQuery.validator.addMethod("companyNumber", function(value, element) {
//					return this.optional(element) || /^m([0-9]{4,11})/.test(value);
//				}, '请输入正确的公司编码');
//				
//				jQuery.validator.addMethod("mobile", function(value, element) {
//					var mobile = /^1[3|4|5|7|8]\d{9}$/;
//					return this.optional(element) || (mobile.test(value));
//				}, "手机格式不对");

				$("#loginBtn").click(function(event) {
					event.preventDefault();
					$("#loginForm").submit();
				});
				$("#registerBtn").click(function(event) {
					event.preventDefault();
					$("#regForm").submit();
				});
				$("#regForm").validate({
					rules: {
						name: {
							required: true,
						},
//						name: {
//							required: true
//						},
						password: {
							required: true,
							minlength: 6,
//							maxlength: 20
						},
						confirmPassword: {
							required: true,
							minlength: 6,
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
						username: {
							required: true,
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
				
				});
				
				
//				切换
				$('#regId').on('click', function(e) {
					e.preventDefault();
					$('#regCont').show();
					$('#loginCont').hide();
				});
				$('#logId').on('click', function(e) {
					e.preventDefault();
					$('#regCont').hide();
					$('#loginCont').show();
				});
			})

			$('.typeahead').typeahead({
				source: function(query, process) {
					$(this).removeClass('error');
					$.get('/picker/merchant/' + query, function(json) {
						if (json.data)
							process(json.data);
					});
				},
				matcher: function(item) {
					if (this.$element.val() == '') {
						this.$element.data('active', null);
						return false;
					}
					return true;
				},
				delay: 50,
				minLength: 3,
				afterSelect: function(item) {
					try {
						var match = location.hostname.match(/^(\w+)(\.\w+\.\w+)$/);
						var sub = match[1].toLowerCase();
						var code = item['code'].toLowerCase();
						if (sub != code) {
							var action = location.origin.replace(sub, code) + '/login';
							//$(this.$element).parents('form').attr('action', action);
							//console.log(action, $(this.$element).parents('form'));
							//location.replace(location.href.replace(sub, code));
						}
					} catch (e) {}
				}
			}).blur(function() {
				var active = $(this).typeahead('getActive');
				if (active) {
					$('#merchantId').val(active.id);
				} else {
					if (/^\d{11}$/.test($(this).val()))
						$('#merchantId').val($(this).val());
					else {
						$('#merchantId').val($(this).val());
						$(this).addClass('error');
					}
				}
			});
			$('#loginForm').submit(function() {
				var active = $('#inputEmail3').typeahead('getActive');
				if (active) {
					$('#merchantId').val(active.id);
				} else {
					if (/^\d{11}$/.test($('#inputEmail3').val()))
						$('#merchantId').val($('#inputEmail3').val());
					else {
						$('#merchantId').val($('#inputEmail3').val());
						$('#inputEmail3').addClass('error');
						return false;
					}
				}
				return true;
			});
