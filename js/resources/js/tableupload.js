$.fn.extend({
	tableUpload: function(config, settings) {
		var container = $(this);
		config = $.extend({}, $.fn.tableUpload.defaultConfig, config);
		if (!$.isArray(config['columns']) || config['columns'].length == 0)
			return this;

		settings = $.fn.tableUpload.dataTablesSettings(config, settings, container);
		var table = $('<table />').addClass('table').addClass('table-bordered').appendTo(this).dataTable(settings);
		var api = $(table).DataTable();

		if (config['fileUpload'])
			$.fn.tableUpload.fileUpload(config, api, container);

		return this;
	},
	TableUpload: this.tableUpload,
	tableupload: this.tableUpload
});

$.fn.tableUpload.defaultConfig = {
	appendable: true,
	data: []
};

$.fn.tableUpload.dataTablesSettings = function(config, settings, container) {
	settings = $.extend({}, {
		//autoWidth: false,
		searching: false,
		ordering: false,
		paging: false,
		info: false,
		scrollY: '500px',
		data: config.data,
		dom: 'tB',
		columnDefs: [{
			targets: '_all',
			data: null,
			defaultContent: ''
		}],
	}, settings);

	var btnaction = function(api,obj){
		obj = obj || '';
		if(obj)
			var stu = obj.status;
		var hasError = false;
		$.each(api.rows().indexes(), function(r) {
			var filled = false;
			var row = api.row(r);
			$.each(api.columns().indexes(), function(c) {
				var cell = api.cell(r, c);
				var field = $('input, select', cell.node()).removeClass('error');
				var optional = field.data('optional');
				if (field.length == 0)
					return true;
				if (field.val() != '' && optional === false)
					filled = true;

				var validator = field.data('validator');
				if (validator) {
					if (!validator(field.val()))
						$(cell.node()).data('error', true);
				}
			});
			if (filled) {
				$.each(api.columns().indexes(), function(c) {
					var cell = api.cell(r, c);
					if ($(cell.node()).data('error')) {
						hasError = true;
						$(cell.node()).removeData('error');
						$('input, select', cell.node()).addClass('error').focus(function() {
							$(this).removeClass('error');
						});
					}
				});
				if (hasError)
					return false;
			}
		});
		outerFields = config['outerFields'] ? config['outerFields']() : true;
		if(outerFields === false)
			hasError = true;
		if (!hasError) {
			var fields = {};
			$.each(api.$('input, select'), function() {
				var obj = $(this).serializeArray()[0];
				if (obj && obj['name'] && obj['value'] && obj['name'] != 'error')
					fields[obj['name']] = obj['value'];
			});
			$.extend(fields, outerFields,{status: stu});
			var url = config['url'];
			if ($.isFunction(url))
				url = url();
			$.mask();
			$.ajax({
				url: url,
				method: 'POST',
				data: fields,
				context: {
					api: api,
					container: container,
					config: config
				}
			}).success($.fn.tableUpload.results);
			/*$.post(url, fields, function(json) {
				if(json.success){
					container.empty();
					container.tableUpload(config);
				}
				if(!json.success){
					api.rows().remove();
					$.each(api.columns().indexes(),function(i){
						api.columns(i).visible(true);
					})
					$.each(json.data,function(i,data){
						api.row.add(data);
					});
					api.draw();
				}
				$.hideMask();
			});*/
		}
	}
	settings['buttons'] = settings['buttons'] || {};
	settings['buttons']['buttons'] = settings['buttons']['buttons'] || [];
	settings['buttons']['buttons'].push({
		text: '提交',
		action: function(e, dt, node, config){
			btnaction(dt);
		}
	});
	if(config['buttons'] && config['buttons'].length){
		var arr = [];
		$.each(config['buttons'],function(i,val){
			var obj = {
				text: val.text,
				status: val.status,
				action: function(e, dt, node, config){
					btnaction(dt,config);
				}
			}
			arr.push(obj)
		})
		settings['buttons']['buttons'].push(arr);
	}
	if (config['appendable']) {
		settings['buttons']['buttons'].unshift({
			text: '添加10行',
			action: function(e, dt, node, config) {
				$.fn.tableUpload.addRows(dt, 10);
			}
		});
		settings['initComplete'] = function(settings) {
			$.fn.tableUpload.addRows(this.DataTable());
		}
	}

	settings['columns'] = [];
	$.each(config['columns'], function(idx, columnConfig) {
		var column = {
			title: columnConfig['title'] || '',
			type: columnConfig['type'] || 'string',
			data: columnConfig['data'] || null,
			className: columnConfig['className'] || null,
			visible: columnConfig['visible'] === undefined ? true : columnConfig['visible']
		};
		if (columnConfig['editor']) {
			var editor = columnConfig['editor'];
			column['createdCell'] = function(cell, cellData, rowData, rowIndex, colIndex) {
				$(cell).empty();
				var field = $.fn.tableUpload.createField(editor, cellData, rowIndex, colIndex);
				$(cell).append(field);

				if ($.isFunction(editor['validator']))
					$(field).data('validator', editor['validator']);
				else if (editor['validator'] instanceof RegExp)
					$(field).data('validator', function(value) {
						return editor['validator'].test(value);
					});

				if (editor['events'])
					$.each(editor['events'], function(name, callback) {
						$(field).on(name, callback);
					});
				if (!(editor['optional'] === undefined))
					$(field).data('optional', editor['optional']);
			}
		}
		settings['columns'].push(column);
	});
	return settings;
};
$.fn.tableUpload.createField = function(editor, data, row, col) {
	switch (editor['type']) {
	case 'checkbox':
		var input = $('<input />').prop('type', 'checkbox').attr('value', data);
		if (editor['name']) {
			var name = editor['name'].replace(/{}/, row);
			input.prop('name', name).prop('id', name);
		}
		input.prop('checked', editor['checked']);
		return input;
	case 'select':
		var select = $('<select />');
		if (data)
			select.data('data', data);
		if (editor['name'])
			select.prop('name', editor['name'].replace(/{}/, row));
		if (editor['options'])
			$.each(editor['options'], function(value, text) {
				select.append($('<option />').val(value).text(text));
			});
		if(editor['className'])
			select.addClass(editor['className']);
		if (editor['source']) {
			var source = editor['source'];
			var ajaxOptions = {
				url: source['url'],
				method: source['method'] || 'GET',
				context: select
			};
			$.ajax(ajaxOptions).success(function(json) {
				var select = this;
				$.each(source['root'] ? json[source['root']] : json, function() {
					var text = this[source['text']];//.replace(/&emsp;/g ," ");
					select.append($('<option />').val(this[source['value']]).prop('selected', data == this[source['value']]).html(text));
				});
				select.change();
			});
		}
		return select;
	case 'input':
	default:
		var input = $('<input />').prop('type', 'text').attr('value', data);
		if (editor['name'])
			input.prop('name', editor['name'].replace(/{}/, row));
		if(editor['className'])
			input.addClass(editor['className']);
		if(editor['readonly'])
			input.prop('readonly',editor['readonly']);
		return input;
	}
};

