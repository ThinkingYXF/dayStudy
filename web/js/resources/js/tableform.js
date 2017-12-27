//表单上传（需要参数）
// opt{
// 	elem:表单名,
//  url: url, ajax数据请求路径
//	method: 方法
//  warehouse:选取仓库元素，
//	code:价格码选取，
//	name:价格名称，
//  tolltip: {
//		message1: '请输入配件编号',
//		message2: '',
//	}
// 	data:[
// 		{
// 			"optional": true/false,(是否是必填列)
// 			"validator":/^$/(正则验证表达式)，
// 		}，
// 		{
// 			optional: true/false,(是否是必填列)
// 			validator: /^$/(正则验证表达式)，
// 		},
// 		{
// 			optional: true/false,(是否是必填列)false表示可以为空
// 			validator: /^$/(正则验证表达式)，
// 		}
// 	],
//  second:价格/库存，
// }
$.formSubmit = function(opt){
	opt.elem.submit(function(e){
		e.preventDefault();
		var param = {};
		if($('#msg_form').length){
			$.each($('#msg_form').serializeArray(), function(idx, field) {
				if (field.value)
					param[field.name] = field.value;
			});
		}
		if(opt.selectCity){
			if(opt.selectCity.val() > 0){
				param['district'] = opt.selectCity.val();
			}
		}
		if(opt.selectTime){
			param['startTime'] = Math.floor((new Date().getTime())/1000);
			param['endTime'] = Math.floor((new Date().getTime())/1000) + (opt.selectTime.val() - 0);
		}
		if(opt.warehouse && opt.warehouse.val() != -1){
			param['supplierId'] = opt.warehouse.val();
		}
		if(opt.code){
			var code = '';
			$('i.fa-check-square').each(function(){
				if(!$(this).hasClass('hidden')){
					code = $(this).attr('value');
				}
			});
			param['code'] = code;
		}
		if(opt.name){
			var name = opt.name.val();
			if(name == ''){
				opt.name.addClass('error-border');
				$.msgBox('请输入价格名称', 'warning');
				return false;
			}
			param['name'] = name;
		}
		if(opt.itemname){
			var name = opt.itemname.val();
			if(name == ''){
				opt.itemname.addClass('error-border');
				$.msgBox('请输入项目名称', 'warning');
				return false;
			}
			param['name'] = name;
		}
		if($('#form_flag').val()){
			param['status'] = $('#form_flag').val();
			$('#form_flag').val('');
		}
		var list = $('.table tbody tr'),
			index = 0;//表示当前是第几个有效列
		for(var i=0;i<list.length;i++){
			var inputList = $(list[i]).find('td input[type="text"]'),
				selectList = $(list[i]).find('td select'),
				checkList = $(list[i]).find('td input[type="checkbox"]'),
				flag = false;//判断这行内容是否有效，默认无效;
			for(var j=0; j<inputList.length; j++){
				if(!opt.data[j].optional && $(inputList[j]).val()){
					flag = true;
				}
			}
			if(flag){
				for(var z=0; z<selectList.length; z++){
					if(selectList[z].value == -1){
						if(z == 0){
							$(selectList[0]).addClass('error-border');
							$.msgBox('清选择品牌','warning');
						}
						if(z == 1){
							$(selectList[1]).addClass('error-border');
							$.msgBox('清选择分类','warning');
						}
						return false;
					}
					if(selectList[3].value != -1){
						param['uploads['+ index +'].parts.tags.1009'] = $(selectList[3]).val();
					}
				}
				for(var z=0; z<inputList.length; z++){
					opt.data[z].validator = opt.data[z].validator || '';
					if(!opt.data[z].optional && !$(inputList[z]).val()){
						$(inputList[z]).addClass('error-border');
						if(z == 0){
							$.msgBox(opt.tooltip.message1,'warning');
						}
						if(z == 1){
							$.msgBox(opt.tooltip.message2,'warning');
						}
						return false;
					}else if($(inputList[z]).val() && opt.data[z].validator){
						if(!opt.data[z].validator.test($(inputList[z]).val())){
						$(inputList[z]).addClass('error-border');
							if(z == 0){
								$.msgBox(opt.tooltip.message3,'warning');
							}
							if(z == 1){
								$.msgBox(opt.tooltip.message4,'warning');
							}
							if(z == 2){
								$.msgBox(opt.tooltip.message5,'warning');
							}
							return false;
						}
					}else{
						$(inputList[z]).removeClass('error-border');
					}

				}
				if($('#inventory_parts form').length){
					if($(checkList[0]).is(":checked")){
						$(checkList[0]).val('OE');
					}
					param['uploads['+ index +'].parts.code'] = $(inputList[0]).val();
					param['uploads['+ index +'].parts.name'] = $(inputList[1]).val();
					param['uploads['+ index +'].parts.brand.id'] = $(selectList[0]).val();
					param['uploads['+ index +'].parts.tags.1008'] = $(selectList[1]).val();
					param['uploads['+ index +'].parts.tags.1000'] = $(checkList[0]).val();
					index++;
					continue ;
				}else if($('#add_inventory form').length){
					param['uploads['+ index +'].substitute.parts.code'] = $(inputList[0]).val();
					param['uploads['+ index +'].substitute.substitute.code'] = $(inputList[1]).val();
					index++;
					continue ;
				}else if($('#msg_form').length){
					param['uploads['+ index +'].code.code'] = $(inputList[0]).val();
					param['uploads['+ index +'].code.quantity'] = $(inputList[1]).val();
					if($(inputList[2]).val()){param['uploads['+ index +'].code.price'] = $(inputList[2]).val()};
					index++;
					continue ;
				}else if($('#add_item').length){
					param['codes['+ index +'].code'] = $(inputList[0]).val();
					param['codes['+ index +'].quatity'] = $(inputList[1]).val();
					index++;
					continue ;
				}else if($('#create_inquire').length){
					param['codes['+ index +'].code'] = $(inputList[0]).val();
					param['codes['+ index +'].quantity'] = $(inputList[1]).val();
					index++;
					continue ;
				}else{
					if($(inputList[0]).val()){
						param['uploads['+ index +'].product.parts.code'] = $(inputList[0]).val();
					}
					if($(inputList[1]).val()){
						param['uploads['+ index +'].product.'+ opt.second] = $(inputList[1]).val();
					}
					index++;
				}

			}
		}
		console.log(param);
		$.mask();
		$.ajax({
			"url": opt.url,
			"method": opt.method,
			"traditional": true,
			"data":param,
			"success":function(data){
				console.log(data);
				if(data.success){
					$('.table tbody tr td input').val('');
				}else {
					if(data.message){
						$.msgBox(data.message,'warning');
						if($('#create_inquire').length){
							for(var i=0; i<data.data.length; i++){
								for(var j=0; j<$('.table tbody tr').length; j++){
									if($('.table tbody tr').eq(j).find('td').eq(0).find('input').val() == data.data[i].code){
										$('.table tbody tr').eq(j).find('td').eq(0).find('input').addClass('error-border');
									}
								}
							}
							$.hideMask();
							return false;
						}
					}
					if(data.data.length > 0){
						if(!$('.errorInfo').length){
							$('.table thead tr').append('<th class="errorInfo"></th>');
							$('.table tbody tr').append('<td class="error-tooltip"></td>');
							$('.errorInfo').html('错误信息');
						}
						var data = data.data;
						if($('#add_inventory form').length){
							for(var i=0; i<data.length; i++){
								for(var j=0; j<$('.table tbody tr').length; j++){
									if($('.table tbody tr').eq(j).find('td').eq(0).find('input').val() == data[i].substitute.parts.code
									|| $('.table tbody tr').eq(j).find('td').eq(1).find('input').val() == data[i].substitute.substitute.code){
										$('.error-tooltip')[j].innerHTML = data[i].error;
									}
								}
							}
						}else {
							for(var i=0; i<data.length; i++){
								for(var j=0; j<$('.table tbody tr').length; j++){
									if($('.table tbody tr').eq(j).find('td').eq(0).find('input').val() == data[i].product.parts.code){
										$('.error-tooltip')[j].innerHTML = data[i].error;
									}
								}
							}
						}
					}else{
						if($('#add_price').length){
							$.msgBox('颜色修改成功');
						}else{
							$.msgBox('请在表格中输入上传内容','warning');
						}
					}
				}
				$.hideMask();
			}
		});
	});
}


