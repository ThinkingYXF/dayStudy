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
		title: '库存数量',
		data: 'product.inventory',
		className: 'quantity table-td ',
		editor: {
			name: 'uploads[{}].product.inventory',
			className: 'form-control',
			validator: /^\d+$/,
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
			return "/products/inventory";
		},
		columns: tuColumns,
		data: [],
		outerFields: function() {
			if($('.supplier').val() != -1){
				return {
					supplierId: $('.supplier').val()
				};
			}
		},
		fileUpload: {
			container: '#upload_file',
			url: '/product/upload',
			template: '/data/download/inventory',
			text: '批量上传'
		}
	});
});