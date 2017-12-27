var load_codes =[];
var display_codes = [];
var snapshot_id = '';
var init_pn_product = {};
var offer_mer = $.get_url('company');
var offer_status = $.get_url('status');

new Fingerprint2().get(function(result){
	snapshot_id += result + '_' + Date.parse(new Date());
});
var bill = {};//当前比价单对象
var last_data = {};
var com = new Comparison(); //当前比价信息
var saved_com = new Comparison(); //最后一次保存的比价信息
//文件上传之前进行的校验
function normalize(code) {
	return code ? code.replace(/[^a-z0-9]/ig, '_') : '';
}

function withParam(){
	$('#input_merchant').removeClass('error-border');
	if($('#search_merchant').length > 0){
		if($('#input_merchant').val() == '' || $('#input_merchant').val() == '-1'){
			$.msgBox("请先选择商户", "warning");
			$('#input_merchant').addClass('error-border');
			return false;
		}
	}
	return true;
}
//计算订单总金额
function update_order_total(){
	var total = com.cost();
	$('.order-total.price').html($.formatPrice(total));
	//更新运费
	update_shipping_cost();
}

/**
 * 跟新运费
 * @returns
 */
function update_shipping_cost(){
	var total_shipping = com.shipping_cost();
	$('.shpping-cost.price').html($.formatPrice(total_shipping));
	update_total_cost();
}

