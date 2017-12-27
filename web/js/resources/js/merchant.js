$(document).ready(function() {
	function renderRole(roleData, data, table){
		for (var i = 0; i < data.length; ++i) {
			var id = data[i].id;
			var flag = data[i].flag;
			var boxEnabled = $('input:checkbox', table.cell(i, 2).node());
			var boxMerchandiser = $('input:checkbox', table.cell(i, 3).node());
			var boxAuditor = $('input:checkbox', table.cell(i, 4).node());
			var boxManager = $('input:checkbox', table.cell(i, 5).node());
			var cancelBtn = $('.btn-primary',  table.cell(i, 6).node());
			boxEnabled.prop("checked", (flag & 1) > 0).unbind().change(function() {
				var value = $(this).prop('value');
				var notice = $(this).prop('checked') ? "启用" :"关闭";
				var type = $(this).prop('checked') ? "enable" :"disable";
				$.confirmBox(notice, "enable-box-" + type, function(){
					$.ajax({
						url: '/merchant/user/' + value + '/authority/enabled',
						method: (type == "enable") ? 'POST' : 'DELETE',
                        success:function(data){
						    if(data.success){
						        $.msgBox(type == "enable" ? '授权成功' : "取消授权成功");
                            } else {
                                $.msgBox(type == "enable" ? '授权失败' : "取消授权失败");
                            }
                            $.reloadData(table);
                            table.draw();
                        }
					});
				});
			});
			boxMerchandiser.prop("checked", (flag & roleData.MERCHANDISER)>0).change(function() {
                var sel = $(this).prop('checked');
				$.ajax({
					url: '/merchant/user/' + $(this).prop('value') + '/authority/merchandiser',
					method: sel ? 'POST' : 'DELETE',
                    success:function(data){
                        if(data.success){
                            $.msgBox(sel ? '授权成功' : "取消授权成功");
                        } else {
                            $.msgBox(sel ? '授权失败' : "取消授权失败");
                        }
                        $.reloadData(table);
                        table.draw();
                    }
				});
			});
			boxAuditor.prop("checked", (flag & roleData['AUDITOR']) > 0).unbind().change(function() {
				var sel = $(this).prop('checked');
				$.ajax({
					url: '/merchant/user/' + $(this).prop('value') + '/authority/auditor',
					method: sel ? 'POST' : 'DELETE',
                    success:function(data){
                        if(data.success){
                            $.msgBox(sel ? '授权成功' : "取消授权成功");
                        } else {
                            $.msgBox(sel ? '授权失败' : "取消授权失败");
                        }
                        $.reloadData(table);
                        table.draw();
                    }
				});
			});
			boxManager.prop("checked", (flag & roleData['MANAGER']) > 0).unbind().change(function() {
                var sel = $(this).prop('checked');
			    $.ajax({
					url: '/merchant/user/' + $(this).prop('value') + '/authority/manager',
					method: sel ? 'POST' : 'DELETE',
                    success:function(data){
                        if(data.success){
                            $.msgBox(sel ? '授权成功' : "取消授权成功");
                        } else {
                            $.msgBox(sel ? '授权失败' : "取消授权失败");
                        }
                        $.reloadData(table);
                        table.draw();
                    }
				});
			});
			cancelBtn.unbind().click(function(){
				var id = $(this).prop('value');
				$.confirmBox('取消链接', 'cancel-connect', function(){
					$.ajax({
						url:'/merchant/user/' + id,
						method:'DELETE',
						success:function(data){
							if(data.success){
								$.msgBox('取消链接成功');
								$.reloadData(table);
							} else {
								$.msgBox('取消链接失败' + data.info, "warning");
							}
						}
					});
				});
			});
		}
	}

	
	var table = $('#user_table').DataTable( {
		"ajax": "/merchant/users",
		"scrollCollapse": true,
		"paging": false,
		"rowId": 'id',
		"processing":true,
		"searching": true,
		"language":language,
		"columnDefs": [
			{ 	
				"data": function(data){
					return data.name + ((data.flag & ROLES.OWNER)> 0 ? '<i class="fa fa-fw fa-user-md" data-toggle="tooltip" data-placement="bottom" title="owner"></i>':'');
				},
				"targets":0, 
				"searchable":true
			},
			{ 	"data": "code",
                "targets":1
			},
			{ 	"data": function(data){
					return (data.flag & ROLES.OWNER) > 0 ? "<input type='checkbox' disabled='true'>" : "<input type='checkbox' value='" + data.id + "'>"
				},
				"targets":2  ,
			},
			{ 	"data": function(data){
					return (data.flag & ROLES.OWNER) > 0 ? "<input type='checkbox' disabled='true'>" : "<input type='checkbox' value='" + data.id + "'>"
				},
				"targets":3  ,
			},
			{ 	"data": function(data){
					return (data.flag & ROLES.OWNER) > 0? "<input type='checkbox' disabled='true'>" : "<input type='checkbox' value='" + data.id + "'>"
				},
				"targets":4  ,
			},
			{ 	"data": function(data){
					return (data.flag & ROLES.OWNER) > 0? "<input type='checkbox' disabled='true'>" : "<input type='checkbox' value='" + data.id + "'>"
				},
				"targets":5  ,
			},
			{ 	"targets": 6,
				"data": function(data){
					return (data.flag & ROLES.OWNER) > 0 ? "" : "<button class='btn btn-primary btn-sm' value='" + data.id + "'>取消连接</button>"
				},
			},
			{	"data":"id",
				"targets":7,
				"visible":false
			}
		],
		"info" : false
	} ).on('init.dt', function(e, settings, json) {
	}).on('draw.dt', function () {
		renderRole(ROLES, table.data(), $('#user_table').DataTable());
	});
    //员工电话号码查询框展示
    $('.employee-phone').show();
	$('.search-btn').on('click',function(){
        var val = $('#inputMobile').val();
        if(val == ''){
        	$.msgBox("号码不能为空", "warning");
        	$('#inputMobile').addClass('error-border');
        	table.columns(1).search('').draw();
        	return;
        } 
        table.columns(1).search(val).draw();
        var filters = table.column(1).data().filter(function(value){
            return value == val ? true : false;
        });
        if(filters.length == 0){
            codeSelect(val);
        }
    });
    function codeSelect(value){
        $.get('/user/'+ value,function(data){
            if(data.data.length > 0){
                var item = data.data[0];
                $('.mask').show();
                var opt = {"id":"user_info","title":"添加授权用户", "width":450, "height":250, "level":"info", "closeIcon":false};
                opt.content =　'<form class="form-horizontal user-info"><div class="box-body"><div class="form-group">'
                    + '<input type="hidden" name="userId">'
                    + '<label for="inputEmail3" class="col-sm-3 control-label">用户</label>'
                    + '<div class="col-sm-9">'
                    + '<input type="text" class="form-control" name="userName" disabled="true">'
                    + '</div></div>'
                    + '<div class="form-group"><input type="hidden" name="userCode">'
                    + '<label for="user_code" class="col-sm-3 control-label">电话号码</label>'
                    + '<div class="col-sm-9">'
                    + '<input type="text" class="form-control" id ="user_code" name="userCode" disabled="true">'
                    +'</div></div>'
                    + '</div>'
                    + '<div class="box-footer">'
                    + '<button type="submit" class="btn btn-info pull-right user-confirm">确认</button>'
                    + '<button class="btn btn-default user-cancel">取消</button>'
                    + '</div></form>';
                module = $.doModule(opt, function(module){
                    module.find('input[name="userId"]').val(item.id);
                    module.find('input[name="userName"]').val(item.name);
                    module.find('#user_code').val(item.code);
                    module.find("form").submit(function(){
                        $('.mask').hide();
                        $.post("/merchant/user/" + module.find('input[name="userId"]').val(), function(data){
                            if(data.success){
                                $.msgBox(data.message);
                                $.reloadData(table);
                            } else {
                                $.msgBox(data.message, "warning");
                            }
                        });
                        module.find('.btn-box-tool').trigger('click');
                        table.columns(7).search('').draw();
                    });
                    module.find(".user-cancel").unbind().click(function(e){
                        e.preventDefault();
                        module.find('.btn-box-tool').trigger('click');
                        $('.mask').hide();
                        table.columns(7).search('').draw();
                    });
                });
            }
        })
    }
	//取地址
	$.get('/data/districts.json', function(data){
		html = '';
		$.each(data, function(index, value){
			html += '<option value="' + value.id + '">' + value.name + '</option>';
		});
		$('select[name="province"]').append(html);
		var district = $('.merchant-address').attr('value');
		if(district > 0){
			$.staticDistrict(district);
		}
	});


	
	$('select[name="province"], select[name="city"], select[name="country"]').change(function(){
		var that = this;
		$.districtSelect(that);
	});
	$('.create-warehouse').submit(function(e){
		e.preventDefault();
		$('form input.necessary').each(function(){
			$(this).parent().removeClass('has-error');
			$(this).parent().find('.help-block').remove();
			if($(this).val() == ''){
				$(this).parent().addClass('has-error');
				$(this).after('<span class="help-block">不允许为空</span>');
			}
		});
		$('form .merchant-address').parent().removeClass('has-error');
		$('form .merchant-address').parent().find('.help-block').remove();
		if($('select[name="district"]').find('option:selected').prop('value') == -1){
			$('form .merchant-address').parent().addClass('has-error');
			$('form .merchant-address').after('<span class="help-block">地址信息不完整</span>');
		}
		if($('form .has-error').length > 0){
			return false;
		}
		var param = $('form').serialize();
		$.mask();
		$.ajax({
			url:'/merchant/warehouse',
			data: param,
			method:'post',
			success:function(data){
				$.hideMask();
				if(data.success){
					$.msgBox(data.message);
					$('form input.necessary').val('');
					$('form select').find('option:selected').removeAttr('selected');
					$('form select').each(function(){
						$(this).find('option').first().prop('selected', true);
					});
					var merchant = data['data'][0];
					 $.jump("/merchant/warehouses");
				} else {
					$.msgBox(data.message);
				}
			}
		})
	});
	
	$('.img-show').click(function(e){
		e.preventDefault();
		if($('.img-show-open').length > 0){
			$('.img-show-open').remove();
		} else {
			var img_open = $('<div class="col-md-12 img-show-open"><a href="' + $(this).attr('href') + '" target="_bank"><img style="width:300px;height:300px;" src="' + $(this).attr('href') + '"/></a></div>');
			$(this).after(img_open);
		}
	});
} ); 
			