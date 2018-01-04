$(document).ready(function(){
	function initPrice(price){
		return price + '¥';
	}
	var columns = [{
			title: '商品编号',
			data: 'product.code'
		},{
			title: '商品名称',
			data: 'product.name'
		},{
			title: '配件编号',
			data: 'product.parts.code'
		},{
			title: '配件名称',
			data: 'product.parts.name'
		},{
			title: '数量',
			data: 'quantity'
		},{
			title: '单价',
			data: 'price',
			render: function(data, type, row, meta){
				var input  = '<input type="text" name="price" value="'+initPrice(data)+'" />';
				// return initPrice(data);
				return input;
			}
		}];
	var data = {
		"data":[{
		"product": {
			"code": "ABC1000",
			"name": "前挡风镜",
			"parts": {
				"code": "ABC1000",
				"name": "前挡风镜"
			}
		},
		"price": "99",
		"quantity": 10
		},{
			"product": {
				"code": "ABC1001",
				"name": "后挡风镜",
				"parts": {
					"code": "ABC1001",
					"name": "后挡风镜"
				}
			},
			"price": "80",
			"quantity": 5
		},{
			"product": {
				"code": "ABC1002",
				"name": "大灯",
				"parts": {
					"code": "ABC1002",
					"name": "大灯"
				}
			},
			"price": "50",
			"quantity": 2
		}]
	}
	var table = $('.myTable').DataTable({
		info: false,
		paging: false,
		searching: false,
		scrollY: '50vh',
		scrollX: true,
		scrollCollapse: true,
		// ajax: {
		// 	url: '../json/products.json'
		// },
		language: {
			emptyTable: '无数据'
		},
		// data: data.data,
		columnDefs: [{
			targets: [0, 2],
			orderable: true
		},{
			targets: '_all',
			title: '',
			defaultContent: '',
			orderable: false
		}],
		columns:columns,
		initComplete: function(){
			var table = $(this).DataTable();
			table.rows.add(data.data);
			setTimeout(function(){
				table.draw();
			})
			// table.draw();
		}
	}).on('draw.dt',function(){
		var rows = $(this).DataTable().rows().data();
		var counts = 0,
			allPrice = 0;
		$.each(rows,function(){
			counts += this.quantity;
			allPrice += parseFloat(this.price);
		});
		$('.allPrice').text(allPrice + '¥');
		$('.counts').text(counts);
	});
	$('.btn-submit').click(function(){
		var api = table;
		$.each(api.rows().indexes(),function(r){
			var row = api.row(r);
			$.each(api.columns().indexes(),function(c){
				var cell = api.cell(r, c);

			})
		});
		var rows = api.rows().data();
		var fields = {
			'upload': []
		};
		$.each(rows,function(k,v){data
			fields['upload'].push(this);
		});
		fields = $.expandObject(fields);
		console.log(fields);

		$.each(api.$('input,select'),function(){
			var field = $(this).serializeArray()[0];
			//{price: '',value: ''};
		});
	});


	var headerSpan = $('header span');
	// headerSpan.on('taphold',function(){
	// 	console.log('success');rows
	// });
	// headerSpan.on('tap',function(){
	// 	console.log('taped');
	// });
});

$.expandObject = function(obj, ret, prefix, boolean) {
	ret = ret || {};
	prefix = prefix || '';
	$.each(obj, function(k, v) {
		if($.isPlainObject(v) && k == 'tags'){
			$.expandObject(v, ret, prefix + k + '.', true);
			return true;
		}
		// if(/^\d+/.test(k) || boolean == true)
		if(boolean == true)
			k = prefix.substr(0,prefix.length-1) + '[' + k + ']';
		else
			k = prefix + k;
		if ($.isPlainObject(v)) {
			$.expandObject(v, ret, k + '.');
		} else if ($.isArray(v)) {
			$.each(v, function(i, d) {
				$.expandObject(d, ret, k + '[' + i + '].');
			});
		} else if ($.trim(v) !== '' && v !== null){
			ret[k] = $.trim(v);
		}else {
			return;
		}
	});
	return ret;
}