function update_total_cost(){
	var total_cost = com.cost() + com.shipping_cost();
	$('.total-cost').html($.formatPrice(total_cost));
}
//刷新商户列表
function update_merchant_list(){
	var merchants = [];
	$('.pds-list').find('table').each(function(){
		var data = $(this).DataTable().data();
		$.each(data, function(i, pd){
			if($.inArray(pd.merchant.id, merchants) == -1){
				merchants.push(pd.merchant.id);
			}
		});
	});
	if($('.right-th .merchant .dropdown-menu li[value=""]').length == 0){
		$('.right-th .merchant .dropdown-menu').append('<li value=""><a href="javascript:;"><span class="glyphicon glyphicon-ok hidden"></span>所有供应商</a></li>');
	}
	$.each(merchants, function(j, m){
		$.get('/data/merchant/' + m, function(data){
			if($('.right-th .merchant .dropdown-menu').find('li[value="' + m + '"]').length == 0){
				$('.right-th .merchant .dropdown-menu').append('<li value="' + data.id + '"><a href="javascript:;"><span class="glyphicon glyphicon-ok hidden"></span>' + data.name + '</a></li>');
			}
		});
	});
	$('.right-th .merchant .dropdown-menu').unbind().on('click', 'li', function(){
		var val = $(this).attr('value');
		if(val == ''){
			if($(this).find('.glyphicon-ok.hidden').length > 0){
				$(this).parent().find('li .glyphicon-ok').removeClass('hidden');
			} else {
				$(this).parent().find('li .glyphicon-ok').addClass('hidden');
			}
		} else {
			if($(this).find('.glyphicon-ok.hidden').length > 0){
				$(this).find('.glyphicon-ok').removeClass('hidden');
			} else {
				$(this).find('.glyphicon-ok').addClass('hidden');
				$('.right-th .merchant .dropdown-menu li').first().find('.glyphicon-ok').addClass('hidden');
			}
		}
		$(window).trigger('price_search');
	});
}
//刷新类别列表
function update_type_list(id, name){
	var drop = $('.right-th .type .dropdown-menu');
	drop.removeClass('hidden');

	if(drop.find('li[value="' + id + '"]').length == 0){
		drop.append('<li value="' + id + '"><a href="javascript:;"><span class="glyphicon glyphicon-ok hidden"></span>' + name + '</a></li>');
	}
	$('.right-th .type .dropdown-menu').unbind().on('click', 'li', function(){
		var val = $(this).attr('value');
		if(val == ''){
			if($(this).find('.glyphicon-ok.hidden').length > 0){
				$(this).parent().find('li .glyphicon-ok').removeClass('hidden');
			} else {
				$(this).parent().find('li .glyphicon-ok').addClass('hidden');
			}
		} else {
			if($(this).find('.glyphicon-ok.hidden').length > 0){
				$(this).find('.glyphicon-ok').removeClass('hidden');
			} else {
				$(this).find('.glyphicon-ok').addClass('hidden');
				$('.right-th .merchant .dropdown-menu li').first().find('.glyphicon-ok').addClass('hidden');
			}
		}
		$(window).trigger('price_search');
	});
}
//刷新品牌列表
function update_brand_list(id, name){
	var drop = $('.right-th .brand .dropdown-menu');
	if(drop.find('li[value="' + id + '"]').length == 0){
		drop.append('<li value="' + id + '"><a href="javascript:;"><span class="glyphicon glyphicon-ok hidden"></span>' + name + '</a></li>');
	}
	$('.right-th .brand .dropdown-menu').unbind().on('click', 'li', function(){
		var val = $(this).attr('value');
		if(val == ''){
			if($(this).find('.glyphicon-ok.hidden').length > 0){
				$(this).parent().find('li .glyphicon-ok').removeClass('hidden');
			} else {
				$(this).parent().find('li .glyphicon-ok').addClass('hidden');
			}
		} else {
			if($(this).find('.glyphicon-ok.hidden').length > 0){
				$(this).find('.glyphicon-ok').removeClass('hidden');
			} else {
				$(this).find('.glyphicon-ok').addClass('hidden');
				$('.right-th .merchant .dropdown-menu li').first().find('.glyphicon-ok').addClass('hidden');
			}
		}
		$(window).trigger('price_search');
	});
}
//获取比价单对象
function  get_bill(){
	if($.isEmptyObject(bill)){
		$.get($('#input_merchant').length > 0 ? '/price/merchant/bill':'/price/bill', function(json){
			if(json.success){
				var data = json.data[0];
				bill = data;
			}
		});
	}
}
$(document).ready(function(){
	/**
	 * 创建PN对应的table
	 */
	//选中
	$('.pds-list').on('click', '.pn-check-box', function(){
		if($(this).find('i').hasClass('fa-circle-o')){
			$(this).find("i").removeClass('fa-circle-o').addClass('fa-check-circle');
		} else{
			$(this).find("i").removeClass('fa-check-circle').addClass('fa-circle-o');
		}
	});
	var create_table = function(code, url, merchant_id, quantity,param){
		//code = code.replace(/[^a-z0-9]/ig, '_');
		if($.inArray(code, display_codes) == -1){
			display_codes.push(code);
		}
		if($('.area_' + code).length > 0){
			if($('.area_' + code).attr('quantity') == quantity){
				$.hideMask();
				$('.area_' + code).removeClass('hidden');
				return true;
			}else {
				$('.area_' + code).remove();
			}
		}
		com.add_pn(code, quantity);//添加PN及其数量
		var table_html =
		 '<div class="row pn-row area_'+ code +'" pn="' + code + '" quantity="' + quantity + '">'
		+ '<div class="col-md-4 left-bar">'
		+ '<span class="pn-check-box" pn="' + code + '"><i class="fa fa-fw fa-circle-o"></i></span>'
		+ '<span class="pn-title">' + code +'</span><a class="delete c_'+ code +'" value="' + code + '"  data-toggle="tooltip" data-placement="bottom" title="删除"><i class="fa fa-fw fa-remove"></i></a><a class="open-close code_' + code + '" data-toggle="tooltip" data-placement="bottom" title="收起或展开"><i class="fa fa-fw fa-minus"></i></a>'
		// + '<div class="col-md-12 search-quantity"><span class="control-label">数量:<span pn_code="' + code + '" class="qty badge bg-green" value="' + quantity + '">' + quantity + '</span></span></div>'
		+ '</div>'
		+ '<div class="col-md-8 right-table">'
		+ '<table id="table_' + code + '" class="table table-striped table-bordered table-hover col-md-8" cellspacing="0" width="100%">'
		+ '<thead>'
		+ '<tr class="text-center">'
		+ '<th><a href="javascript:;"></a></th>'
		+ '<th style="width:90px;"><a href="javascript:;" >供应配件编号</a></th>'
		+ '<th style="width:90px;"><a href="javascript:;"  >供应商品编号</a></th>'
		+ '<th><a href="javascript:;">名称</a></th>'
		+ '<th><a href="javascript:;">数量</a></th>'
		+ '<th><a href="javascript:;">单价</a></th>'
		+ '<th><a href="javascript:;">总价</a></th>'
		+ '<th><a href="javascript:;">售价</a></th>'
		+ '<th><a href="javascript:;">库存</a></th>'
		+ '<th><a href="javascript:;">类别</a></th>'
		+ '<th><a href="javascript:;">品牌</a></th>'
		+ '<th><a href="javascript:;">商户</a></th>'
		// + '<th><a href="javascript:;">服务评分</a></th>'
		// + '<th><a href="javascript:;">是否含税</a></th>'
		+ '</tr>'
		+ '</thead>'
		+ '</table>'
		+ '</div>'
		+ '</div>';
		$('.pds-list').append(table_html);

		var table = $('#table_' + code).DataTable({
			"ajax": {
				//修改3
				"url": url ,
				"headers":{
					"referenceId": snapshot_id
				},
				"type": 'POST',
				"data": param//,
				//dataSrc: function(json) {
				//	var data = [];
				//	$.each(json.data || [], function() {
				//		product['code'] = normalize(product['code']);
				//		data.push(product);
				//	});
				//	return data;
				//}
			},
			"scrollCollapse": true,
			"paging": false,
			"rowId": 'id',
			"processing":true,
			"searching": true,
			"ordering": true,
			"autoWidth": false,
			"serverSide":false,
			"language":language,
			"order": [[6, 'asc']],
			"columnDefs": [
				{ 	//radio
					"data": function(data){
						return '<input type="radio" name="selected_' + code + '" value="' + data.id + '">';
					},
					"targets":0,
				},
				{ 	//供应配件编号
					"data": "parts.code",
					"targets":1,
					"defaultContent":'',
					"className": 'parts-code',
					"createdCell": function( cell, cellData, rowData, rowIndex, colIndex ){
						$(cell).attr('title',cellData);
					}
				},
				{ 	//供应商品编号
					"data": "code",
					"targets":2,
					"defaultContent":'',
					"className": 'parts-code',
					"createdCell": function( cell, cellData, rowData, rowIndex, colIndex ){
						$(cell).attr('title',cellData);
					}
				},
				{   //名称
					"data": "name",
					"targets":3,
					"defaultContent":'',
					"className": 'parts-name'
				},
				{   //数量
					"data": "null",
					"targets":4,
					"defaultContent": quantity,
					"className": 'parts-quantity'
				},
				{   //单价
					"data": function(data){
						return $.formatPrice(data.price, data.currency);
					},
					"targets":5,
					"className": 'parts-price',
				},
				{   //总价
					"data": function(data){
						return $.formatPrice(data.price * quantity, data.currency);
					},
					"targets":6,
					"defaultContent":'',
					"className": 'parts-price',
				},
				// { 	//售价
				// 	"data": function(data){
				// 		return $.formatPrice(data.price, data.currency);
				// 	},
				// 	"targets":7,
				// 	"defaultContent":'',
				// },
				{   //库存
					"data": "inventory",
					"targets":7,
				},
				{   //类别
					"data":"parts.tags.1000",
					"targets":8,
					"defaultContent":'',
					"className": 'parts-typing'
				},
				{   //品牌
					"data":"parts.brand.name",
					"targets":9,
					"defaultContent":'',
					"className": 'parts-typing'
				},
				{ 	//商户
					"data": "null",
					"targets":10,
					"defaultContent":'',
					"className": 'parts-merchant'
				},
				// {   //服务评分
				// 	"data":"null",
				// 	"targets":12,
				// 	"defaultContent":'',
				// },
				// {  //时候含税
				// 	"data":"null",
				// 	"targets":13,
				// 	"defaultContent":'',
				// },
				{
					"data":"merchant.id",
					"targets":11,
					"defaultContent":'',
					"visible":false
				},
				{
					"data":"null",
					"targets":12,
					"defaultContent":'',
					"visible":false
				},
				{
					"data":"parts.brand.id",
					"targets":13,
					"defaultContent":'',
					"visible":false
				}
			],
			"info" : false,
			"drawCallback": function(setting){
				//获取当前显示在页面上的数据
				if(com.pn_data[code] && com.pn_data[code].length > 0){
					com.selected_data[code]=[];
					$('#table_' + code).find('tbody tr[role="row"]').each(function(){
						var pid = $(this).attr('id');
						$.each(com.pn_data[code], function(i, d){
							if(d.id == pid){
								com.selected_data[code].push(d);
							}
						});
					});
				}
			}
		}).on('init.dt', function(e, settings, json) {

		}).on('draw.dt', function () {
			$.renderName(table, 'merchant', 'merchant.id', [{"col":10, "name":"name"}]);
			$.each(table.data(), function(i, d){
				var id = 'AM';
				var name = 'AM';
				if(d && d['parts'] && d['parts']['tags']){
					id = name = d['parts']['tags']['1000'];
				}
				update_type_list(id, name);
				if(d.parts.brand){
					var brand_id = d.parts.brand.id;
					var brand_name = d.parts.brand.name;
					if(brand_id && brand_name){
						update_brand_list(brand_id, brand_name);
					}
				}
			});

			$('#table_' + code).find('input:radio:checked').removeProp('checked');
			$('#table_' + code).find('input:radio').first().prop('checked', 'checked');
			var pid = $('#table_' + code).find('input:radio').first().prop('value');//首行默认选中
			//默认选中的数据提交
			if(pid){
				submit_product(code,pid);
			}
			//选中商品对应的供应商
			var _merchant = 0;
			$.each(table.data(), function(i, val){
				if(val.id == pid){
					_merchant = val.merchant.id;
				}
			});
			com.update_pn(code, _merchant, pid);//修改PN对应的选中商品和供应商
			com.add_pn_data(code, table.data());//添加PN对应的table数据
			$.each(table.data(), function(m, d){
				if(!com.merchant_shipping[d.merchant.id]){
					$.get('/supplier/' + d.merchant.id+ '/fee', function(dt){
						if(dt.success){
							com.merchant_shipping[d.merchant.id] = dt.data[0]['value'];//获取当前PN对应的产品中所有商户的运费
							update_shipping_cost();//修改运输费用
						}
					})
				}
			})
			$('#table_' + code + '_filter').addClass('hidden');
			$.hideMask();
			// 修改PN对应的选中商品
			$('#table_' + code).unbind('change').on('change', 'input:radio[name="selected_' + code + '"]', function(){
				$('#order_rule').val('-1');
				$.mask();
				$(this).prop('checked', 'checked')
				var selected_id = $(this).prop('value');//选中的商品ID
				var _merchant = 0;
				$.each(table.data(), function(i, val){
					table.cell(i, 12).data(0);
					if(val.id == selected_id){
						table.cell(i,12).data(1);//选中的商品行的11列置为1
						_merchant = val.merchant.id;//选中的商品的供应商ID
					}
				});
				com.update_pn(code, _merchant, selected_id);//修改PN对应的选中商品的供应商ID，产品ID
				//提交选中产品ID
				submit_product(code, selected_id);
				table.order(6, 'asc').draw();//按价格排序
				table.order(12, 'desc').draw();//按选中排序
				update_order_total();//更新订单总金额和运费
				$('#order_rule').val('-1');//所有手动修改都重置比价规则到不使用规则
				$.hideMask();
			});
			//行双击触发radio选中
			$('#table_' + code).unbind('dblclick').on('dblclick','tr[role="row"]', function(){
				$(this).find('input:radio').trigger('click');
			})
			//收起与展开
			$('.left-bar .open-close.code_' + code).unbind().bind('click', function(){
				if($(this).find('i').hasClass('fa-minus')){
					$(this).find('i').removeClass('fa-minus').addClass('fa-plus');
					$(this).prop("title", "收起或展开");
					$.each(table.rows()[0], function(i){
						if(!$('input:radio', table.row(i).node()).prop('checked')){
							 $(table.row(i).node()).hide();
						}
					});
				} else {
					$(this).find('i').removeClass('fa-plus').addClass('fa-minus');
					$(this).prop("title", "收起或展开");
					$.each(table.rows()[0], function(j){
						if(!$('input:radio', table.row(j).node()).prop('checked')) $(table.row(j).node()).show();
					});
				}
			});
			//删除配件编号
			$('.left-bar .delete.c_' + code).unbind().bind('click', function(){
				$('#order_rule').val('-1');
				$.deleteConfirm(function(){
					$('.area_' + code).remove();
					com.delete_pn(code);//删除PN
					update_order_total();//修改订单总金额
					update_merchant_list();//修改供应商列表
				});
			});
			get_bill();
			if(init_pn_product[code]){
				com.update_pn(code, false, init_pn_product[code]);
				delete init_pn_product[code];
				update_selected_per(code);
			}
			update_order_total();
			update_merchant_list();
		});

	}
	//按供应商查询
	$(window).on('price_search', function(e, val){
		$('#order_rule').val('-1');
		var mh_val = '';
		var ty_val = '';
		var bd_val = '';
		var mh_re = false;
		var ty_re = false;
		var bd_re = false;
		if($('.right-th .merchant .dropdown-menu').find('.glyphicon-ok.hidden').lenght == 0){
			//选中所有项
			mh_val = '';
			mh_re = false;
		} else {
			$('.right-th .merchant .dropdown-menu li').each(function(){
				if($(this).find('.glyphicon-ok.hidden').length == 0){
					mh_val += (mh_val == '' ? $(this).attr('value') : ('|' + $(this).attr('value')));
				}
			})
			mh_re = true;
		}
		if($('.right-th .type .dropdown-menu').find('.glyphicon-ok.hidden').lenght == 0){
			//选中所有项
			ty_val = '';
			ty_re = false;
		} else {
			$('.right-th .type .dropdown-menu li').each(function(){
				if($(this).find('.glyphicon-ok.hidden').length == 0){
					ty_val += (ty_val == '' ? $(this).attr('value') : ('|' + $(this).attr('value')));
				}
			})
			ty_re = true;
		}
		if($('.right-th .brand .dropdown-menu').find('.glyphicon-ok.hidden').lenght == 0){
			//选中所有项
			bd_val = '';
			bd_re = false;
		} else {
			$('.right-th .brand .dropdown-menu li').each(function(){
				if($(this).find('.glyphicon-ok.hidden').length == 0){
					bd_val += (bd_val == '' ? $(this).attr('value') : ('|' + $(this).attr('value')));
				}
			})
			bd_re = true;
		}
		$.each(com.pn, function(i, pn){
			var table = $('#table_' + pn).DataTable();
			table.column(10).search(mh_val, mh_re).draw();
			table.column(6).search(ty_val, ty_re).draw();
			table.column(12).search(bd_val, bd_re).draw();
		});

	});
	$('.search .icheckbox_flat-blue input').click(function(){
		if($('.search .icheckbox_flat-blue').hasClass("checked")){
			$('.search .icheckbox_flat-blue').removeClass("checked");
		} else {
			$('.search .icheckbox_flat-blue').addClass("checked");
		}
	});
	//委托报价页面加载商户
	if($('#search_merchant').length > 0){
		$('#input_merchant').append('<option value="-1">请选择</option>');
		$.get("/merchant/customers ", function(json){
			if(json['data'].length > 0){
				$.each(json['data'], function(i, d){
					$('#input_merchant').append('<option value="' + d['merchant']['id'] + '">' + d['merchant']['name'] + '</option>');
				});
				if(offer_mer && offer_status){//报价页面跳此页面初始化赋值
					console.log(offer_mer && offer_status);
                    $.get('/price/merchant/receive/'+offer_mer,function (data) {
                        $('#input_merchant').find('option[value='+data.data[0].customer.id+']').attr('selected','selected');
                        $.each(data.data[0].codes, function (i,v) {
							var param = {};
							param['code'] = v.code;
							param['quantity'] = v.quantity;
							param['merchantId'] = $('#input_merchant').val();
							create_table(v.code,'/price/merchant',$('#input_merchant').val(),v.quantity,param);
                        })
                    })
				}
            }
		});
	}
	//获取当前比价单  路径修改
	$.get($('#input_merchant').length > 0 ? '/price/merchant/bill':'/price/bill', function(json){
		if(json.success){
			var data = json.data[0];
			bill = data;
			if(bill.customer){
				$('#input_merchant').val(bill.customer.id);
			}
			if(data.codes && data.codes.length > 0){
				var accurate = $('.search .icheckbox_flat-blue').hasClass("checked");
				$.each(data.codes, function(i, code){
					var pn = code.code;
					if(pn){
						var param = {};
						var product = code.selected;
						var merchantId = bill['customer'] ? bill['customer']['id'] : '';
						var url = $('#input_merchant').length > 0 ? '/price/merchant':'/compare/price';
						var quantity = code.quantity;
						if(product) init_pn_product[pn] = product;
						if (accurate)     //精确查找暂不生效
							param['accurate'] = 'accurate';
						if(merchantId)
							param['merchantId'] = merchantId;
						param['code'] = pn;
						param['quantity'] = quantity;
						create_table(pn, url, merchantId , quantity,param);
					}
				})
			}
		}
	});
	//默认展示"总价最低(不包含运费)规则"
//	$('#order_rule').val(1);
	//添加配件编号
	$('.search .search-btn').click(function(){
		$('#order_rule').val('-1');
		var accurate = $('.search .icheckbox_flat-blue').hasClass("checked");
		if($('#search_merchant').length > 0){
			$('#input_merchant').removeClass('error-border');
			if($('#input_merchant').val() == '' || $('#input_merchant').val() == '-1'){
				$.msgBox("请选择商户", "warning");
				$('#input_merchant').addClass('error-border');
				return false;
			}
		}

		$('#input_code').removeClass('error-border');
		var code = $('#input_code').val();
		if(!code || code == '') {
			$.msgBox("请输入code", "warning");
			$('#input_code').addClass('error-border');
			return false;
		}
		$('#input_quantity').removeClass('error-border');
		var quantity = $('#input_quantity').val();
		if(quantity == ''){
			$.msgBox("请输入数量", "warning");
			$('#input_quantity').addClass('error-border');
			return false;
		}
		if(!(/\d+/.test(quantity)) || parseInt(quantity) < 0){
			$.msgBox("数量只能输入大于0的数字", "warning");
			return false;
		}

		//修改4
		var url = $('#search_merchant').length > 0 ? "/price/merchant" : "/compare/price"  ;
		//var standardUrl = $('#search_merchant').length > 0 ? "/price/merchant/parts" : "/compare/price/parts"  ;
		$.mask();
		//$.ajax({
		//	url: standardUrl,
		//	type: 'POST',
		//	data: {
		//		code: code
		//	},
		//	success: function(json){
		//		if (json.success && $.isArray(json.data) && json.data.length > 0) {
		//			var code = normalize(json.data[0].code);

					if($('#table_' + code).length > 0){
						$('#table_' + code).addClass('selected');
					}
					var merchant_id = $('#input_merchant').val();

					var param = {};
					param['code'] = code;
					param['quantity'] = quantity;
					if (accurate) param['accurate'] = 'accurate';
					if($('#search_merchant').length > 0) param['merchantId'] = $('#input_merchant').val();
					create_table(code, url, merchant_id, quantity,param);
		//		} else {
		//			$.msgBox('查询的配件编码不存在', 'warning');
		//		}
		//	}
		//});
	});
	//更改比价规则
	$('#order_rule').change(function(){
		var _val = $(this).val();
		switch(_val){
			case '1':
				com.mini_cost();
				update_selected();
				break;
			case '2':
				com.mini_cost_shipping();
				update_selected();
				break;
			default:
				break
		}
	});
	//，修改PN对应的选中商品
	function update_selected(){
		$.each(com.pn, function(i, pn){
			update_selected_per(pn);
		});
	}
	function update_selected_per(pn){
		var table = $('#table_' + pn).DataTable();
		var first_id = $('#table_' + pn).find('input:radio').first().prop('value');
		var selected_id = com.pn_product[pn];
		$.each(table.rows()[0], function(i, val){
			table.cell(i, 12).data(0);
			if($('input:radio', table.cell(i, 0).node()).prop('value') == selected_id){
				table.cell(i,12).data(1);
			}
		});
		table.order(6, 'asc').draw();
		table.order(12, 'desc').draw();
		//首行选中
		$('#table_' + pn).find('input:radio:checked').removeProp('checked');
		$('#table_' + pn).find('input:radio').first().prop('checked', 'checked');
	}
	//退回上一步
	$('.btn-price-pre').click(function(){
		$('.btn-price-next').removeClass('hidden');
		$('.btn-price-complete').addClass('hidden');
		$('.btn-price-reset').removeClass('hidden');
		$('.price-rule').removeClass('hidden');
		$(this).addClass("hidden");
		$('.mhs-list').html('');
		pn_merchant = {};//重置按 供应商分组数据
		$('.pds-list').removeClass('hidden');
		//跟新选中项
		update_selected();
		$('.search.row').removeClass('hidden');
	});
	//提交
	$('.btn-price-submit').click(function(){
		if(!$.isEmptyObject(bill)){
			$.ajax({
				url:'/price/merchant/submit/'+ bill.id,
				method: 'PUT',
				success: function(data){
					if(data.success){
						$.msgBox(json.message);
						location.reload();
					}
				}
			})
		}
	})
	//重新展示数据
	function render_pns(merchant){
		if(merchant){
			render_per(merchant);//刷新一个merchant
		} else {
			for(var merchant in pn_merchant){
				render_per(merchant);//刷新所有的merchant
			}
		}
	}
	//渲染下一步页面的表格
	function render_per(merchant){
		var _ml = $('.mhs-list');
		var _mh = $('<div class="col-md-12 merchant"></div>');
		_ml.append(_mh);
		var _mn = $('<div class="col-md-12"><div class="col-md-12"><span class="merchant-name" value="' + merchant + '"></span></div><div class="col-md-12"><span class="merchant-total"></span></div></div>');
		_mh.append(_mn);
		var _pns = $('<div class="col-md-12"></div>');
		_mh.append(_pns);
		var total = 0;
		//按供应商进行分组展示
		$.each(pn_merchant[merchant], function(i, d){
			var pn = d;
			//创建展示卡片
			var quantity = com.pn_quantity[pn];
			var card = $('<div class="box" id="pn_' + pn + '"><div class="box-header"><h5 class="box-title">配件编号：' + pn + '</h5>&nbsp;&nbsp;数量<span pn_code="' + pn + '" class="qty badge bg-green" value="' + quantity + '">' + quantity + '</span><span class="open-close glyphicon glyphicon-eject"></span></div><div class="box-body no-padding"><table class="table table-condensed"><tbody><tr class="first"><th></th><th>商户</th><th>code</th><th>配件名称</th><th>采购价格</th></tr></tr></tbody></table></div></div>');
			_pns.append(card);
			var tbd = card.find('table>tbody');
			var pds = com.pn_data[pn];
			//创建tr
			var first_tr = '';
			//pds按价格排序
			pds = pds.sort(function(a, b){
				if(a.price && b.price){
					return a.price - b.price;
				}
				return 0;
			})
			$.each(pds, function(i, pd){
				var tr =$('<tr class="data"></tr>');
				//渲染
				tr.append('<td value="' + pd.id + '"><input class="draft-radio" type="radio" name="sel_' + pn + '"></td><td class="pd-merchant" value="' + pd.merchant.id + '"></td>').append('<td>' + pd.code + '</td>').append('<td>' + pd.name + '</td>').append('<td>' +$.formatPrice(pd.price, pd.currency) + '</td>');
				if(pd.id == com.pn_product[pn]){
					first_tr = tr;
					total += pd.price * quantity
				} else {
					tbd.append(tr);
				}
			});
			tbd.find('tr.first').after(first_tr);
			tbd.find('input[type="radio"]').removeProp('checked');
			tbd.find('tr.data').first().find('input[type="radio"]').prop('checked', 'true');
			//采购总金额
			_mn.find('.merchant-total').html("金额:&nbsp;&nbsp<span class='merchant-totoal' merchant='" + merchant + "'>" + $.formatPrice(total) + '</span>');
			//渲染商户名称
			tbd.find('td.pd-merchant').each(function(){
				var mid = $(this).attr('value');
				$.get('/data/merchant/' + mid, function(data){
					if(data){
						$('td.pd-merchant[value="' + mid + '"]').html(data.name);
					}
				});
			});
			//绑定展开事件
			card.on('click', '.box-header', function(){
				if($(this).find('.open-close').hasClass('glyphicon-triangle-bottom')){
					$(this).find('.open-close').removeClass('glyphicon-triangle-bottom').addClass('glyphicon-eject');
					card.find('.box-body').removeClass('hidden');
				} else {
					$(this).find('.open-close').removeClass('glyphicon-eject').addClass('glyphicon-triangle-bottom');
					card.find('.box-body').addClass('hidden');
				}
			});
		});
		_mn.find('.merchant-name').each(function(){
			var mid = $(this).attr('value');
			$.get('/data/merchant/'+ mid, function(data){
				$('.merchant .merchant-name[value="' + mid + '"]').html(data.name);
			});
		})
	}
	//进入下一步
	var pn_merchant = {}; //统计每个商户的配件编号
	$('.btn-price-next').click(function(){
		if($('#search_merchant').length > 0){
			if($('#input_merchant').val() == '' || $('#input_merchant').val() == '-1'){
				$.msgBox("请选择商户", "warning");
				return false;
			}
		}
		//整理数据
		if(com.pn.length == 0) {
			$.msgBox("无产品可以下单", "warning");
			return false;
		}

		$(this).addClass('hidden');
		$('.btn-price-pre').removeClass('hidden');
		$('.btn-price-complete').removeClass('hidden');
		$('.btn-price-reset').addClass('hidden');
		$('.price-rule').addClass('hidden');
		//购物车页
		//search隐藏
		$('.search.row').addClass('hidden');
		//当前列表隐藏
		$('.pds-list').addClass('hidden');
		//统计每个供应商提供的PN
		$.each(com.pn, function(i, pn){
			var pid = com.pn_product[pn];
			if(com.pn_data[pn] && com.pn_data[pn].length > 0){
				$.each(com.pn_data[pn], function(i, pd){
					if(pid == pd.id) {
						var mid = pd.merchant.id;
						if($('#merchant_typehead').length > 0){
							mid = $('#input_merchant').val();
						}
						if(!pn_merchant[mid]){
							pn_merchant[mid] = [];
						}
						pn_merchant[mid].push(pn);
					}
				});
			}
		});

		render_pns();

		//重算价格
		function update_price(merchant_id){
			if(pn_merchant[merchant_id] && pn_merchant[merchant_id].length > 0){
				var _total = 0;
				$.each(pn_merchant[merchant_id], function(i, pn){
					var pds = com.pn_data[pn];
					var quantity = com.pn_quantity[pn];
					$.each(pds, function(i, pd){
						if(pd.id == com.pn_product[pn]){
							_total += pd.price * quantity
						}
					});
				});
				$('.merchant-totoal[merchant="' + merchant_id + '"').html($.formatPrice(_total));
			}
		}
		//按供应商分组页，调整PN选中商品
		$('.mhs-list').on('click', 'input.draft-radio', function(){
			$('#order_rule').val('-1');
			var sr = $('.mhs-list').find('input.draft-radio[name="' + $(this).attr('name') + '"]:checked');
			var pn = sr.attr('name').replace('sel_', '');
			var pid = sr.parent().attr('value');
			var cur_merchant = $(this).parent().siblings('.pd-merchant').attr('value');
			var merchant_id = '';
			for(var m in pn_merchant){
				if($.inArray(pn, pn_merchant[m]) != -1) merchant_id = m;//修改之前的PN的选中的商品对应的商户
			}
			if(cur_merchant != merchant_id){
				var pns = pn_merchant[merchant_id];
				pns.splice($.inArray(pn,pns),1);
				pn_merchant[merchant_id] = pns;
				if(pn_merchant[merchant_id].length == 0) delete pn_merchant[merchant_id];
				if(pn_merchant[cur_merchant]){
					pn_merchant[cur_merchant].push(pn);
				} else {
					pn_merchant[cur_merchant]=[pn];
				}
				$('.mhs-list').html('');
				com.update_pn(pn,cur_merchant,pid);//修改PN对应的选中商户和商品ID
				render_pns();
			} else {
				//选中项移至首行
				var ctr = $(this).parent().parent();
				$(this).parent().parent().parent().find('tr.first').after(ctr);
				com.update_pn(pn,cur_merchant,pid);//修改PN对应的选中商户和商品ID
			}
			submit_product(pn, pid);//提交选中产品ID
			update_price(cur_merchant);//修改商户的显示订单金额
			update_order_total();//修改总的订单信息
			$('#order_rule').val('-1');//所有手动修改都重置比价规则到不使用规则
		});
		//创建订单
		$('.btn-price-complete').click(function(){
			var param = {};
			// $.each(com.pn, function(i, pn){
			// 	var pid = com.pn_product[pn];
			// 	var quantity = com.pn_quantity[pn];
			// 	param[pid] = quantity;
			// });
			// if($('#input_merchant').length > 0){
			// 	param['merchantId'] = $('#input_merchant').val();
			// }
			get_bill();
			param['billId'] = bill.id;
			$.ajax({
				'url':'/order',
				'data': param,
				'method':'POST',
				'success':function(data){
					if(data.success){
						$.msgBox(data.message);
						// $.jump('/order/purchase');
					} else {
						$.msgBox(data.message, 'warning');
					}
				}
			});
		});
	});
	//更换供应商
	//存在商户时,商户自动填充
	if(('#merchant_typehead').length > 0){
		$('#input_merchant').change(function(){
			// var content = '<div id="confirm-level" style="display: block;"><div class="box-header with-border"><span class="box-title">是否保存当前报价单并创建新的报价单</span><div class="box-tools pull-right"><button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button></div></div><div class="box-body"><div class="footer-btn"><button type="submit" class="btn btn-info btn-confirm">是</button><button type="submit" class="btn btn-default pull-right btn-cancel">否</button></div></div></div>';
			// $.doModule({"id":"confirm-level",  "width":"330", "height":"120","content":content, "level":"success"},function(module){
			// 			module.find('.btn-info').click(function(e){
			// 				e.preventDefault();
			// 				$.ajax({
			// 					//修改6
			// 					url:'/price/merchant/bill',
			// 					method:'PUT',
			// 					success:function(data){
			// 						if(data.success){
			// 							$.msgBox(data.message);
			// 							$('.mhs-list').html('');
			// 							$.jump(window.location.href);
			// 						} else {
			// 							$.msgBox(data.message, "warning");
			// 						}
			// 					}
			// 				})
			// 			});
			// 			module.find('.btn-default').click(function(e){
			// 				e.preventDefault();
			// 				$.ajax({
			// 					//修改5
			// 					url: '/price/merchant/bill',
			// 					method:'DELETE',
			// 					success:function(data){
			// 						if(data.success){
			// 							$.msgBox(data.message);
			// 							$('.mhs-list').html('');
			// 							com = new Comparison();
			// 							update_order_total();
			// 						} else {
			// 							$.msgBox(data.message, "warning");
			// 						}
			// 					}
			// 				})
			// 			});

			// })
			if($('#input_merchant').val() != '-1'){
				if(com['pn'].length > 0){
					$.each(com['pn'], function(i, pn){
						var param = {};
						var quantity = com['pn_quantity'][pn];
						var merchant = $('#input_merchant').val();
						//修改
						var url = $('#input_merchant').length > 0 ? '/price/merchant' : '/compare/price';
						var accurate = $('.search .icheckbox_flat-blue').hasClass("checked");
						param['merchantId'] = merchant;
						if (accurate) param['accurate'] = 'accurate';
						param['quantity'] = quantity;
						param['code'] = pn;
						//修改7
						create_table(pn, url, merchant,quantity,param);
					})
				}
			}
			$.ajax({
				url:'/price/merchant/bill',
				method:'GET',
				success:function(data){
					if($.isArray(data.data)){
						var name = $('option[value = "'+ data.data[0].customer.id +'"]').text();
						var content = '<div id="confirm-level" style="display: block;"><div class="box-header with-border"><span class="box-title">是否保存'+ name +'报价单</span><div class="box-tools pull-right"><button type="button" class="btn btn-box-tool" data-widget="remove"><i class="fa fa-times"></i></button></div></div><div class="box-body"><div class="footer-btn"><button type="submit" class="btn btn-info btn-confirm">是</button><button type="submit" class="btn btn-default pull-right btn-cancel">否</button></div></div></div>';
						$.doModule({"id":"confirm-level",  "width":"330", "height":"120","content":content, "level":"success"},function(module){
							module.find('.btn-info').click(function(e){
								e.preventDefault();
								$.ajax({
									//修改6
									url:'/price/merchant/bill',
									method:'PUT',
									success:function(data){
										if(data.success){
											$.msgBox(data.message);
											$('.mhs-list').html('');
											$.jump(window.location.href);
										} else {
											$.msgBox(data.message, "warning");
										}
									}
								})
							});
							module.find('.btn-default').click(function(e){
								e.preventDefault();
								$.ajax({
									//修改5
									url: '/price/merchant/bill',
									method:'DELETE',
									success:function(data){
										if(data.success){
											$.msgBox(data.message);
											$('.mhs-list').html('');
											$.jump(window.location.href);
											// com = new Comparison();
											// update_order_total();
										} else {
											$.msgBox(data.message, "warning");
										}
									}
								})
							});
						})
					}
				}
			})
		});
	}
	//询价 批量询价
	$('#upload_pns').load(function(){
		if($('form.upload-file', $('#upload_pns').contents()).length == 0){
			$('#upload_pns').addClass('hidden');
			var resp = $('body', $('#upload_pns').contents()).text();
			if(resp != '') {
				var json = eval("(" + resp + ")");
				if(json.success){
					var data = json.data;
					$.each(data, function(i, d){
						for(var k in d){
							var param = {};
							var pn = k;
							var quantity = d[k];
							var merchant_id = $('#input_merchant').val();
							//路径修改
							var url = $('#input_merchant').length > 0 ? '/price/merchant':'/compare/price';
							var accurate = $('.search .icheckbox_flat-blue').hasClass("checked");
							if (accurate) param['accurate'] = 'accurate';
							param['quantity'] = quantity;
							param['code'] = pn;
							param['merchant_id'] = merchant_id;
							create_table(pn, url, merchant_id,quantity,param);
						}
					});
				}
			}
			var src = $('#upload_pns').attr('src');
			$('#upload_pns').attr('src', src);
		} else {
			$('#upload_pns').removeClass('hidden');
		}
		update_order_total();
	});
	//重置比价单
	$('.btn-price-reset').click(function(){
		$.confirmBox('重置比价单', 'price-reset', function(){
			$.ajax({
				//修改5
				url: $('#input_merchant').length > 0 ? '/price/merchant/bill':'/price/bill',
				method:'DELETE',
				success:function(data){
					if(data.success){
						$.msgBox(data.message);
						$('.mhs-list').html('');
						com = new Comparison();
						update_order_total();
						$.jump(window.location.href);
					} else {
						$.msgBox(data.message, "warning");
					}
				}
			})
		});
	});
	//保存比价单
	$('.btn-price-save').click(function(){
		$.ajax({
			//修改6
			url:$('#input_merchant').length > 0 ? '/price/merchant/bill':'/price/bill',
			method:'PUT',
			success:function(data){
				if(data.success){
					$.msgBox(data.message);
					$('.mhs-list').html('');
					$.jump(window.location.href);
				} else {
					$.msgBox(data.message, "warning");
				}
			}
		})
	});
	//导出到询价
	$('.btn-price-inquery').click(function(){
		var pns = [];
		$('.pds-list .pn-check-box').each(function(){
			var index = 0;
			if($(this).find('i.fa-check-circle').length > 0){
				var pn = $(this).find('i.fa-check-circle').parent().attr('pn');
				pns.push(pn);
			}
		});
		if(pns.length == 0){
			$.msgBox("请选择询价的配件编号", "warning");
			return false;
		}
		var param = {};
		var index = 0;
		$.each(pns, function(i, pn){
			var quantity = com.pn_quantity[pn];
			param['codes[' + index + '].code'] = pn;
			param['codes[' + index + '].quantity'] = quantity;
			index ++;
		});
		if(JSON.stringify(param) == "{}"){
			$.msgBox("请选择询价的配件编号", "warning");
			return false;
		}
		$.ajax({
			url:"/price/inquire/bill",
			method:"GET",
			success:function(data){
				var data = data.data;
				if(data.length == 0){
					$.ajax({
						url: ($('#input_merchant').length > 0 ? '/price/quoteToInquire/':'/price/compareToInquire/') + bill.id,
						data:param,
						method:"POST",
						success:function(data){
							if(data.success){
								// module.find('.btn-box-tool').trigger('click');
								$.msgBox(data.message);
								$.jump('/price/createInquire');
							} else {
								$.msgBox(data.message, "warning");
							}
						}
					})
				}else{
					var content ='<form class="form-horizontal">' +
						'<p>是否移除当前询价单并创建新的询价单</p>' +
					'<button type="submit" class="btn btn-info">是</button>' +
					'<button type="submit" class="btn btn-default pull-right">否</button>' +
					'</form>';
					$.doModule({"id":"confirm-selecter", "width":"200", "height":"150", "content":content, "level":"success"},function(module){
						module.find('.btn-info').click(function(e){
							e.preventDefault();
							$.ajax({
								url:'/price/inquire/bill',
								method:'DELETE',
								success:function(data){
									if(data.success){
										$.ajax({
											url:($('#input_merchant').length > 0 ? '/price/quoteToInquire/':'/price/compareToInquire/') + bill.id,
											data:param,
											method:"POST",
											success:function(data){
												if(data.success){
													// module.find('.btn-box-tool').trigger('click');
													$.msgBox(data.message);
													$.jump('/price/createInquire');
												} else {
													$.msgBox(data.message, "warning");
												}
											}
										})
									}
								}
							})
						});
						module.find('.btn-default').click(function(e){
							e.preventDefault();
							$.ajax({
								url:"/price/createInquire",
								method:"POST",
								success:function(data){
									if(data.success){
										// module.find('.btn-box-tool').trigger('click');
										$.ajax({
											url:($('#input_merchant').length > 0 ? '/price/quoteToInquire/':'/price/compareToInquire/') + bill.id,
											data:param,
											method:"POST",
											success:function(data){
												if(data.success){
													// module.find('.btn-box-tool').trigger('click');
													$.msgBox(data.message);
													$.jump('/price/createInquire');
												} else {
													$.msgBox(data.message, "warning");
												}
											}
										})
									} else {
										$.msgBox(data.message, "warning");
									}
								}
							})
						});
					})

				}
			}
		})

		// $.ajax({
		// 	url:"/price/compareToInquire/" + bill.id,
		// 	data:param,
		// 	method:"POST",
		// 	success:function(data){
		// 		if(data.success){
		// 			// module.find('.btn-box-tool').trigger('click');
		// 			$.jump('/')
		// 			$.msgBox(data.message);
		// 		} else {
		// 			$.msgBox(data.message, "warning");
		// 		}
		// 	}
		// });
		// var content ='<form class="form-horizontal">' +
		//   '<div class="box-body">' +
		//     '<div class="form-group">' +
		//       '<label for="start_time" class="col-sm-4 control-label">开始时间</label>' +
		//       '<div class="col-sm-8">' +
		//         '<input class="form-control" id="start_time">' +
		//       '</div>' +
		//     '</div>' +
		//     '<div class="form-group">' +
		//       '<label for="start_time" class="col-sm-4 control-label">结束时间</label>' +
		//       '<div class="col-sm-8">' +
		//         '<input class="form-control" id="end_time">' +
		//       '</div>' +
		//     '</div>' +
		//   '</div>' +
		//   '<div class="box-footer time-footer">'+
		//   '<button type="submit" class="btn btn-info">确定</button>' +
		//   '<button type="submit" class="btn btn-default pull-right">取消</button>' +
		//   '</div>' +
		// '</form>';
		// $.doModule({"id":"time-selecter", "width":"350", "height":"250", "title":"询价起止时间", "content":content, "level":"success"}, function(module){
		// 	module.find('#start_time').datepicker({
		// 		dateFormat: 'yy-mm-dd hh-MM',
		// 		onSelect: function(dateText, inst) {
		// 			$(this).removeClass('error-border');
		// 			var star = (new Date(dateText).getTime())/1000;
		// 			$(this).attr('time', star);
		// 			var end = module.find('#end_time').attr('time');
		// 			$(this).removeClass('error-border');
		// 			$(this).parent().removeClass('has-error').find('.help-block').remove();
		// 			var d = (new Date().getTime())/1000;
		// 			if(end < d){
		// 				$(this).addClass('error-border');
		// 				$(this).parent().addClass('has-error').append('<span class="help-block">结束时间需大于当前时间</span>');
		// 			}
		// 			if(end && end < star){
		// 				$(this).addClass('error-border');
		// 				$(this).parent().addClass('has-error').append('<span class="help-block">开始时间需小于结束时间</span>');
		// 			}
		// 		}
		// 	});
		// 	module.find('#end_time').datepicker({
		// 		dateFormat: 'yy-mm-dd hh-MM',
		// 		onSelect: function(dateText, inst) {
		// 			$(this).removeClass('error-border');
		// 			var end = (new Date(dateText).getTime())/1000;
		// 			$(this).attr('time', end);
		// 			var star = module.find('#start_time').attr('time');
		// 			$(this).removeClass('error-border');
		// 			$(this).parent().removeClass('has-error').find('.help-block').remove();
		// 			if(end && end < star){
		// 				$(this).addClass('error-border');
		// 				$(this).parent().addClass('has-error').append('<span class="help-block">结束时间需大于开始时间</span>');
		// 			}
		// 		}
		// 	});
		// 	module.find('.btn-info').click(function(e){
		// 		e.preventDefault();
		// 		module.find('form').trigger('submit');
		// 	});
		// 	module.find('.btn-default').click(function(e){
		// 		e.preventDefault();
		// 		module.find('.btn-box-tool').trigger('click');
		// 	});
		// 	module.find('form').submit(function(){
		// 		//被选中的pn
		// 		var param = {};
		// 		var index = 0;
		// 		$.each(pns, function(i, pn){
		// 			var quantity = com.pn_quantity[pn];
		// 			param['codes[' + index + '].code'] = pn;
		// 			param['codes[' + index + '].quantity'] = quantity;
		// 			index ++;
		// 		});
		// 		if(JSON.stringify(param) == "{}"){
		// 			$.msgBox("请选择询价的配件编号", "warning");
		// 			return false;
		// 		}
		// 		var star = module.find('#start_time').attr('time');
		// 		var end = module.find('#end_time').attr('time');
		// 		module.find('#start_time, #end_time').removeClass('error-border');
		// 		module.find('#start_time, #end_time').parent().removeClass('has-error').find('.help-block').remove();
		// 		if(!star || star == '') {
		// 			module.find('#start_time').addClass('error-border');
		// 			module.find('#start_time').parent().addClass('has-error').append('<span class="help-block">开始时间不能为空</span>');
		// 			return false;
		// 		}
		// 		if(!end || end == ''){
		// 			module.find('#end_time').addClass('error-border');
		// 			module.find('#end_time').parent().addClass('has-error').append('<span class="help-block">开始时间不能为空</span>');
		// 			return false;
		// 		}
		// 		if(star > end){
		// 			module.find('#end_time').addClass('error-border');
		// 			module.find('#end_time').parent().addClass('has-error').append('<span class="help-block">结束时间要大于开始时间</span>');
		// 			return false;
		// 		}
		// 		var d = (new Date().getTime())/1000;
		// 		if(end < d){
		// 			$(this).addClass('error-border');
		// 			$(this).parent().addClass('has-error').append('<span class="help-block">结束时间需大于当前时间</span>');
		// 			return false;
		// 		}
		// 		param['startTime'] = star;
		// 		param['endTime'] = end;
		// 		$.ajax({
		// 			url:"/price/compareToInquire/" + bill.id,
		// 			data:param,
		// 			method:"POST",
		// 			success:function(data){
		// 				if(data.success){
		// 					module.find('.btn-box-tool').trigger('click');
		// 					$.msgBox(data.message);
		// 				} else {
		// 					$.msgBox(data.message, "warning");
		// 				}
		// 			}
		// 		});
		// 		return false;
		// 	})
		// });
	});
	//全部选中
	$('.select_all').click(function(){
		if($(this).find('i').hasClass('fa-circle-o')){
			$(this).find("i").removeClass('fa-circle-o').addClass('fa-check-circle-o');
			//没有商品的pn选中
			$('.pds-list .pn-check-box').each(function(){
				var pn = $(this).attr("pn");
				if($('#table_' + pn).find('tr input[type="radio"]').length == 0){
					$(this).find('i').removeClass('fa-circle-o').addClass('fa-check-circle');
				}
			});
		} else if($(this).find('i').hasClass('fa-check-circle-o')){
			$(this).find("i").removeClass('fa-check-circle-o').addClass('fa-check-circle');
			//所有的
			$('.pds-list .pn-check-box i').each(function(){
				$(this).removeClass('fa-circle-o').addClass('fa-check-circle');
			})
		} else {
			$(this).find("i").removeClass('fa-check-circle').addClass('fa-circle-o');
			$('.pds-list .pn-check-box i').each(function(){
				$(this).removeClass('fa-check-circle').addClass('fa-circle-o');
			})
		}
	});
});
//比价对象
// 选中产品ID
//修改2
function submit_product(code, pid){
	var param = {};
	param['code'] = code;
	param['id'] = pid;
	$.ajax({
		'url':($('#input_merchant').length > 0 ? '/price/merchant':'/compare/price' ),
		'method':'PUT',
		'data': param
	});
}
//删除PN
function pn_delete(code){
	var param = {};
	param['code'] = code;
	$.ajax({
		url: ($('#input_merchant').length > 0 ? '/delete/price/merchant':'/delete/price'),
		method:'POST',
		data: param,
		success:function(data){
			if(data.success){
				update_order_total();
			}
		}
	});
}
/***
 * 比较对象
 * @returns
 */
