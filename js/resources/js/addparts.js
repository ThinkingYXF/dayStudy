$(function() {
	var tuColumns = [{
		title: '配件编号',
		data: 'parts.code',
		className: 'code table-td',
		editor: {
			type: 'input',
			name: 'uploads[{}].parts.code',
			className: 'form-control',
			validator: function(value) {
				return $.trim(value) != '';
			},
			optional:false
		}
	}, {
		title: '名称',
		data: 'parts.name',
		className: 'quantity table-td ',
		editor: {
			name: 'uploads[{}].parts.name',
			className: 'form-control',
			validator: function(value) {
				return $.trim(value) != '';
			},
			optional:false
		}
	}, {
		title: '品牌',
		data: 'parts.brand.id',
		editor: {
			type: 'select',
			name: 'uploads[{}].parts.brand.id',
			options: {
				'': '请选择'
			},
			source: {
				url: '/field/partsbrand',
				//root: '',
				value: 'id',
				text: 'name'
			},
			className: 'form-control select2 select2-hidden-accessible',
			optional:true
		}
	},{
		title: '分类',
		data: 'parts.tags.1008',
		editor: {
			type: 'select',
			name: 'uploads[{}].parts.tags[1008]',
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
		}
	},{
		title: '配件类别',
		data: 'parts.tags.1000',
		editor: {
			type: 'select',
			name: 'uploads[{}].parts.tags[1000]',
			className: 'form-control select2 select2-hidden-accessible',
			options: {
				'': '请选择',
				AM: 'AM',
				OE: 'OE'
			},
			optional:true
		}
	}, {
		title: '车品牌',
		data: 'parts.tags.1013',
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
			events: {
				change: function() {
					var val = $(this).val();
					var seriesSelect = $('select[name^="uploads\["][name$="\].parts.tags[1009]"]', $(this).parents('tr'));
					seriesSelect.empty().append($('<option />').val('').text('请选择'));
					if (val)
						$.getJSON('/data/series/' + val + '.json').success(function(json) {
							$.each(json, function(idx, obj) {
								seriesSelect.append($('<option />').val(obj['id']).text(obj['name']));
							});
						});
				}
			}
		}
	}, {
		title: '车系',
		data: 'parts.tags.1009',
		editor: {
			type: 'select',
			className: 'form-control',
			options: {
				'': '请选择'
			},
			name: 'uploads[{}].parts.tags[1009]',
			optional:true
		}
	}, {
		title: '提示信息',
		data: 'error',
		className: 'error-msg table-td',
        visible: false
	} ];
	$('#table_container').tableUpload({
		//url: '/some/url/to/post/to',
		url: function() {
			return "/parts";
		},
		columns: tuColumns,
		data: [],
		outerFields: function() {
			if($('.supplier').val() != -1){
				return {
					supplier: $('.supplier').val()
				};
			}
		},
		fileUpload: {
			container: '#upload_file',
			url: '/parts/upload',
			template: '/data/download/parts',
			text: '批量上传'
		}
	});
});