$(function() {
	
	var tuColumns = [{
		title: '配件编号',
		data: 'code',
		editor: {
			type: 'input',
			name: 'uploads[{}].substitute.parts.code',
			className: 'form-control',
			validator: function(value) {
				return $.trim(value) != '';
			}
		}
	}, {
		title: '替换件编号',
		data: 'code',
		editor: {
			name: 'uploads[{}].substitute.substitute.code',
			className: 'form-control',
			validator: function(value) {
				return $.trim(value) != '';
			}
		}
	}, {
		title: '错误信息',
		data: 'error',
		editor: {
			className: 'form-control',
			validator: function(value) {
				return $.trim(value) != '';
			}
		}
	}];
	

	$('#table_container').tableUpload({
		//url: '/some/url/to/post/to',
		url: function() {
			return "/parts/substitute";
		},
		columns: tuColumns,
		data: [],
		fileUpload: {
			container: '#upload_file',
			url: '/parts/substitute/upload',
			template: '/data/download/substitute',
			text: '批量上传'
		}
	});
});