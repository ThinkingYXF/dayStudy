  //加载基础数据
  //state
  var states = [];
  type_data = {};
  $.get('/data/states.js', function(data){
	  states = data;
  });
  
  var language = {
			"paginate":{
				"first":"首页",
				"last":"尾页",
				"previous":"上一页",
				"next":"下一页"
			},
			"zeroRecords":"无记录",
			"loadingRecords": "数据加载中...",
			"processing" : "数据加载中..."
  };
  $.mask = function(){
    	if($('.mask').length == 0){
    		$('body').append('<div class="mask"><div class="fa fa-refresh fa-spin processing"></div></div>');
    	}
    	$('.mask').show();
    }
 	$.hideMask = function(){
 		if($('.mask').length > 0) $('.mask').hide();
 	}
	$.ajaxSetup({
		converters: {
			"text json": function(text) {
				var json = $.parseJSON(text);
				if (json.success === true) {
					if (!json.data)
						json.data = [];
					if(!json.recordsTotal)
						json.recordsTotal = 0;
					if(!json.recordsFiltered)
						json.recordsFiltered = 0;
				}
				return json;
			}
    	},
    	headers:{
    		"Accept":"application/json"
    	},
//    	traditional:true
    });
	
	$(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
		$('.ajax-error').remove();
		var html =
			'<div class="col-md-4 ajax-error">'+
	    '<div class="box box-warning box-solid">' +
	    '<div class="box-header with-border">' + 
	      '<h3 class="box-title">网络错误</h3>' + 
	      '<div class="box-tools pull-right">' + 
	        '<button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>'+
	      '</div>' +
	    '</div>' +
	    '<div class="box-body">' +
	    '返回状态码:' + jqXHR.status + 
	    '</div>' +
	  '</div>' +
	  '</div>';
	  $('body').append(html);
	  $.hideMask();
	});

	/**
	 * @param options[
	 *  id:唯一标示，避免重复创建
	 * 	width:宽度
	 * 	height:高度
	 * 	title:标题
	 *  content:显示元素
	 * 	level:类型(success-信息，warning-警告，danger-错误)
	 * ]
	 * @returns
	 */
	$.doModule = function(options, callfunc){
		var d = new Date();
		if(!options['id']) options['id'] = "auto_create_" +  d.getTime();
		if(!options['level']) options['level'] = "success";
		if($('#' + options.id).length > 0){
			$('#' + options.id).show();
			callfunc.call(this, $('#' + options.id));
		} else {
			var html = '<div id="' + options.id + '" class="mask-content box box-' + options.level + ' box-solid" style="width:' + options.width + 'px;height:' + options.height + 'px;margin-top:-' + (options.height/2) + 'px;margin-left:-' + (options.width/2) + 'px;display:block;">';
			if(options.title){
				html += '<div class="title box-header with-border"><p class="box-title">' + options.title + '</p>';
				html += '<div class="box-tools pull-right"' ;
				if(options.closeIcon){
					html += 'style="display:block;"';
				} else {
					html += 'style="display:none;"';
				}
				html += '>'
				+ '<button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>'
				+ '</div>';
				html += '</div>';
			}
			html +='<div class="box-body">' + options.content + '</div>';
			$('body').after(html);
			callfunc.call(this, $('#' + options['id']));
		}
	}
 
	 /**
	  * 处理结果告知
	  * @param type
	  * @param msg
	  * @returns
	  * success-成功，warning-警告，danger-错误
	  */
	$.msgBox = function (msg, type){
		if(!type) type="success";
		if(!msg) msg="操作成功";
		if($('.notice.box-' + type + '[value="' + msg + '"]').length > 0){
			 $('.notice.box-' + type+ '[value="' + msg + '"]').show();
		} else {
			 var html = '<div class="notice box box-' + type + ' box-solid" value="'+ msg +'">'
				 + '<div class="box-header with-border">'
				 + '<h4 class="box-title">操作结果</h4>'
				 + '<div class="box-tools pull-right">'
				 + '<button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>'
				 + '</div>'
				 + '</div>'
				 + '<div class="box-body">'
				 + msg
				 + '</div>'
				 + '</div>';
			 $('header').after(html);
			 $('.notice.box-' + type + '[value="' + msg + '"]').show();
		}
		if (type == 'success')
			setTimeout('$.noticeHide()', 2000);
		return true;
	}
	$.noticeHide = function(){
		$('.notice .btn-box-tool').trigger('click');
	}

	$.get_url = function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]); return null;
	}
 
 	/**
 	 * 获取新收到的未读消息
 	 * @returns
 	 */
  $.getReceivedMessage =function(){
	 $.ajax({ url:"/messages/received/unread", headers:{ "accept":"application/json"}, success:function(data){
		 $('.navbar-custom-menu li.message .label-success').addClass('hidden').val('');
		 $('.dropdown-menu').html('');
		 if(data.success && data.recordsTotal > 0){
			 $('.navbar-custom-menu .message .label-success').removeClass('hidden').html(data.recordsTotal);
			 var html = '<li class="header">你收到了 ' + data.recordsTotal + ' 条消息</li>';
			 html += '<li class="messages"><ul class="menu">';
			 $.each(data.data, function(i, val){
				html += '<li id="' + val.message.id + '"><a href="/message/received/'
				 + 	val.id + '"><div class="pull-left sender-name col-md-4" value="' 
				 + val.createdBy  
				 + '"></div>'
				 +	'<h4>' + val.message.name + '</h4></a></li>';
			 });
			 html += '</ul></li>';
			 html += '<li class="footer"><a href="/messages/received">查看所有消息</a></li>';
			 $('.navbar-custom-menu .message .dropdown-menu').append(html).removeClass('hidden');
			 $('.navbar-custom-menu .message .dropdown-menu .sender-name').each(function(i, val){
				 var user_id = $(this).attr("value");
				 $.get("/data/user/" + user_id, function(data){
					$(val).html(data.name);
				 });
			 })
		 }
	 }
	});
  }
  $.reloadData = function(table){
//	    console.log('reload data');
		table.ajax.reload();
		table.draw();
	}
  /**
   * val="a.b"
   * opt=[{col1:name1},{col2:name2}]
   */
  //$.renderName(product_table, 'parts', 'parts.id', [{'col':2, 'name': 'code'}]);
  /**
   * table 给哪个表格渲染，就是DataTable对象
   * type数据类型，比如merchant, user, parts...
   * value在table.row()位置
   */
  $.renderName = function(table, type, value, opts, func){
	  var td = table.data();
	  $.each(td, function(i, val){
		var vals = value.split('.');
		$.each(vals, function(i, v){
			val = val[v] || '';
		});
		id = val.toString();
		if(id != ''){
			if(type_data[type+'_'+id]){
				var data = type_data[type+'_'+id];
				if(data){
					$.each(opts, function(j, opt){
						var _names = opt.name.split('.');
						var _value = data;
						$.each(_names, function(m, _name){
							_value = _value[_name];
						})
						table.cell(i, opt.col).nodes().to$().html('<span class="' + type + '">' + _value + '</span>');
						type_data[type+'_'+data.id] = data;
					});
					if(typeof func !== 'undefined'){
						func.call(this, i, data);
					}
				}
			} else {
				$.get('/data/' + type + '/' + id, function(data){
					if(data){
						$.each(opts, function(j, opt){
							var _names = opt.name.split('.');
							var _value = data;
							$.each(_names, function(m, _name){
								_value = _value[_name];
							})
							table.cell(i, opt.col).nodes().to$().html('<span class="' + type + '">' + _value + '</span>');
							type_data[type+'_'+data.id] = data;
						});
						if(typeof func !== 'undefined'){
							func.call(this, i, data);
						}
					}
				});
			}
		 } 
	  });
  }
  $.renderSupply = function(table,url){
	  var td = table.data();
	  $.each(td, function(i, val){
		id = val.supply.id;
		if(id > 0){
			 $.get('/'+ url +'/' + id, function(json){
				var data = json['data'][0];
				if(data){
						table.cell(i, 5).nodes().to$().html(data['merchant']['name']);
				}
			 });
		 } 
	  });
  };
  $.renderCell = function(table, row, col, type, id, name){
	  if(id != ''){
		  $.get('/data/' + type + '/' + id ,function(data){
			  if(data){
				  table.cell(row, col).nodes().to$().html(data[name]);
			  }
		  });
	  }
  }
  $.timestampToDate = function(timestamp){
//	return new Date(parseInt(timestamp) * 1000).toLocaleString().substr(0,17);
	var d = new Date(parseInt(timestamp) * 1000);
	var year = d.getFullYear(); 
	var month = (d.getMonth() + 1).toString().length > 1 ? (d.getMonth() + 1) : ('0' + (d.getMonth() + 1)); 
	var date = d.getDate().toString().length > 1 ? d.getDate() : '0' + d.getDate();
	var hour = (d.getHours().toString().length > 1) ? d.getHours() : '0' + d.getHours(); 
	var minute = (d.getMinutes().toString().length > 1) ? d.getMinutes() : '0' + d.getMinutes(); 
	var second = (d.getSeconds().toString().length > 1) ? d.getSeconds() : '0' + d.getSeconds(); 
	return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second; 
  }
  
  $.simpleDate = function(timestamp){
		var d = new Date(parseInt(timestamp) * 1000);
		var year = d.getFullYear(); 
		var month = (d.getMonth() + 1).toString().length > 1 ? (d.getMonth() + 1) : ('0' + (d.getMonth() + 1)); 
		var date = d.getDate().toString().length > 1 ? d.getDate() : '0' + d.getDate();
		return year + "-" + month + "-" + date; 
	  }
  /**
   * merchant auto complete
   */

  $.autoCompleteMerchant = function(index, callback_fun, selected_fun){
	var t_selector = '#merchant_typehead';
	var i_selector = '#input_merchant';
	if(index && index > 0){
		t_selector += '_' + index;
		i_selector += '_' + index;
	}
	if($(t_selector).length > 0){
		var data = {};
		$(t_selector).typeahead({
			source : function(query, process) {
				$(t_selector).addClass('error');
				$.get('/picker/merchant/' + query, function(json) {
					process(json.data);
				});
			},
			autoSelect : true,
			minLength : 1,
			delay : 50,
			items:8,
			matcher : function(item) {
				if(item.name.toLowerCase() == $(t_selector).val()){
					$(i_selector).val(item.id);
					$(t_selector).removeClass('error');
					return false;
				} 
				return true;
			},
			afterSelect : function(item) {
				$(t_selector).removeClass('error');
				$(i_selector).val(item.id);
				selected_fun && selected_fun.call(this, item.id);
			},
			lookup: false
		}).keyup(function(){
			if($(t_selector).val() == ''){
				$(t_selector).removeClass('error');
			}
		}).blur(function(){
			if($(i_selector).val() =='' && $(t_selector).val() != ''){
				$(this).addClass('error');
			}
		});
		callback_fun && (typeof callback_fun == 'function') && callback_fun.call(this);
	}
  }
  
  /**
   * user auto complete
   * @returns
   */
  $.autoCompleteUser = function(){
		if(('#user_typeahead').length > 0){
			var data = {};
			$('#user_typeahead').typeahead({
				source : function(query, process) {
					$('#user_typeahead').addClass('error');
					$.get('/picker/user/' + query, function(json) {
						process(json.data);
					});
				},
				autoSelect : true,
				minLength : 1,
				delay : 50,
				matcher : function(item) {
					if(item.name.toLowerCase() == $('#user_typeahead').val()){
						$('#input_user').val(item.id);
						$('#user_typeahead').removeClass('error');
						return false;
					} 
					return true;
				},
				afterSelect : function(item) {
					$('#user_typeahead').removeClass('error');
					$('#input_user').val(item.id);
				}
			}).keyup(function(){
				if($('#user_typeahead').val() == ''){
					$('#user_typeahead').removeClass('error');
				}
			}).blur(function(){
				if($('#input_user').val() =='' && $('#user_typeahead').val() != ''){
					$(this).addClass('error');
				}
			});
		}
	  }
  
  /**
   * 创建search输入框
   * option{name, label}
   * table
   * append
   * 在查询按钮后需要添加的附加
   */
  $.createSearch = function(opt, table, append){
	  var html = '';
	  $.each(opt, function(i, bt){
		  if(bt.name == 'merchant'){
			  html += 
			  '<div class="single-search form-group form-horizontal col-md-3">'
			+ '<label for="company" class="col-md-4 control-label">' + bt.label + '</label>'
			+ '<div class="col-md-8">'
			+ '<input style="display:none">'
			+ '<input type="hidden" name="merchant" id="input_'+ bt.name + '">'
			+ '<input type="text" class="form-control col-md-7 typeahead" id="merchant_typehead" placeholder="商户" autocomplete="off">'
			+ '</div>'
			+ '</div>';
		  }else if(bt.name == 'stock'){
              html +=
                  '<div class="single-search form-group form-horizontal col-md-3">'
                  + '<label for="company" class="col-md-4 control-label">' + bt.label + '</label>'
                  + '<div class="col-md-8">'
                  + '<select class="form-control stock-select"></select>'
                  + '</div>'
                  + '</div>';
		  } else {
			  html +=
			   '<div class="single-search form-group form-horizontal col-md-4">' +
			  '<label for="input_' + bt.name + '" class="col-md-4 control-label">' + bt.label + '</label>' + 
			  '<div class="col-md-8">' + 
			  '<input type="text" class="form-control col-md-7" id="input_' + bt.name + '" name="' + bt.name + '" placeholder="' + bt.name +'">' +
			  '</div>' +
			  '</div>';
		  }
	  });
	  $('.search').show().find('.search-btn').before(html);
	  if(append && append != ''){
		  $('.search').show().find('.search-btn').after(append);
	  }
	  $.autoCompleteMerchant();
	  /*
	  if(('#merchant_typehead').length > 0){
		  $('#merchant_typehead').typeahead({
			  source : function(query, process) {
				$.get('/picker/merchant/' + query, function(json) {
					process(json.data);
				});
			},
			autoSelect : true,
			minLength : 3,
			delay : 200,
			matcher : function() {
				return true
			},
			afterSelect : function(item) {
				$('#input_merchant').val(item.id);
			}
		}).change(function() {
			$('#input_merchant').val('');
		});
	  }*/
	  
	  /*$('.search .search-btn').click(function(){
		$.each(opt, function(i, bt){
			var val = $('#input_' + bt.name).val();
			table.columns(bt.col).search(val);
		});
		table.draw();
	  });*/
  };
  
  $.formatPrice = function(price, currency){
	  price = price - 0;
	  price = price.toFixed(2);
	  var _price = price + '';
	  if(_price.indexOf('.') >=0 ){
		  var _prices = _price.split('.');
		  var integer = _prices[0];
		  var decimal = _prices[1];
		  var _int = '';
		  function add_thousand(str){
			  if(str.length <= 3) return str;
			  return add_thousand(str.substr(0, str.length-3)) +',' + str.substr(str.length -3, str.length);
		  }
		  _int = add_thousand(integer);
		  if(!currency) currency = 'CNY';
		  var symbol = '¥';
		  switch(currency){
		  	case 'CNY':
		  		symbol = '¥';
		  		break;
		  	case 'USD':
		  		symbol = '$';
		  		break;
		  	default:
		  		break;
		  }
		  return symbol + _int + '.' + decimal; 
	  }
  }
  /**
   * 页面跳转
   */
  $.jump = function(url, _blank){
	  _blank ? window.open(url) : window.location.href = url;
  };
  /**
   * confirm box
   * mmsg是自定义文案，一般不传
   * ycf 点击确定回调函数
   * ncf 点击取消回调函数
   */
  $.confirmBox = function(name, value, ycf, ncf, mmsg){
		 if($('.notice.confirm-box.' + value).length == 0){
			 var html = '<div class="notice box box-solid confirm-box ' + value + '">'
				 + '<div class="box-header with-border">';
				 if(mmsg){
					html += '<span class="box-title">' + mmsg + '</span>';
				 } else {
					html += '<span class="box-title">确认' + name  + '操作?</span>';
				 }
				 html += '<div class="box-tools pull-right">'
				 + '<button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>'
				 + '</div>'
				 + '</div>'
				 + '<div class="box-body">'
				 + '<div class="footer-btn">'
				 + '<button type="submit" class="btn btn-info btn-confirm">' +( mmsg ? '是' : '确定') + '</button>'
				 + '<button type="submit" class="btn btn-default pull-right btn-cancel">' + (mmsg ? '否' : '取消') + '</button>'
				 + '</div>'
				 + '</div>'
				 + '</div>';
			 $('body').append(html);
		 }
		 $('.notice.confirm-box.' + value).show();
		 $('.notice.confirm-box.' + value).find('.btn-confirm').unbind().click(function(){
			ycf && ycf.call(this);
			$('.notice.confirm-box.'+ value +' .btn-box-tool').trigger('click');
		 });
		 $('.notice.confirm-box.' + value).find('.btn-cancel').unbind().click(function(){
			 ncf && ncf.call(this);
			 $('.notice.confirm-box.' + value + ' .btn-box-tool').trigger('click');
		 });
  }
  $.deleteConfirm = function(cf){
	 if($('.notice.delete-confirm').length == 0){
		 var html = '<div class="notice box box-solid delete-confirm">'
			 + '<div class="box-header with-border">'
			 + '<span class="box-title">确认删除?</span>'
			 + '<div class="box-tools pull-right">'
			 + '<button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button>'
			 + '</div>'
			 + '</div>'
			 + '<div class="box-body">'
			 + '<div class="footer-btn">'
			 + '<button type="submit" class="btn btn-info btn-confirm">确定</button>'
			 + '<button type="submit" class="btn btn-default pull-right btn-cancel">取消</button>'
			 + '</div>'
			 + '</div>'
			 + '</div>';
		 $('body').append(html);
	 }
	 $('.notice.delete-confirm').show();
	 $('.notice.delete-confirm').find('.btn-confirm').unbind().click(function(){
		if(typeof cf == 'function') cf.call(this);
		$('.notice.delete-confirm .btn-box-tool').trigger('click');
	 });
	 $('.notice.delete-confirm').find('.btn-cancel').unbind().click(function(){
		 $('.notice.delete-confirm .btn-box-tool').trigger('click');
	 });
  }
  
  //上传excel公用
  function validFileTypeFailed(){
	  $.msgBox("文档类型不正确，请上传excel文件", "warning");
  }
  //表单校验
  $.fn.validation = function(option){
	var pass = true;
	var value = $(this).val();
	this.no_blank = function(rule){
		if(rule){
			$(this).siblings('.error-msg').remove();
			if($(this).val() == ''){
				$(this).addClass('error-border');
				$(this).after('<span class="error-msg">输入项不能为空</span>');
				pass = false;
			} else {
				$(this).removeClass('error-border');
			}
		}
	}
	this.check_code = function(rule){
		if(rule){
			$(this).siblings('.error-msg').remove();
			if(!(/^[A-Za-z\d]{6,16}$/.test(value))){// /^[A-Za-z\d]{11,}$/
				$(this).addClass('error-border');
				$(this).after('<span class="error-msg">输入项为11位的数字或字母</span>');
				pass = false;
			}else {
				$(this).removeClass('error-border');
			}
		}
	}
	this.number = function(rule){
		if(rule){
			$(this).siblings('.error-msg').remove();
			if(!(/^\d+\d$/.test(value))){
				$(this).addClass('error-border');
				$(this).after('<span class="error-msg">输入项只能为数字</span>');
				pass = false;
			} else {
				$(this).removeClass('error-border');
			}
		}
	}
	this.mini_length = function(rule){
		if(parseInt(rule) > 0){
			$(this).siblings('.error-msg').remove();
			if(value.length < parseInt(rule)){
				$(this).addClass('error-border');
				$(this).after('<span class="error-msg">长度不能短于' + rule + '位</span>');
				pass = false;
			} else {
				$(this).removeClass('error-border');
				$(this).siblings('.error-msg').remove();
			}
		}
	}
	
	this.max_length = function(rule){
		if(parseInt(rule) > 0){
			$(this).siblings('.error-msg').remove();
			if(value.length > parseInt(rule)){
				$(this).addClass('error-border');
				$(this).after('<span class="error-msg">长度不能超过' + rule + '位</span>');
				pass = false;
			} else {
				$(this).removeClass('error-border');
			}
		}
	}
	this.is_price = function(rule){
		if(rule){
			$(this).siblings('.error-msg').remove();
			if(!(/^\d+(\.)?\d+$/.test(value))){
				$(this).addClass('error-border');
				$(this).after('<span class="error-msg">价格输入有误</span>');
				pass = false;
			} else {
				$(this).removeClass('error-border');
			}
		}
	}
	if(typeof option == 'object'){
		if($(this).length > 1){
			$.msgBox("表单只能进行单元素验证", "warning");
			return false;
		}
		for(var key in option){
			this[key] && this[key].call(this, option[key]);
			if(!pass){
				return false;
			}
		}
		return true;
	}
  }

  //默认地区选择
  $.staticDistrict = function(value){
  	$.get('/data/district/'+ value,function(data){
		var arr = $('select[name="province"]').find('option');
		for(var i=0; i<arr.length; i++){
			if($(arr[i]).val() == data.data[0].id){
				$('select[name="province"]').val($(arr[i]).val());
				// $.districtSelect('select[name="province"]');
				$.get('/data/districts/' + data.data[0].id + '.json',function(data1){
					$('select[name="city"]').find('option').remove();
					html = '<option value="-1">请选择</option>';
					$.each(data1, function(index, value){
						html += '<option value="' + value.id + '">' + value.name + '</option>';
					});
					$('select[name="city"]').append(html).find('option').removeAttr('selected').first().prop('selected', true);
					var arr1 = $('select[name="city"]').find('option');
					for(var j=0; j<arr1.length; j++){
						if($(arr1[j]).val() == data.data[1].id){
							$('select[name="city"]').val($(arr1[j]).val());
							$.get('/data/districts/' + data.data[1].id + '.json',function(data2){
								$('select[name="district"]').find('option').remove();
								html = '<option value="-1">请选择</option>';
								$.each(data2, function(index, value){
									html += '<option value="' + value.id + '">' + value.name + '</option>';
								});
								$('select[name="district"]').append(html).find('option').removeAttr('selected').first().prop('selected', true);
								var arr2 = $('select[name="district"]').find('option');
								for(var z=0; z<arr2.length; z++){
									if($(arr2[z]).val() == data.data[2].id) {
										$('select[name="district"]').val($(arr2[z]).val());
									}
								}
							})
						}
					}
				})
			}
		}

	})
  }
  // 三级联动选择
  $.districtSelect = function(that){
	  var id = $(that).find('option:selected').prop('value');
	  switch($(that).prop('name')){
		  case 'province':
			  if (id == -1){
				  $('select[name="city"], select[name="district"]').find('option').remove();
				  $('select[name="city"], select[name="district"]').append('<option value="-1">请选择</option>');
				  $('select[name="district"]').find('option').remove();
				  $('select[name="district"]').append('<option value="-1">请选择</option>');
				  return;
			  }
			  $.get('/data/districts/' + id + '.json', function(data){
				  $('select[name="city"]').find('option').remove();
				  html = '<option value="-1">请选择</option>';
				  $.each(data, function(index, value){
					  html += '<option value="' + value.id + '">' + value.name + '</option>';
				  });
				  $('select[name="city"]').append(html).find('option').removeAttr('selected').first().prop('selected', true);
			  });
			  $('select[name="district"]').find('option').remove();
			  $('select[name="district"]').append('<option value="-1">请选择</option>');
			  break;
		  case 'city':
			  if (id == -1){
				  $('select[name="district"]').find('option').remove();
				  $('select[name="district"]').append('<option value="-1">请选择</option>');
				  return;
			  }
			  $.get('/data/districts/' + id + '.json', function(data){
				  $('select[name="district"]').find('option').remove();
				  html = '<option value="-1">请选择</option>';
				  $.each(data, function(index, value){
					  html += '<option value="' + value.id + '">' + value.name + '</option>';
				  });
				  $('select[name="district"]').append(html).find('option').removeAttr('selected').first().prop('selected', true);
			  });
			  break;
		  default:
			  break;
	  }
  }
