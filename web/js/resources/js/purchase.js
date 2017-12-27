
$(document).ready(function(){
	$('#purchase_table').dataTable({
		searching: false,
		paging: false,
		ordering: false,
		info: false,
		select: 'single',
		ajax: {
			url : '/order/purchase'
		},
		columnDefs: [{
			targets: '_all',
			defaultContent: ''
		}, {
			targets: 0,
			data: 'null'
		}, {
			targets: 1,
			data: 'name'
		}, {
			targets: 2,
			data: 'null'
		}, {
			targets: 3,
			data: 'null'
		}, {
			targets: 4,
			data: 'null'
		}, {
			targets: 5,
			data: 'quantity'
		}, {
			targets: 6,
			data: function(data){
				return $.formatPrice(data.amount);
			},
		}, {
			targets: 7,
			data: function(data){
				return $.timestampToDate(data.createdTime);
			}
		}, {
			targets: 8,
			data: 'null'
		}, {
			targets: 9,
			data: 'null',
		}]
	}).on('draw.dt', function(e, settings) {
		var table = $(this).DataTable();
		$.each(table.rows().indexes(), function(i, idx) {
			table.cell(i,0).nodes().to$().html('<i class="fa fa-fw fa-plus-square btn-details" ></i>');
			var row = table.row(idx);
			$(row.node()).data('row-index', idx).click(function() {
				var idx = $(this).data('row-index');
				var row = table.row(idx);
				if (row.child() == undefined){
					appendChild(row, '/order/purchase/batch/'+ row.data().name );
				}
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
			var markers = {},
				sup = {},
				product = {},
				parts = {},
				tags = {};
			$.each(json.data, function(i, child) {
				// var orderNo = child['order']['code'];
				var orderNo = child['id'];
				var name = child['supplier']['name'];
				var tr2 = $('<tr />').prop('id', 'tr-2-' + orderNo).addClass('tr-lvl-2');
				$('<td />').appendTo(tr2);
				$('<td />').text(name).appendTo(tr2);
				$('<td />').appendTo(tr2);
				$('<td />').appendTo(tr2);
				$('<td />').appendTo(tr2);
				$('<td />').text(child['quantity']).appendTo(tr2);
				$('<td />').text($.formatPrice(child['amount'])).appendTo(tr2);
				$('<td />').text($.timestampToDate(child['createdTime'])).appendTo(tr2);
				$('<td />').appendTo(tr2);
				$('<td />').appendTo(tr2);
				// if(child['status'] == "NEW")
				// 	$('<td />').html('<button class="btn btn-primary btn-sm btn-read" data-status="0" value="' + data.id + '">确认收货</button>');
				trs[orderNo] = tr2.get(0);
				children[orderNo] = [];
				markers[orderNo] = true;
				children[orderNo].push(tr2);
			});
			var pro = [];
			var taglist = [];
			$.each(trs, function(orderNo, tr) {
				$.get('/order/purchase/' + orderNo, function(json) {
					if (!$.isArray(json.data))
						return;
					$.each(json.data, function(i, child) {
						var orderId = child['order']['id'];
						var partsId = child['parts']['id'];
						var tr3 = $('<tr />').prop('id', 'tr-3-' + orderId).addClass('tr-lvl-3');
						$('<td />').appendTo(tr3);
						$('<td />').text(child['productCode']).appendTo(tr3);
						$('<td />').text(child['productName']).appendTo(tr3);
						$('<td />').appendTo(tr3);
						$('<td />').appendTo(tr3);
						$('<td />').text(child['quantity']).appendTo(tr3);
						$('<td />').text($.formatPrice(child['price'])).appendTo(tr3);
						$('<td />').text($.timestampToDate(child['createdTime'])).appendTo(tr3);
						$('<td />').appendTo(tr3);
						if(child['status'] == 'NEW')
							$('<td />').html('<button class="btn btn-primary btn-sm btn-confirm" data-status="0" value="'+ orderId+'">确认收货</button>').appendTo(tr3);
						else 
							$('<td />').html('<button class="btn btn-primary btn-sm btn-read" disabled="disabled" data-status="0" value="">已收货</button>').appendTo(tr3);

						$.ajax({
							url: '/parts/' + partsId,
							type: 'GET',
							context: tr3,
							success: function(json){
								$(this).find('td').eq(3).text(json['data'][0].code);
								$(this).find('td').eq(4).text(json['data'][0]['brand']['name']);
								
							}
						})
						children[orderNo].push(tr3);
					
					});
					delete markers[orderNo];
					if($.isEmptyObject(markers)){
						var tra = [];
						$.each(children,function(i,child){
							tra.push(child);
						});
						row.child(tra).show();
					}
					
				});
			});
		});
	}
	$('#purchase_table').on('click','.btn-confirm',function(){
		var param = $(this).attr('value');
		$.ajax({
			"url":"/order/sales/" + param,
			"method":"POST",
			"success":function(data){
				if(data.success){
					$.jump(window.location.href);
				}else{
					$.msgBox(data.message,'warning');
				}
			}
		})
	})
})
