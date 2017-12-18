
$(document).ready(function(){
	$('#sales_table').dataTable({
		searching: false,
		paging: false,
		ordering: false,
		info: false,
		select: 'single',
		ajax: {
			url : '/order/sales/'
		},
		columnDefs: [{
			targets: '_all',
			defaultContent: ''
		}, {
			targets: 0,
			data: 'null'
		},{
			targets: 1,
			data: 'id'
		},{
			targets: 2,
			data: 'null'
		},{
			targets: 3,
			data: 'null'
		},{
			targets: 4,
			data: 'null'
		},{
			targets: 5,
			data: 'null'
		}, {
			targets: 6,
			data: 'quantity'
		}, {
			targets: 7,
			data: function(data){
				return $.formatPrice(data.amount);
			},
		}, {
			targets: 8,
			data: function(data){
				return $.timestampToDate(data.createdTime);
			}
		}, {
			targets: 9,
			data: 'null',
		}]
	}).on('draw.dt', function(e, settings) {
		var table = $(this).DataTable();
		$.renderName(table, 'merchant', 'merchant.id', [{'col':5, 'name': 'name'}]);
		$.each(table.rows().indexes(), function(i, idx) {
			table.cell(i,0).nodes().to$().html('<i class="fa fa-fw fa-plus-square btn-details" ></i>');
			var row = table.row(idx);
			$(row.node()).data('row-index', idx).click(function() {
				var idx = $(this).data('row-index');
				var row = table.row(idx);
				if (row.child() == undefined)
					appendChild(row, '/order/sales/' + row.data().id); //$(row.data())[0].id );
				else if (row.child.isShown())
					row.child.hide();
				else
					row.child.show();
			});
		});
	});

	function appendChild(row, baseUrl) {
		var record = row.data();
		$.get( baseUrl , function(json) {
			if (!$.isArray(json.data))
				return;
			var children = {};
			var trs = {};
			var markers = {};
			var sed = {};
			$.each(json.data, function(i, child) {
				// var orderNo = child['order']['code'];
				var supplierId = child['supplier']['id'];
				var supplyingId = child['supplying']['id'];
				var partsId = child['parts']['id'];
				var productCode = child['productCode'];
				var tr2 = $('<tr />').prop('id', 'tr-2-' + supplierId).addClass('tr-lvl-2').addClass(supplyingId);
				$('<td />').appendTo(tr2);
				$('<td />').appendTo(tr2);
				$('<td />').appendTo(tr2);
				$('<td />').appendTo(tr2);
				$('<td />').appendTo(tr2);
				$('<td />').appendTo(tr2);
				$('<td />').text(child['quantity']).appendTo(tr2);
				$('<td />').text($.formatPrice(child['price'])).appendTo(tr2);
				$('<td />').text($.timestampToDate(child['createdTime'])).appendTo(tr2);
				$('<td />').text(child['status']).appendTo(tr2);
				if (sed[supplierId] == undefined){
					sed[supplierId] = {};
					if(sed[supplierId]['data'] == undefined)sed[supplierId]['data'] = [];
					if(sed[supplierId]['price'] == undefined)sed[supplierId]['price'] = 0;
					if(sed[supplierId]['quantity'] == undefined)sed[supplierId]['quantity'] = 0;
					sed[supplierId]['price'] = child['price'] * child['quantity'] ;
					sed[supplierId]['quantity'] = child['quantity'] ;
					sed[supplierId]['data'].push(tr2);
				}else {
					sed[supplierId]['data'].push(tr2);
					sed[supplierId]['price'] += child['price'] * child['quantity'] ;
					sed[supplierId]['quantity'] += child['quantity'] ;
				}
				markers[supplierId] = true;
				$.ajax({
					url: '/parts/' + partsId,
					type: 'GET',
					context: tr2,
					success: function(json){
						$(this).find('td').eq(3).text(json['data'][0].code);
						$(this).find('td').eq(4).text(json['data'][0]['brand']['name']);
						// $(this).find('td').eq(5).text(json['data'][0]['tags']['1000']);
						var kind = json['data'][0]['tags']['1008'];
						$.ajax({
							url: '/field/category',
							type: 'GET',
							context: tr2,
							success: function(json){
								var that = this;
								$.each(json,function(i,val){
									if(val['id'] == kind){
										// $(that).find('td').eq(6).html(val['name']);
									}
								})
							}
						})
					}
				})
				$.ajax({
					url: '/product/' + supplyingId,
					type: 'GET',
					context: tr2,
					success: function(json){
						$(this).find('td').eq(2).text(json['data'][0]['product']['name']);
						$(this).find('td').eq(1).text(productCode);
					}
				})
				/*
				$.ajax({
					url: '/parts/'+partsId,
					context: tr2.done(function(){
						
					})
				})
				$.ajax({
					url: '/parts/'+partsId,
					context: tr2.done(function(){
						
					})
				})
				*/
			});
			$.each(sed, function(supplierId, children) {
				$.get('/data/merchant/' + supplierId, function(json) {
					//TODO
					var tr3 = $('<tr />').prop('id','tr-3-' + supplierId ).addClass('tr-lvl-3');
					tr3.append('<td colspan="3">'+ json.name +'</td>'
								+ '<td colspan="3"></td>'
								+ '<td>'+ sed[supplierId]['quantity'] +'</td>'
								+ '<td>'+ $.formatPrice(sed[supplierId]['price']) +'</td>'
								+ '<td colspan="2"></td>');
					sed[supplierId]['data'].unshift(tr3);
					delete markers[supplierId];
					if ($.isEmptyObject(markers)) {
						tra = [];
						$.each(sed, function(i, arr) {
							tra.push(arr['data']);
						});
						row.child(tra).show();
					}
				});
			});
		});
	}

	// $('#sales_table').on('click','.btn-confirm',function(){
	// 	var param = $(this).attr('value');
	// 	$.ajax({
	// 		"url":"/order/sales/" + param,
	// 		"method":"POST",
	// 		"success":function(data){
	// 			if(data.success){
	// 				$.jump(window.location.href);
	// 			}else{
	// 				$.msgBox(data.message,'warning');
	// 			}
	// 		}
	// 	})
	// })

})
