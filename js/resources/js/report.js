
$(function(){
	$('input[name = "start_time"]').datepicker({
		dateFormat: 'yy-mm-dd',
		onSelect: function(dateText, inst) {
			$(this).removeClass('error-border');
			var star = (new Date(dateText).getTime())/1000;
			$(this).attr('time', star);
			var end = $('input[name="end_time"]').attr('time');
			if(end && end < star){
				$(this).addClass('error-border');
				$.msgBox("开始时间需小于结束时间", "warning");
			}
		}
	});
	$('input[name = "end_time"]').datepicker({
		dateFormat: 'yy-mm-dd',
		onSelect: function(dateText, inst) {
			$(this).removeClass('error-border');
			var d = (new Date().getTime())/1000;
			var end = (new Date(dateText).getTime())/1000;
			// if(end < d){
			// 	$(this).addClass('error-border');
			// 	$.msgBox("结束时间需大于当前时间", "warning");
			// }
			var star = $('input[name="start_time"]').attr('time');
			if(star && end < star){
				$(this).addClass('error-border');
				$.msgBox("结束时间需大于开始时间", "warning");
			}
			$(this).attr('time', end);
		}
	});
	
	$('.box-body').on('click','.search-btn',function(){
		var startTime = $('input[name = "start_time"]').attr('time'),
			endTime = $('input[name = "end_time"]').attr('time');
		if(startTime == '' || endTime == '' ){
			$.msgBox("清选择时间段", "warning");
		}else{
			$('#report_table').dataTable({
				searching: false,
				paging: false,
				ordering: false,
				info: false,
				select: 'single',
				ajax: {
					url : '/report/merchant/polist/' + startTime + '/' + endTime
				},
				columnDefs: [{
					targets: '_all',
					defaultContent: ''
				},  {
					targets: 0,
					data: 'null'
				}, {
					targets: 1,
					data: 'null'
				}, {
					targets: 2,
					data: 'null'
				}, {
					targets: 3,
					data: 'null'
				}, {
					targets: 4,
					data: function(data){
						return $.formatPrice(data.amount);
					},
				}, {
					targets: 5,
					data: function(data){
						return $.formatPrice(data.saved);
					},
				}, {
					targets: 6,
					data: function(data){
						return $.formatPrice(data.potential);
					},
				}]
			}).on('draw.dt', function(e, settings) {
				
				var table = $(this).DataTable();
				$.renderName(table,'user','createdBy',[{'col':1, 'name': 'name'}]);
				// $.renderName(table,);
				$.each(table.rows().indexes(), function(i, idx) {
					var row = table.row(idx);
					table.cell(i,0).nodes().to$().html('<span class="glyphicon glyphicon-chevron-right" ></span>');
					$(row.node()).data('row-index', idx).click(function() {
						var idx = $(this).data('row-index');
						var row = table.row(idx);
						$(this).find('span').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-right');
						if (row.child() == undefined)
							appendChild(row, '/report/merchant/polist/' + startTime + '/' + endTime);
						else if (row.child.isShown()){
							row.child.hide();
							$(this).find('span').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-down');
						}else{
							row.child.show();
							$(this).find('span').addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-right');
						}
					});
				});
			});

			function appendChild(row, baseUrl) {
				var record = row.data();
				var userId = record['createdBy'];
				$.get(baseUrl + '/' + userId, function(json) {
					if (!$.isArray(json.data))
						return;
					var children = {};
					var trs = {};
					var markers = {};
					$.each(json.data, function(i, child) {
						// var orderNo = child['order']['code'];
						var orderNo = child['name'];
						var tr2 = $('<tr />').prop('id', 'tr-2-' + orderNo).addClass('tr-lvl-2');
						$('<td />').appendTo(tr2);
						$('<td />').text(orderNo).appendTo(tr2);
						$('<td />').appendTo(tr2);
						$('<td />').appendTo(tr2);
						$('<td />').text(child['amount']).appendTo(tr2);
						$('<td />').text(child['saved']).appendTo(tr2);
						$('<td />').text(child['potential']).appendTo(tr2);
						trs[orderNo] = tr2.get(0);
						children[orderNo] = [];
						markers[orderNo] = true;
					});
					$.each(trs, function(orderNo, tr) {
						$.get(baseUrl + '/' + userId + '/' + orderNo, function(json) {
							console.log(json);
							if (!$.isArray(json.data))
								return;
							$.each(json.data, function(i, child) {
								var tr3 = $('<tr />').addClass('tr-lvl-3');
								$('<td />').appendTo(tr3);
								$('<td />').text(child['orders'][0]['id']).appendTo(tr3);
								$('<td />').text($.timestampToDate(child['orders'][0]['createdTime'])).appendTo(tr3);
								$('<td />').text(child['orders'][0]['supplier']['name']).appendTo(tr3);
								$('<td />').text(child['orders'][0]['amount']).appendTo(tr3);
								$('<td />').text(child['orders'][0]['saved']).appendTo(tr3);
								$('<td />').text(child['orders'][0]['potential']).appendTo(tr3);
								children[orderNo].push(tr3.get(0));
							});
							delete markers[orderNo];
							if ($.isEmptyObject(markers)) {
								tra = [];
								$.each(trs, function(orderNo, tr) {
									tra.push(tr);
									$.each(children[orderNo], function(idx, child) {
										tra.push(child);
									});
								});
								row.child(tra).show();
							}
						});
					});
				});
			}
			// $('.table').on('click','.tr-lvl-2',function(){
			// 	$.get('/report/merchant/polist/'+ startTime + '/' + endTime + )
			// })
		}
	})

	//TODO get time range from search field
	// var start = Math.floor($.now() / 1000);
	// var end = start + 7 * 24 * 3600;


});


// $(document).ready(function(){
//     $('input[name = "start_time"]').datepicker({
//         dateFormat: 'yy-mm-dd',
//         onSelect: function(dateText, inst) {
//             $(this).removeClass('error-border');
//             var star = (new Date(dateText).getTime())/1000;
//             $(this).attr('time', star);
//             var end = $('input[name="end_time"]').attr('time');
//             if(end && end < star){
//                 $(this).addClass('error-border');
//                 $.msgBox("开始时间需小于结束时间", "warning");
//             }
//         }
//     });
//     $('input[name = "end_time"]').datepicker({
//         dateFormat: 'yy-mm-dd',
//         onSelect: function(dateText, inst) {
//             $(this).removeClass('error-border');
//             var d = (new Date().getTime())/1000;
//             var end = (new Date(dateText).getTime())/1000;
//             if(end < d){
//                 $(this).addClass('error-border');
//                 $.msgBox("结束时间需大于当前时间", "warning");
//             }
//             var star = $('input[name="start_time"]').attr('time');
//             if(star && end < star){
//                 $(this).addClass('error-border');
//                 $.msgBox("结束时间需大于开始时间", "warning");
//             }
//             $(this).attr('time', end);
//         }
//     });
    
//     $('.box-body').on('click','.search-btn',function(){
//         var startTime = $('input[name = "start_time"]').attr('time'),
//             endTime = $('input[name = "end_time"]').attr('time');
//         $.ajax({
//             url: '/report/merchant/polist/'+startTime + '/' +endTime,
//             method:'GET',
//             success:function(data){
//                 console.log(data);
//             }
//         })   
//     })
// })