$.fn.tableUpload.addRows = function(api, count) {
	for (count = count || 10; count > 0; --count)
		api.row.add({});
	api.draw();
};

$.fn.tableUpload.results = function(json) {
	var api = this['api'];
	var container = this['container'];
	var config = this['config'];
	if(json.success) {
		container.empty();
		container.tableUpload(config);
	}
	if(!json.success){
		api.rows().remove();
		$.each(api.columns().indexes(),function(i){
			api.columns(i).visible(true);
		})
		$.each(json.data,function(i,data){
			api.row.add(data);
		});
		api.draw();
	}
	$.hideMask();
}

$.fn.tableUpload.fileUpload = function(globalConfig, api, container) {
	config = globalConfig['fileUpload'] || {};
	var iframe = $(config['container']);
	if (iframe.length == 0)
		return false;

	config['text'] = config['text'] || 'Excel上传';
	$(iframe).load(function() {
		var form = $('form', this.contentDocument);
		if (form.length > 0) {
			$(this).data('src', this.src);
			$('button', form).text(config['text']);
			if (config['url'])
				form.attr('action', config['url']);
			if (config['template'])
				$('a', this.contentDocument).prop('href', config['template']);
			else
				$('a', this.contentDocument).hide();

			var _csrf = $('footer form input:hidden');
			$('<input />').prop('type', 'hidden').prop('name', _csrf.prop('name')).val(_csrf.val()).appendTo(form);

			$('input:file', form).change(function() {
				if (!/\.xlsx?$/.test($(this).val())) {
					$.msgBox('请选择Excel文件上传', 'warning');
					return false;
				}
				var outerFields = globalConfig['outerFields'];
				if ($.isFunction(outerFields))
					outerFields = outerFields();
				if ($.isPlainObject(outerFields))
					$.each(outerFields, function(name, value) {
						$('<input />').prop('type', 'hidden').prop('name', name).val(value).appendTo(form);
					});
				$.mask();
				form.submit();
			});
			return false;
		}

		var text = $('body', this.contentDocument).text();
		this.src =  $(this).data('src');
		$.hideMask();
		try {
			var json = JSON.parse(text);
			$.fn.tableUpload.results.call({
				api: api,
				container: container,
				config: globalConfig
			}, json);
		} catch (e) {
			$.msgBox('上传失败', 'danger');
		}
	});
};