$(document).ready(function(){
//	  //nav bar
//	  $.getReceivedMessage();
//	  setInterval($.getReceivedMessage, 6000);
//	  
	var merchant_id = $('.navbar-nav .merchant-menu .name').attr('value');
	if(parseInt(merchant_id) > 0){
		  $.get('/data/merchant/' + merchant_id, function(data){
			var name = data.name;
			$('.navbar-nav .merchant-menu .name').html(name);
			$('.navbar-nav .merchant-menu').show();
		  });
	}
	$('.login-out button').click(function(){
		$.confirmBox('注销', 'login-out', function(){
			$('#logout').submit();
		}) ;
	});
	//menu selected
	var cur_path = window.location.pathname;
	var cur_a = $('li.treeview a[href="' + cur_path + '"]');
	cur_a.parents('li.treeview').addClass('active');
	cur_a.parent().addClass('active');
	//$('.sidebar-menu a.active').removeClass('active');
	//$('.sidebar-menu li a[href="' + cur_path + '"]').addClass('active');
});


// 订单详情展示(数据：事件源，ajax请求路径)
$.detailShow = function(json){
	json.ele.on('click',function(){
		var orderDetails = $(this).attr('value'),
			code = $(this).attr('code'),
			order_list = null,
			order_head = null,
			_this = this,
			obj = {},
			val = '';
			if($('.order_head[value $= ' + code +']').length != 0){
				$('.shrink[value $= ' + code +']').show();
			}else{
				$.mask();
				$.get('/order/'+json.url+'/'+orderDetails,function(data){
				var that = _this;
				for(var i=0; i<data.data.length; i++){
					val = data.data[i].supplier.id;
					content = data.data[i];
					(function(val,content){
                            $.get('/data/merchant/'+val,function(merchant){
								if($('#purchase_table').length){
									if(content.status == 'NEW'){
										order_list = '<tr class="head shrink" value = "'+ val + code +'">'
											+'<td></td>'
                                            +'<td>'+ content.productCode +'</td>'
                                            +'<td>'+ content.productName + '</td>'
                                            +'<td>'+ content.quantity +'</td>'
                                            +'<td>'+ $.formatPrice(content.price)+'</td>'
											+'<td ></td>'
											+'<td><button class="btn btn-primary btn-sm btn-confirm" value="'+ content.id +'">确认收货</button></td>'
                                            +'</tr>';
									}else {
										order_list = '<tr class="head shrink" value = "'+ val + code +'">'
											+'<td></td>'
                                            +'<td>'+ content.productCode +'</td>'
                                            +'<td>'+ content.productName + '</td>'
                                            +'<td>'+ content.quantity +'</td>'
                                            +'<td>'+ $.formatPrice(content.price)+'</td>'
											+'<td ></td>'
											+'<td>'+ content.status+'</td>'
                                            +'</tr>';
									}
								}else{
									order_list = '<tr class="head shrink" value = "'+ val + code +'">'
											+'<td></td>'
                                            +'<td>'+ content.productCode +'</td>'
                                            +'<td>'+ content.productName + '</td>'
                                            +'<td>'+ content.quantity +'</td>'
                                            +'<td>'+ $.formatPrice(content.price)+'</td>'
											+'<td colspan="2"></td>'
                                            +'</tr>';
								}
                            if(!obj[val]){
                                obj[val] = 1;
                                order_head = '<tr class="order_head shrink" value="'+ val + code +'">'
								+'<td></td>'
								+'<td>供应商：'+ merchant.name +'</td>'
								+'<td></td>'
                                +'<td class="quantity">' + content.quantity + '</td>'
								+'<td class="price">'+ $.formatPrice(content.price * content.quantity) +'</td>'
								+'<td colspan="2"></td>'
                                +'</tr>';
                                $(that).parents('tr').after(order_head);
                                $('.order_head[value = '+ val + code +']').after(order_list);
                            }else{
                                $('.head[value = '+ val + code +']').after(order_list);
								var num = $('.order_head[value = '+ val + code +']').find('.quantity').html() - 0;
								var str = $('.order_head[value = '+ val + code +']').find('.price').html().substring(1).replace(',','') - 0;
								str =  str + ($.formatPrice(content.price * content.quantity).substring(1).replace(',','')-0);
								str = str.toLocaleString()
								$('.order_head[value = '+ val + code +']').find('.quantity').html(num + content.quantity);
								$('.order_head[value = '+ val + code +']').find('.price').html('¥'+str);
                            }
							$.hideMask();
                            })
                        })(val,content);
				}
			})
			}
			
	})
};
// 获取供应商名称
$.getName = function(str){
	$.get('/supply/'+str,function(data){
		$('td[value = '+ str +']').html(data.data[0].merchant.name);
	})
}

//code目录查询
  $.searchCode = function () {
	$('.bs-example-modal-lg').remove();
	var model_box = $('<div tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" id="model-mask"></div>')
			.addClass('modal fade bs-example-modal-lg')
				.append($('<div></div>').addClass('modal-dialog modal-lg').attr('role','document')
					.append($('<div></div>').addClass('modal-content')));
	model_box.appendTo('body');
	$('.modal-content').append('<iframe class="model-iframe" id="search-code" data-origin="' + location.href + '" name="search_code" src="/parts/searchcode"  height="500px"></iframe>');
};
