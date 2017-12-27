$(document).ready(function(){
	$('form .btn-confirm').click(function(){
		var pass1 = $("input[name ='password']").validation({'no_blank': true});
		var pass2 = $("input[name ='newPassword']").validation({'no_blank': true, 'mini_length':6,'max_length':16});
		var pass3 = $("input[name ='confirmPassword']").validation({'no_blank': true, 'mini_length':6,'max_length':16});
		if(!pass1 || !pass2 || !pass3) return false;
		var password = $("input[name ='password']").val();
		var newPassword = $("input[name ='newPassword']").val();
		var confirmPassword = $("input[name ='confirmPassword']").val();
		if(newPassword != confirmPassword){
			$.msgBox("新密码与确认密码不一致", "warning");
			return false;
		}
		$.ajax({
			type: "PUT",
			url: "/user/password",
			data: {"old":password,"new":newPassword},
			success: function(data){
				if(data.success){
					$.msgBox(data.message);
					$.ajax({
						url:'/logout',
						method:'POST',
						success:function () {
							$.jump('http://127.0.0.1:8080');
                        }
					});
				} else {
					$.msgBox(data.message, 'warning');
				}
				$.hideMask();
			}
		});
	});
})