function getData(callback){
	$.getJSON('../../server/nodeServer/data.json',function(json){
		if(callback && $.isFunction(callback))
			callback(json);
	});
}
var totalPrice = 0,
	totalQuantity = 0;
getData(function(data){
	$('.ui-page').hide();
	$.each(data.data,function(k){
		var product = this;
		var div = $('<div />').attr('data-role','page').addClass('paging').prop('id','page'+k);
		//header
		var header = '<div data-role="header" id="header">'+
						'<header>'+
							'<h3>微重力</h3>'+
							'<span>商户:中华科技有限公司(M1001)</span>'+
						'</header>'+
						'<h2></h2>'+
					'</div>'
		//content
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
			title: '价格',
			data: 'price'
		},{
			title: '数量',
			data: 'quantity'
		}];
		var content = $('<div />').addClass('content').append(table);
		$('<table />').addClass('myTable'+k).appendTo(content);
		//footer
		var footer = $('<div />').attr('data-role','footer');
		var selectDiv = $('<div />').addClass('ui-field-contain');
		var select = $('<select />').prop('id','filter-menu'+k).addClass('filterable-sleect').attr('data-native-menu',false);
		var button = $('<button />').text('提交');
		var number = 0;
		$.each(data.data,function(j){
			var option = $('<option />').val(number).text(this.product.code);
			number++;
			if(j == k)
				option.prop('selected',true);
			option.appendTo(select);
		});
		selectDiv.append(select).appendTo(footer);
		div.append(header).append(content).append(footer).append(button);
		$('body').append(div);
		var arr = [];
		arr.push(data.data[k]);
		var table = $('.myTable' + k).addClass('table able-bordered table-striped').css('width','100%').css('min-width','360px').DataTable({
			columnDefs: [{
				targets: '_all',
				data: null,
				defaultContent: '',
				className: 'text-nowrap'
			}],
			columns: columns,
			paging: false,
			searching: false,
			info: false,
			scrollX: true,
			scrollY: '60vh',
			scrollCollapse: true,
			// data: data.data,
			data: arr,
			initComplete: function(){
				$(this).DataTable().columns.adjust();
			}
		}).on('draw.dt',function(){
			$(this).DataTable().columns.adjust();
		});

		var fields = [{
			label: '商品编号',
			name: 'product.code'
		}, {
			label: '商品名称',
			name: 'product.name'
		}, {
			label: '配件编号',
			name: 'product.parts.code'
		}, {
			label: '价格',
			name: 'price'
		},{
			label: '数量',
			name: 'quantity'
		}];

		var editor = new $.fn.dataTable.Editor({
			table: '.myTable' + k,
			idSrc: 'id',
			fields: fields,
			ajax: {
				edit: {
					// url: 'http://192.168.1.118:8082/product',
					url: 'http://localhost:8082/product',
					method: 'POST',
					contentType: 'application/json',
					data: function ( d ) {
						return JSON.stringify( d );
					},
					success: function( json ) {
						if(!json['success']) {
							$.msgBox(json['message'], 'warning');
							return false;
						}
						table.columns.adjust();
					},
					error: function(error){
						getData(function(json){
							$.each(json.data,function(k){
								if((parseInt(count) + 1) == this['id']){
									$('.myTable' + k).DataTable().rows().remove();
									$('.myTable' + k).DataTable().rows.add([this]).draw();
								}
							})
						});
					}
				}
			},
			formOptions: {
				inline: {
					onBlur: 'submit',
					// onBlur: true,
					drawType: 'none'
				}
			}
		} ).on('preSubmit',function(){
			editor.close();
		});
		// $('.myTable' + k).on( 'click', 'tbody td:not(:first-child)', function( e ) {
		$('.myTable' + k).on( 'click', 'tbody td', function( e ) {
			$('.content').css('paddingBottom','300px');
			var rowData = table.row( $(this).parent('tr') ).data();
			var selected = $(this).parent('tr').hasClass('selected');
			try {
				editor.inline( this );
			} catch (e) {
				console.log(e);
			}
		} );

		totalPrice+= parseInt(this.price);
		totalQuantity+= parseInt(this.quantity);
	});
	var count = 0;
	var selectValue = '-1';
	//reload page set count
	$.each($('.paging'),function(k){
		if($(this).css('display') === 'block')
			count = k;
	});
	$('.right a').prop('href','#page' + (count));

	//左右滑动切换
	// $('.paging').on('swiperight',function(){
	// 	count--;
	// 	if(count < 0){
	// 		count = 0;
	// 		return false;
	// 	}
	// 	// $.mobile.changePage('#page' + count,{transition: 'fade'});
	// 	location.hash = '#page' + count;
	// });
	// $('.paging').on('swipeleft',function(){
	// 	count++;
	// 	if(count > data.data.length-1){
	// 		count = data.data.length-1;
	// 		return false;
	// 	}
	// 	// $.mobile.changePage('#page' + count,{transition: 'fade'});
	// 	location.hash = '#page' + count;
	// });


	function selectChange(){
		$('.ui-popup-container ul li').off().click(function(){
			var value = $(this).attr('data-option-index');
			$.mobile.changePage('#page' + value);
			count = parseInt(value);
		});
	}

	$('.paging').on('pageshow',function(){
		selectChange();
		setPublic(count,selectValue);
		$('table').DataTable().columns.adjust();
	});
	$('.paging').on('pagebeforeshow',function(){
		$('#filter-menu' + count).val(count).change();
		var headerIframe = $('.paging').eq(count).find('#header');
		selectValue = headerIframe.find('select').val();
	});
	setTimeout(function(){
		var hash = location.hash.match(/\d+/);
		location.hash = '';
		if(hash)
			count = hash[0];
		$.mobile.changePage('#page' + count);
		selectChange();
		setPublic(count,selectValue);
	},500);
});
function setPublic(count,selectValue){
	selectValue = selectValue || '-1';
	var headerIframe = $('.paging').eq(count).find('#header');
	var merchant = $('<p />').addClass('col-xs-6').html('商户: <select><option value="-1">请选择</option><option value="1000">彩虹科技有限公司</option></select>');
	merchant.find('select').val(selectValue).change();
	var p1 = $('<p />').text('总价:' + totalPrice).addClass('col-xs-6');
	var p2 = $('<p />').text('总数量:' + totalQuantity).addClass('col-xs-6');
	var div = $('<div >').append(merchant).append(p1).append(p2);
	headerIframe.find('h2').html(div);
}