//批量上传,数据回显
$.uploadFile = function(elem, callback) {
	elem.load(function(){
		if($('form.upload-file', elem.contents()).length == 0){
			elem.addClass('hidden');
			var resp = $('body', elem.contents()).text();
			if(resp != '') {
				var json = eval("(" + resp + ")");
				if(json.success){
					$.msgBox(json.message);
				} else {
					$.msgBox(json.message, 'warning');
				}
				callback(json);
				/*console.log(json);
				json['addon'] && json['addon']['url'] && $('form').append('<div class="col-md-3 down-tpl error-product"><a href="' + json['addon']['url'] + '">错误产品列表</a></div>');
				if($('.message-form').length){
					$('#msg_form').append('<input type="hidden" name="billIds" id="input_origin" value="'+ json['addon'].bill.id +'" />');
					return ;
				}
				for(var i=0; i<json.data.length; i++){
					if(json.data[i].error && $('.errorInfo').length == 0){
						$('.table thead tr').append('<th class="errorInfo"></th>');
						$('.table tbody tr').append('<td class="error-tooltip"></td>');
						$('.errorInfo').html('错误信息');
					}
					if($('#upload_inventory_file').length){
						$('.table tbody tr').eq(i).find('td').eq(0).find('input').val(json.data[i].product.parts.code);
						$('.table tbody tr').eq(i).find('td').eq(1).find('input').val(json.data[i].product.inventory);
					}
					if($('#upload_price_file').length){
						$('.table tbody tr').eq(i).find('td').eq(0).find('input').val(json.data[i].product.parts.code);
						$('.table tbody tr').eq(i).find('td').eq(1).find('input').val(json.data[i].product.price);
					}
					if($('#inventory_parts').length){
						$('.table tbody tr').eq(i).find('td').eq(0).find('input').val(json.data[i].parts.code);
						$('.table tbody tr').eq(i).find('td').eq(1).find('input').val(json.data[i].parts.name);
					}
					if($('#add_inventory').length){
						$('.table tbody tr').eq(i).find('td').eq(0).find('input').val(json.data[i].substitute.parts.code);
						$('.table tbody tr').eq(i).find('td').eq(1).find('input').val(json.data[i].substitute.substitute.code);
					}
					// if($('.'+ opt.code +''))$('.'+ opt.code +'').eq(i).val(json.data[i].product.parts.code);
					// if($('.'+ opt.price +''))$('.'+ opt.price +'').eq(i).val(json.data[i].product.price);
					// if($('.'+ opt.inventory +''))$('.'+ opt.inventory +'').eq(i).val(json.data[i].product.inventory);
					if($('.error-tooltip'))$('.error-tooltip').eq(i).html(json.data[i].error);
				}*/
			}
			var src = elem.attr('src');
			elem.attr('src', src);
		} else {
			// elem.removeClass('hidden');
		}
	});
}

//添加空行
$.addRows = function(i,opt){
	var th = opt.find('thead th'),
		td = '',
		tr = '';
	for(var j=0; j<i; j++){
		for(var z=0;z<th.length;z++){
			td += '<td><input type="text" class="form-control table-input "></td>';
		}
		tr = '<tr>'+ td + '</tr>';
		opt.find('tbody').append(tr);
		tr = '',td = '';
	}
};

//导出excel
$('.content').on('click','.btn-derive',function() {
	/* bookType can be 'xlsx' or 'xlsm' or 'xlsb' or 'ods' */
	console.log(0);
	var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };

	var wb = XLSX.utils.table_to_book($(".table").get(0), {sheet:"Sheet Name"});
	var wbout = XLSX.write(wb, wopts);

	function s2ab(s) {
		var buf = new ArrayBuffer(s.length);
		var view = new Uint8Array(buf);
		for (var i=0; i!=s.length; ++i)
			view[i] = s.charCodeAt(i) & 0xFF;
		return buf;
	}

	/* the saveAs call downloads a file on the local machine */
	saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "test.xlsx");
});
