$(function() {
	function render_supplier(e){
		$.get('/merchant/warehouses', function(data){
			if(data.success){
				var html = '<option value = "-1">自有仓库</option>';
				$.each(data.data, function(i, sup){
					html += '<option value="' + sup.id + '">' + sup.name + "</option>";
				});
				$(e).append(html);
			}
		});
	}
		//价格列表填充
	$.get('/data/product/price/code', function(json){
		var data = json.data;
		if(data && data.length > 0){
			var html = '';
			$.each(data, function(i, d){
				html += '<li class="price-color"><i class="fa fa-fw fa-check-square hidden" value="' + d + '" style="color:#' + d + '"></i><i class="fa fa-fw fa-square" value="' + d + '" style="color:#' + d + '"></i></li>';
			});
			$('#price_code').append(html);
			$('#price_code li').first().find('i.fa-square').addClass('hidden');
			$('#price_code li').first().find('i.fa-check-square').removeClass('hidden');
			$('#price_code li').click(function(){
				$('#price_code').find('i.fa-check-square').addClass('hidden');
				$('#price_code').find('i.fa-square').removeClass('hidden');
				$(this).find('i.fa-square').addClass('hidden');
				$(this).find('i.fa-check-square').removeClass('hidden');
			});

			$('#price-code').append(html);
			$('#price-code li').first().find('i.fa-square').addClass('hidden');
			$('#price-code li').first().find('i.fa-check-square').removeClass('hidden');
			$('#price-code li').click(function(){
				$('#price-code').find('i.fa-check-square').addClass('hidden');
				$('#price-code').find('i.fa-square').removeClass('hidden');
				$(this).find('i.fa-square').addClass('hidden');
				$(this).find('i.fa-check-square').removeClass('hidden');
			});
			$('i.fa-check-square').each(function(){
				if(!$(this).hasClass('hidden')){
					code = $(this).attr('value');
				}
			});
			(function () {
				$.get('/product/profile', function (data) {
					if (data.success) {
						var price_list = {};
						$.each(data.data, function (i, v) {
							price_list['code'+v.code] = v.name;
						});
						get_price();
						$('#price_code li').each(function () {
							$(this).click(function () {
								get_price();
							});
						});
						function get_price() {
							$('#price_code li .fa-check-square').each(function () {
								if(!$(this).hasClass('hidden')){
									var key = $(this).attr('value');
									if (key == 'FF0000') {
										$('#price_name').val('成本价').prop('readonly', true);
									} else {
										$('#price_name').val(price_list['code'+key]).prop('readonly', false);
									}
								}
							});
						}
					}
				});
			})();
		}
	});
	render_supplier($('.supplier'));
	var tuColumns = [{
		title: '商品编号',
		data: 'product.code',
		className: 'code table-td',
		editor: {
			type: 'input',
			name: 'uploads[{}].product.code',
			className: 'form-control',
			validator: function(value) {
				return $.trim(value) != '';
			},
			optional:false
		}
	}, {
		title: '商品价格',
		data: 'product.price',
		className: 'quantity table-td ',
		editor: {
			name: 'uploads[{}].product.price',
			className: 'form-control',
			validator: /^\d+(\.\d+)?$/,
			optional:false
		}
	}, {
		title: '确认一致',
		data: 'product.parts.id',
		editor: {
			type: 'checkbox',
			name: 'uploads[{}].product.parts.id',
			events: {
				change: function() {
					var value = $(this).val();
					if (!value) {
						$(this).prop('checked', false).prop('disabled', true);
						return;
					}
					var checked = $(this).prop('checked');
					var td = $(this).parents('td');
					while (td.length > 0) {
						td = td.next();
						$('input, select', td).prop('disabled', checked);
					}
				}
			}
		},
		visible: false
	}, {
		title: '配件编号',
		data: 'product.parts.code',
		editor: {
			type: 'input',
			name: 'uploads[{}].product.parts.code',
			className: 'form-control',
			optional:true
		},
		visible: false
	}, {
		title: '配件名称',
		data: 'product.parts.name',
		editor: {
			type: 'input',
			name: 'uploads[{}].product.parts.name',
			className: 'form-control',
			optional:true
		},
		visible: false
	}, {
		title: '品牌',
		data: 'product.parts.brand.id',
		editor: {
			type: 'select',
			name: 'uploads[{}].product.parts.brand.id',
			source: {
				url: '/field/partsbrand',
				//root: '',
				value: 'id',
				text: 'name'
			},
			className: 'form-control select2 select2-hidden-accessible',
			options: {
				'': '请选择'
			},
			optional:true
		},
		visible: false
	}, {
		title: '分类',
		data: 'product.parts.tags.1008',
		editor: {
			type: 'select',
			name: 'uploads[{}].product.parts.tags[1008]',
			source: {
				url: '/field/category',
				//root: '',
				value: 'id',
				text: 'name'
			},
			className: 'form-control select2 select2-hidden-accessible',
			options: {
				'': '请选择'
			},
			optional:true
		},
		visible: false
	},{
		title: '配件类别',
		data: 'product.parts.tags.1000',
		editor: {
			type: 'select',
			name: 'uploads[{}].product.parts.tags[1000]',
			className: 'form-control select2 select2-hidden-accessible',
			options: {
				AM: 'AM',
				OE: 'OE'
			},
			optional:true
		},
		visible: false
	}, {
		title: '车品牌',
		data: 'product.parts.tags.1013',
		editor: {
			type: 'select',
			options: {
				'': '请选择'
			},
			optional:true,
			className: 'form-control',
			source: {
				url: '/data/brand.json',
				//root: '',
				value: 'id',
				text: 'name'
			},
			//name: 'uploads[{}].parts.tags.1013',
			events: {
				change: function() {
					var val = $(this).val();
					var seriesSelect = $('select[name^="uploads\["][name$="\].product.parts.tags[1009]"]', $(this).parents('tr'));
					seriesSelect.empty().append($('<option />').val('').text('请选择'));
					if (val)
						$.getJSON('/data/series/' + val + '.json').success(function(json) {
							$.each(json, function(idx, obj) {
								seriesSelect.append($('<option />').val(obj['id']).prop('selected', seriesSelect.data('data') == obj['id']).text(obj['name']));
							});
						});
				}
			}
		},
		visible: false
	}, {
		title: '车系',
		data: 'product.parts.tags.1009',
		editor: {
			type: 'select',
			className: 'form-control',
			options: {
				'': '请选择'
			},
			name: 'uploads[{}].product.parts.tags[1009]',
			optional:true
		},
		visible: false
	}, {
		title: '提示信息',
		data: 'error',
		className: 'error-msg table-td',
		visible: false
	} ];
	$('#table_container').tableUpload({
		//url: '/some/url/to/post/to',
		url: function() {
			return "/products/price";
		},
		columns: tuColumns,
		data: [],
		outerFields: function() {
			if($('#price_name').val() == ''){
				$('#price_name').addClass('error');
				return false;
			}
			if($('.supplier').val() != -1){
				return {
					supplierId: $('.supplier').val(),
					name: $('#price_name').val(),
					code: code
				};
			}else {
				return {
					name: $('#price_name').val(),
					code: code
				};
			}
		},
		fileUpload: {
			container: '#upload_file',
			url: '/product/price/upload',
			template: '/data/download/price',
			text: '批量上传'
		}
	});
});