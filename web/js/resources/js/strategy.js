(function(){
	$(document).ready(function(){
	//最后制定的策略
	var need_to_saved = false;
	//上游供应商
	function render_supplier(e){
		$.get('/merchant/suppliers', function(data){
			if(data.success){
				var html = '';
				$.each(data.data, function(i, sup){
					html += '<option value="' + sup.id + '">' + sup.name + "</option>";
				});
				$(e).append(html);
                $(window).trigger('init_condition');
            }
		});
	}
	render_supplier($('#supplier'));
	$.ajax({
		url:"/strategies", 
		success:function(data){
			if(data.success){
				var my_rule = $('.my-rule');
				$.each(data.data, function(i, rule){
					var _e = $('<li class="roul-li"></li>');
					$('.my-rule .rule-box').append(_e);
					_e.addClass('rule btn btn-block btn-default btn-sm').html('<span class="rule-code">'+rule.code+'</span><span>'+rule.name+'</span>').val(rule.id);//
					_e.click(function(){
						if($(this).hasClass("selected")){
							$(this).removeClass("selected");
						} else {
							$(this).addClass("selected");
						}
					});
				});
			} else {
				$.msgBox("获取规则失败", 'warning');
			}
		}
	});
	//双击策略跳转至策略编辑
	$('.rule-box').on('dblclick', 'li', function(){
		var id = $(this).attr('value');
		$.jump('/strategy/' + id, true);
	});
	
	$('.btn-add-rule').click(function(){
		if(!check_condition()) return false;
		if($('.my-rule .rule-box').find('li.selected').length > 0){
			need_to_saved = true;
			$('.my-rule .rule-box li.selected').each(function(){
				var id =$(this).prop("value");
				var text_code = $(this).find('span:first-child').text();
				var text_name = $(this).find('span:last-child').text();
				var _e = $('<li class="rule roul-li  btn btn-block btn-default btn-sm"><span class="rule-code">'+text_code+'</span>'+text_name+'</li>');
				_e.val(id);
				if($('.merchant-strategy .rule-box').find('li[value="' + id +'"]').length > 0){
					$.msgBox("规则[" + text + "]已存在", "warning");
					return false;
				}
				$('.merchant-strategy .rule-box').append(_e);
				$(this).removeClass("selected");
				_e.unbind().click(function(){
					if($(this).hasClass("selected")){
						$(this).removeClass("selected");
					} else {
						$(this).addClass("selected");
					}
				});
			});
		}else {
			$.msgBox("请选择要添加的规则");
		}
	});
	$('.btn-delete-rule').click(function(){
		if($('#input_merchant').val() == ''){
			$.msgBox("请选择商户", "warning");
			$('#merchant_typehead').addClass("error");
			return false;
		}
		if($('.merchant-strategy .rule-box').find('li.selected').length > 0){
			$('.merchant-strategy .rule-box li.selected').each(function(){
				$(this).remove();
			});
			need_to_saved = true;
		}else {
			$.msgBox("请选择要删除的规则", "warning");
		}
	});
	$('.btn-up-rule').click(function(){
		if($('.merchant-strategy .rule-box').find('li.selected').length > 0){
			$('.merchant-strategy .rule-box li.selected').each(function(){
				var prev = $(this).prev();
				if(prev.length > 0 && !prev.hasClass("selected")){
					prev.before($(this));
				}
			});
			need_to_saved = true;
		}else {
			$.msgBox("请选择要移动的规则", "warning");
		}
	});
	$('.btn-double-up-rule').click(function(){
		if($('#input_merchant').val() == ''){
			$.msgBox("请选择商户", "warning");
			$('#merchant_typehead').addClass("error");
			return false;
		}
		if($('.merchant-strategy .rule-box').find('li.selected').length > 0){
			$('.merchant-strategy .rule-box li.selected').each(function(){
				var first = $('.merchant-strategy .rule-box li').first();
				while(first.hasClass("selected")){
					first = first.next();
				}
				if(first.length > 0){
					first.before($(this));
				}
			});
			need_to_saved = true;
		}else {
			$.msgBox("请选择要移动的规则", "warning");
		}
	});
	$('.btn-down-rule').click(function(){
		if($('#input_merchant').val() == ''){
			$.msgBox("请选择商户", "warning");
			$('#merchant_typehead').addClass("error");
			return false;
		}
		if($('.merchant-strategy .rule-box').find('li.selected').length > 0){
			var _tmp_array=[];
			$('.merchant-strategy .rule-box li.selected').each(function(){
				_tmp_array.unshift($(this));
			});
			$(_tmp_array).each(function(){
				var next = $(this).next();
				if(next.length > 0 && !next.hasClass("selected")){
					next.after($(this));
				}
			})
			need_to_saved = true;
		}else {
			$.msgBox("请选择要移动的规则");
		}
	});
	$('.btn-double-down-rule').click(function(){
		if($('#input_merchant').val() == ''){
			$.msgBox("请选择商户", "warning");
			$('#merchant_typehead').addClass("error");
			return false;
		}
		if($('.merchant-strategy .rule-box').find('li.selected').length > 0){
			$('.merchant-strategy .rule-box li.selected').each(function(){
				var first = $('.merchant-strategy .rule-box li').last();
				while(first.hasClass("selected")){
					first = first.prev();
				}
				if(first.length > 0){
					first.after($(this));
				}
			});
			need_to_saved = true;
		}else {
			$.msgBox("请选择要移动的规则", "warning");
		}
	});
	
	$.autoCompleteMerchant(function(){$(window).trigger('init_condition');});
	$('.search-btn').click(function(){
		if($('#input_merchant').val() == ''){
			$.msgBox("请添加商户", "warning");
			return false;
		}
		var id = $('#input_merchant').val();
		$.ajax({
			url:'/merchant/strategy',
			method:'get',
			data:{merchantId:id},
			success:function(data){
				if(data.data){
					var merchant_box = $('.merchant-strategy .rule-box');
					merchant_box.find('li').remove();
					$.each(data.data, function(i, v){
						var _e = $('<li class="rule btn btn-block btn-default btn-sm"></li>');
						_e.text(v.name).val(v.id);
						merchant_box.append(_e);
						_e.click(function(){
							if($(this).hasClass("selected")){
								$(this).removeClass("selected");
							} else {
								$(this).addClass("selected");
							}
						});
					});
				}
			}
		});
	});
	
	$('.footer .btn-save').click(function(){
		var param = {};
		if($('#input_merchant').val() == ''){
			$.msgBox("请添加商户", "warning");
			$('#merchant_typehead').addClass("error");
			return false;
		}
		if($('#supplier').val() == ''){
			$.msgBox("请选择上游供应商", "warning");
			$('#supplier').addClass("error");
			return false;
		}
		param['supplierIds'] = [$('#supplier').val()];
		param['merchantIds'] = [$('#input_merchant').val()];
		if($('.merchant-strategy li').length == 0){
			$.msgBox("请添加规则", "warning");
			return false;
		}
		param['strategyIds'] = [];
		var index = 0;
		$('.merchant-strategy li').each(function(){
			param['strategyIds'].push(($(this).val()));
			index ++;
		});
		$.mask();
		$.ajax({
			"url":"/merchant/strategy",
			"method":"post",
			"data":param,
			"traditional":true,
			"success":function(data){
				if(data.success){
					$.msgBox(data.message);
				} else {
					$.msgBox(data.message, "warning");
				}
				$.hideMask();
				need_to_saved = false;
			}
		});
	});
	$('.footer .btn-copy').click(function(){
		var cpy = $('.merchant-strategy li');
		if(cpy.length == 0){
			$.msgBox("应用策略不能为空", 'warning');
			return;
		}
		if(need_to_saved){
			$.confirmBox('', 'save-confirm', function(){
				$('.merchant-strategy li').removeClass('selected');
				var my_strategies = [];
				$.each(cpy, function(i, s){
					my_strategies.push($(s).attr('value'));
				});
				$('.footer .btn-save').trigger('click');
				my_strategies.length > 0 && $.jump("/merchant/strategy/copy/" + my_strategies.join(','));
			}, function(){
				$('.merchant-strategy li').removeClass('selected');
				var my_strategies = [];
				$.each(cpy, function(i, s){
					my_strategies.push($(s).attr('value'));
				});
				my_strategies.length > 0 && $.jump("/merchant/strategy/copy/" + my_strategies.join(','));
			}, "是否保存当前策略");
		} else {
			$('.merchant-strategy li').removeClass('selected');
			var my_strategies = [];
			$.each(cpy, function(i, s){
				my_strategies.push($(s).attr('value'));
			});
			my_strategies.length > 0 && $.jump("/merchant/strategy/copy/" + my_strategies.join(','));
		}
		
	});
	
	$('.footer .btn-past').click(function(){
		if(cpy){
			$('.merchant-strategy li').remove();
			$('.merchant-strategy .rule-box').append(cpy);
			$('.merchant-strategy .rule-box li').removeClass("selected");
		}
		cpy.each(function(){
			$(this).unbind().click(function(){
				if($(this).hasClass("selected")){
					$(this).removeClass("selected");
				} else {
					$(this).addClass("selected");
				}
			});
		});
		cpy = null;
		$(this).addClass('disabled');
	});
	function check_condition(){
		$('#supplier').removeClass("error-border");
		if($('#supplier').val() == '-1'){
			$.msgBox("请选择上游供应商", "warning");
			$('#supplier').addClass("error-border");
			return false;
		}
		$('#merchant_typehead').removeClass("error");
		if($('#input_merchant').val() == ''){
			$.msgBox("请选择商户", "warning");
			$('#merchant_typehead').addClass("error");
			return false;
		}
		return true;
	}
	$('.btn-query').click(function () {
        var supplier = $('#supplier').val();
        var merchant = $('#input_merchant').val();
		if(merchant != undefined){
            init_condition(supplier, merchant);
		}
    });
	//编辑
	//填充商户
	function init_condition(supply_id, merchant_id){
		$.get('/merchant/strategy/' + merchant_id + '/' + supply_id, function(data){
			if(data.success){
				$('.merchant-strategy .rule-box').find('li').remove();
				data.data.length > 0 && $.each(data.data, function(i, rule){
					var _e = $('<li></li>');
					$('.merchant-strategy .rule-box').append(_e);
					_e.addClass('rule btn btn-block btn-default btn-sm').text(rule.name).val(rule.id);
					_e.click(function(){
						if($(this).hasClass("selected")){
							$(this).removeClass("selected");
						} else {
							$(this).addClass("selected");
						}
					});
				});
			}
		});
	}
        //选择上游供应商，或者改变商户的值
	$('#supplier').change(function(){
		$(window).trigger('init_condition');
	});
	$(window).on('init_condition', function(){
		var supplier = $('#supplier').val();
		var merchant = $('#input_merchant').val();
		/*if(supplier != -1 && merchant != ''){
			init_condition(supplier, merchant);
		}*/
		if(merchant != ''){
			init_condition(supplier, merchant);
		}
	});
	//copy页
	$('form .btn-add-merchant').click(function(e){
		e.preventDefault();
		var html = '';
		var index = $('form .supplier-merchant').length + 1; 
		html = '<div class="row supplier-merchant col-md-12">'
		    + '<div class="single-search form-group form-horizontal col-md-4">'
		    + '<label for="supplier_"' + index + ' class="col-md-5 control-label">上游供应商</label>'
		    + '<div class="col-md-7">'
		    + '<select class="form-control col-md-10 input-supplier" id="supplier_' + index + '">'
		    + '</select>'
		    + '</div>'
		    + '</div>'
		    + '<div class="single-search form-group form-horizontal col-md-4">'
		    + '<label for="company_' + index +'" class="col-md-5 control-label">商户</label>'
		    + '<div class="col-md-7">'
		    + '<input style="display:none">'
		    + '<input type="hidden" name="merchant" id="input_merchant_' + index + '">'
		    + '<input type="text" class="form-control col-md-10 merchant typeahead" id="merchant_typehead_' + index + '" placeholder="商户" autocomplete="off">'
		    + '</div>'
		    + '</div>'
		    + '<button class="btn btn-xs btn-danger delete-button"><i class="fa fa-fw fa-minus-circle"></i></button>'
		    + '</div>';
		$('form .supplier-merchant').last().after(html);
		render_supplier($('#supplier_' + index));
		$.autoCompleteMerchant(index);
		$('form .supplier-merchant .delete-button').click(function(e){
			e.preventDefault();
			$(this).parent().remove();
		});
		
	});
	//复制页表单提交
	$('form').on('click','.input-supplier.error', function(){
		$(this).removeClass('error');
	});
	$('.copy-strategy-form').submit(function(){
		var param = {};
		var supplierIds = [];
		var merchantIds = [];
		var strategyIds = [];

		$('.input-supplier').each(function(i, m){
			if($(this).val() == '-1'){
				$(this).addClass("error");
			} else {
				supplierIds.push($(this).val());
			}
		});
		if($('.input-supplier.error').length > 0){
			$.msgBox("请选择上游供应商", "warning");
			$('#supplier').addClass("error");
			return false;
		}
		$('input[name="merchant"]').each(function(i, m){
			if($(this).val() == ''){
				$(this).siblings('.merchant.typeahead').addClass("error");
			} else {
				merchantIds.push($(this).val());
			}
		});
		if($('.merchant.typeahead.error').length > 0){
			$.msgBox("请添加商户", "warning");
			return false;
		}
		$('input[name="strategyIds"]').each(function(){
			strategyIds.push($(this).val());
		});
		var param = {"supplierIds":supplierIds, "merchantIds":merchantIds, "strategyIds":strategyIds}
		$.mask();
		$.ajax({
			"url":"/merchant/strategy",
			"method":"post",
			"data":param,
			"traditional":true,
			"success":function(data){
				$.hideMask();
				if(data.success){
					$.msgBox(data.message);
					$.jump('/supply');
				} else {
					$.msgBox(data.message, "warning");
				}
			}
		});
		return false;
	})
});
})();