function Comparison(){
	this.pn = [];//比价页面所有的配件编号
	this.pn_product = {}; //比较页面所有的商品，key为配件编号
	this.pn_quantity = {};//每个配件编号对应的选中产品的ID
	this.pn_merchant = {};//每个配件编号对应的选中产品的供应商
	this.pn_data = {};//比价页面所有的商品数据，按PN分组
	this.merchant_shipping = {}; //当前页面所有的商户运费
	this._sups = [];//当前页面内所有的supplier，只在比价规则计算时使用;
	this.selected_data = {}; //比价页面筛选出的商品数据，按PN分组
	this.merchant_mini = {};//删除的supplierId

	/**
	 * 添加配件编号
	 */
	this.add_pn = function(pn, quantity, product){
		var pos = $.inArray(pn, this.pn);
		if(pos == -1) {
			this.pn.push(pn);
		}
		this.pn_quantity[pn]=quantity;
		if(product){
			this.pn_product[pn]=product;
			//提交选中产品ID
			submit_product(code, pid);
		}
	}
	/**
	 * 删除配件编号
	 */
	this.delete_pn = function(pn, quantity){
		var pos = $.inArray(pn, this.pn);
		if( pos >= 0){
			this.pn.splice(pos, 1);
			delete this.pn_quantity[pn];
			delete this.pn_product[pn];
			delete this.pn_merchant[pn];
			delete this.pn_data[pn];
		}
		pn_delete(pn);
	}
	/**
	 * 修改配件编号
	 */
	this.update_pn = function(pn, merchant, product){
		var pos = $.inArray(pn, this.pn);
		if(pos >= 0) {
			if(product){
				this.pn_product[pn]=product;
			}
			if(merchant) this.pn_merchant[pn] = merchant;
		}
	}
	/**
	 * 添加PN数据
	 */
	this.add_pn_data = function(pn, data){
		var pos = $.inArray(pn, this.pn);
		if(pos >= 0) {
			if(data.length > 0) this.pn_data[pn]=data;
		}
	}
	/**
	 * 添加商户运费
	 */
	this.add_merchant_shipping = function(merchant, cost){
		this.merchant_shipping[merchant] = cost;
	}
	/**
	 * 产品总价
	 */
	this.cost = function(){
		var cost = 0;
		var _this = this;
		$.each(_this.pn, function(i,pn){
			var pid = _this.pn_product[pn];
			var price = 0;
			$.each(_this.pn_data[pn], function(j, d){
				if(d.id == pid) price = d.price;
			});
			var quantity = _this.pn_quantity[pn];
			if(quantity && price)	cost += price * quantity;
		});
		return cost;
	}
	/**
	 * 产品总运费
	 */
	this.shipping_cost = function(){
		var shipping_cost = 0;
		var _suppliers = [];
		var _this = this;
		$.each(_this.pn, function(i, pn){
			var supplier = parseInt(_this.pn_merchant[pn]);
			if($.inArray(supplier, _suppliers) == -1){
				_suppliers.push(supplier);
			}
		});
		$.each(_suppliers, function(i, s){
			shipping_cost += (_this.merchant_shipping[s] ? parseFloat(_this.merchant_shipping[s]) : 0);
		})
		return shipping_cost;
	}

	/**
	 * 总价最小(不考虑运费)
	 */
	this.mini_cost = function(){
		var _this = this;
		$.each(_this.pn, function(i, pn){
			var pds = _this.selected_data[pn];
			if(pds && pds.length > 0){
				pds = pds.sort(function(a, b){ //每个PN数据从小到大排序
					return a.price - b.price;
				});
				var pid = pds[0].id;
				var merchant = pds[0].merchant.id;
				_this.update_pn(pn, merchant, pid);
			}
		});
	}
	/**
	 * 总价最小(考虑运费)
	 */
	this.mini_cost_shipping = function(){
		var _this = this;
		_this.mini_cost();
		var base = _this.cost() + _this.shipping_cost();
		_this._sups = [];
		//去掉一个供应商
		$.each(_this.pn, function(i, pn){
			var supplier = parseInt(_this.pn_merchant[pn]);
			if($.inArray(supplier, _this._sups) == -1){
				_this._sups.push(supplier);
			}
		});
		_this.adjust(base, 0);
	}
	//当组合价低于基准价时，发生替换
	this.adjust = function(base, index){
		var _this = this;
		if(_this._sups.length == 1){
			return true;
		}
		var _merchant = _this._sups.splice(index,1)[0];
		var origin_selected = {};
		var origin_merchant = {};
		$.each(_this.pn, function(i, pn){
			var pds = _this.selected_data[pn];
			var price = false;
			origin_selected[pn] = _this.pn_product[pn];
			origin_merchant[pn] = _this.pn_merchant[pn];
			$.each(pds, function(j, d){
				if($.inArray(d.merchant.id, _this._sups) >= 0){
					if(price){
						if(price > d.price){
							price = d.price;
							var pid  = d.id;
							var mid = d.merchant.id;
							_this.update_pn(pn, mid, pid);
						}
					} else {
						price = d.price;
						var pid  = d.id;
						var mid = d.merchant.id;
						_this.update_pn(pn, mid, pid);
					}
				}
			});
		});
		var total = _this.cost() + _this.shipping_cost();
		if(total < base){
			if(!this.merchant_mini['total']){
				this.merchant_mini['merchant'] = _merchant;
				this.merchant_mini['total'] = total;
			} else {
				if(total < this.merchant_mini['total']){
					this.merchant_mini['merchant'] = _merchant;
					this.merchant_mini['total'] = total;
				}
			}
			base = total;
		} else {
			$.each(_this.pn, function(i, pn){
				_this.update_pn(pn, origin_merchant[pn], origin_selected[pn]);//回退pn
			});
		}
		_this._sups.splice(index, 0, _merchant);//supplier 添加回
		//无更小的组合时，退出
		if(JSON.stringify(thibtns.merchant_mini) == '{}'){
			return true;btn
		}
		if(index == _this._sups.length -1){
			var _mini_merchant = this.merchant_mini['merchant'];
			var _base = this.merchant_mini['total'];
			this.merchant_mini ={};
			//删除_mini_merchant
			_this._sups.splice($.inArray(_mini_merchant, _this._sups), 1);
			index = 0;
			_this.adjust.call(_this, _base, 0);
		} else {
			_this.adjust.call(_this, base, index + 1);
		}
	}
}