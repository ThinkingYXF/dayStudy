$(document).ready(function(){
	//商户列表
	var table = $('#join_table').DataTable({
		"ajax": {
			url:"/supply",
			headers:{
				"Accept":"application/json"
			}
		},
		"scrollCollapse": true,
		"rowId": 'id',
		"processing":true,
		"searching": true,
		"serverSide":true,
		"ordering": false,
		"paging": false,
		"language":language,
		"columnDefs": [
			{ 	//商户名
				"data": "null",
				"targets":0,
				"defaultContent":""
			},
			{ 	//商户电话
				"data": "null",
				"targets":1,
				"defaultContent":'',
			},
			{ 	//地址
				"data": "null",
				"targets":2,
				"defaultContent":'',
			},
			{ 	//创建时间
				"data": function(data){
					return $.timestampToDate(data.createdTime);
				},
				"targets":3,
				"defaultContent":""
			},
			{ 	//接收供货
				"data": function(data){
					var html = '';
					if((data.flag & STATES.LOCKED) > 0){
						html += '已锁定  ' + '<a class="supply-open" value="' + data.supplier.id + '">启用</a>';
					} else {
						html += '已启用  ' + '<a class="supply-close" value="' + data.supplier.id + '">锁定</a>';
					}
					return html;

				},
				"targets":4,
			},
			{ //策略
				"data": "null",
				"targets":5,
				"defaultContent":'',
			},
			{ //操作
				"data": function(data){
					return '<button class="btn btn-primary btn-sm btn-delete" value="' + data.supplier.id + '">删除</button>';
				},
				"targets":6,
			}
		],
		"info" : false
	} ).on('init.dt', function(e, settings, json) {
		
	}).on('draw.dt', function () {
		$.renderName(table, 'merchant', "supplier.id", [{"col":0, "name":"name"}, {"col":1, "name":"phone"}], function(row, data){
			data['district'] && $.renderCell(table, row, 2, 'district', data['district'], 'message');
		});
		//填充是否有策略
		merchant_strategy(table);
		//启用供货
		$('#join_table').on('click', '.supply-open', function(){
			var id = $(this).attr('value');
			$.confirmBox('启用','supply-open',function(){
				$.mask();
				$.ajax({
					"url":'supply/supplier/locked/' + id,
					"method":"DELETE",
					"success":function(data){
						$.msgBox(data.message);
						$.reloadData(table);
						$.hideMask();
					}
				});
			});
		});
		//锁定供货
		$('#join_table').on('click', '.supply-close', function(){
			var id = $(this).attr('value');
			$.confirmBox('锁定', 'supply-close', function(){
				$.mask();
				$.ajax({
					'url':'supply/supplier/locked/' + id,
					'method':'PUT',
					'success':function(data){
						$.msgBox(data.message);
						$.reloadData(table);
						$.hideMask();
					}
				});
			})
		});
		//删除商户
		$('#join_table').on('click', '.btn-delete', function(){
			var id = $(this).attr('value');
			$.confirmBox('删除商户', 'delete', function(){
				$.mask();
				$.ajax({
					'url':'/supply/' + id,
					'method':'DELETE',
					'success':function(data){
						$.msgBox(data.message);
						$.reloadData(table);
						$.hideMask();
					}
				});
			});
		});
	});
	
	//发出的申请
	var sent_table = $('#sent_apply_table').DataTable({
		"ajax": {
			url:'/supply/merchants',
			headers:{
				"Accept":"application/json"
			}
		},
		"scrollCollapse": true,
		"rowId": 'id',
		"processing":true,
		"searching": true,
		"serverSide":true,
		"ordering": false,
		"paging": false,
		"language":language,
		"columnDefs": [
			{ 	"data": "null",
				"targets":0,
				"defaultContent":""
			},
			{ 	"data": "null",
				"targets":1,
				"defaultContent":'',
			},
			{ 	"data": "null",
				"targets":2,
				"defaultContent":'',
			},
			{ 	"data": function(data){
					return $.timestampToDate(data.createdTime);
				},
				"targets":3,
				"defaultContent":""
			},
			{ 	"data": function(data){
					var opt_html = '<button class="btn btn-primary btn-sm btn-cancel" value="' + data.merchant.id + '">取消</button>';
					return opt_html;
				},
				"targets":4,
			}
		],
		"info" : false
	} ).on('init.dt', function(e, settings, json) {
		
	}).on('draw.dt', function () {
		$.renderName(sent_table, 'merchant', "merchant.id", [{"col":0, "name":"name"}, {"col":1, "name":"phone"}], function(row, data){
			data['district'] && $.renderCell(sent_table, row, 2, 'district', data['district'], 'message');
		});
		//发出的申请删除
		$('#sent_apply_table').on('click', '.btn-cancel', function(){
			var id = $(this).attr('value');
			$.confirmBox('取消', 'cancel', function(){
				$.mask();
				$.ajax({
					"url":'/supply/merchant/' + id,
					"method":"DELETE",
					"success":function(data){
						$.msgBox(data.message);
						$.reloadData(sent_table);
						$.hideMask();
					}
				});
			});
		});
	});
	
	//收到的申请
	var received_table = $('#received_apply_table').DataTable({
		"ajax": {
			url:'/supply/suppliers',
			headers:{
				"Accept":"application/json"
			}
		},
		"scrollCollapse": true,
		"rowId": 'id',
		"processing":true,
		"searching": true,
		"serverSide":true,
		"ordering": false,
		"paging": false,
		"language":language,
		"columnDefs": [
			{ 	"data": "null",
				"targets":0,
				"defaultContent":""
			},
			{ 	"data": "null",
				"targets":1,
				"defaultContent":'',
			},
			{ 	"data": "null",
				"targets":2,
				"defaultContent":'',
			},
			{ 	"data": function(data){
					return $.timestampToDate(data.createdTime);
				},
				"targets":3,
				"defaultContent":""
			},
			{ 	"data": function(data){
					var opt_html = '<button class="btn btn-primary btn-sm btn-accept" value="' + data.supplier.id + '">接收</button>'+
					'<button class="btn btn-primary btn-sm btn-reject" value="' + data.supplier.id + '">拒绝</button>';
					return opt_html;
				},
				"targets":4,
			}
		],
		"info" : false
	} ).on('init.dt', function(e, settings, json) {
		
	}).on('draw.dt', function () {
		$.renderName(received_table, 'merchant', "supplier.id", [{"col":0, "name":"name"}, {"col":1, "name":"phone"}], function(row, data){
			data['district'] && $.renderCell(received_table, row, 2, 'district', data['district'], 'message');//填地址
		});
		//接收申请
		$('#received_apply_table').on('click', '.btn-accept', function(){
			var id = $(this).attr('value');
			$.confirmBox('接收申请', 'accept', function(){
				$.mask();
				$.ajax({
					"url":'/supply/supplier/' + id,
					"method":"POST",
					"success":function(data){
						$.msgBox(data.message);
						$.reloadData(received_table);
						$.hideMask();
					}
				});
			});
		});
		//拒绝申请
		$('#received_apply_table').on('click', '.btn-reject', function(){
			var id = $(this).attr('value');
			$.confirmBox('拒绝申请', 'reject', function(){
				$.mask();
				$.ajax({
					"url":'/supply/supplier/' + id,
					"method":"DELETE",
					"success":function(data){
						$.msgBox(data.message);
						$.reloadData(received_table);
						$.hideMask();
					}
				});
			});
		});
	});
	
	$.autoCompleteMerchant();
	//发起申请
	$('.create-apply-form .btn-confirm').click(function(e){
		e.preventDefault();
		if($('#input_merchant').val() == ''){
			$('form.create-apply-form').find('#merchant_typehead').addClass('error-border');
			$.msgBox("请输入正确的商户", "warning");
			return false;
		}
		$.mask();
		var mid = $('#input_merchant').val();
		$.ajax({
			url:'/supply/merchant/' + mid,
			method:'POST',
			success:function(data){
				$.msgBox(data.message);
				$.reloadData(sent_table);
				$('#input_merchant').val('');
				$('#merchant_typehead').val('');
				$.hideMask();
			}
		})
	});
	
	//切换tab刷新数据
	$('.nav-tabs-custom li').click(function(){
		if($(this).attr("type") == "list"){
			$.reloadData(table);
		}
		if($(this).attr("type") == "apply"){
			$.reloadData(apply_table);
		}
	});
	
	function merchant_strategy(table){
		var td = table.data();
		$.each(td, function(i, val){
			(function(i, val){
				var supplier_id = val.supplier.id;
				if(supplier_id != ''){
				 $.get('/merchant/strategy/' + supplier_id, function(data){
					var html = '';
					if(data && data.success){
						html = '<a class="has-strategy" href="/merchant/strategy/merchantId/' + supplier_id + '">已启用</a>';
					} else {
						html = '<a class="no-strategy" href="/merchant/strategy/merchantId/' + supplier_id + '">未启用</a>';
					}
					table.cell(i, 5).nodes().to$().html(html);
				});
				}
			 })(i, val);
		});
	}
});