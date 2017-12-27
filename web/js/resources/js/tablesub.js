$.fn.extend({
	tableUpload: function(config, settings) {
		var container = $(this);
		config = $.extend({}, $.fn.tableUpload.defaultConfig, config);
		if (!$.isArray(config['columns']) || config['columns'].length == 0)
			return this;

		settings = $.fn.tableUpload.dataTablesSettings(config, settings);
		$('<table />').addClass('table').addClass('table-bordered').appendTo(this).dataTable(settings);
	},
	TableUpload: this.tableUpload,
	tableupload: this.tableUpload
});

$.fn.tableUpload.defaultConfig = {
	appendable: true,
	data: []
};

$.fn.tableUpload.dataTablesSettings = function(config, settings) {
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

	settings['buttons'] = settings['buttons'] || {};
	settings['buttons']['buttons'] = settings['buttons']['buttons'] || [];
	settings['buttons']['buttons'].push({
		text: '提交',
		action: function() {
			var api = this.table();
			var hasError = false;
			$.each(api.rows().indexes(), function(r) {
				var filled = false;
				var row = api.row(r);
				$.each(api.columns().indexes(), function(c) {
					var cell = api.cell(r, c);
					var field = $('input, select', cell.node()).removeClass('error');
					if (field.length == 0)
						return true;
					if (field.val() != '')
						filled = true;

					var validator = $(cell.node()).data('validator');
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
			if (!hasError) {
				var fields = {};
				$.each(api.$('input, select'), function() {
					var obj = $(this).serializeArray()[0];
					if (obj['name'] && obj['value'])
						fields[obj['name']] = obj['value'];
				});
				$.extend(fields, config['outerFields']());
				var url = config['url'];
				if ($.isFunction(url))
					url = url();
				//console.log(url, fields);
				$.mask();
				$.post(url, fields, function(json) {
					console.log(json);
				});
			}
		}
	});

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
		};
		if (columnConfig['editor']) {
			column['render'] = $.fn.tableUpload.render(columnConfig['editor']);
			if ($.isFunction(columnConfig['editor']['validator'])) {
				column['createdCell'] = function(cell, cellData, rowData, rowIndex, colIndex) {
					$(cell).data('validator', columnConfig['editor']['validator']);
				}
			} else if (columnConfig['editor']['validator'] instanceof RegExp) {
				column['createdCell'] = function(cell, cellData, rowData, rowIndex, colIndex) {
					$(cell).data('validator', function(value) {
						return columnConfig['editor']['validator'].test(value);
					});
				}
			}
		}
		settings['columns'].push(column);
	});
	return settings;
};

$.fn.tableUpload.render = function(editor) {
	switch (editor['type']) {
	case 'checkbox': //TODO
	case 'select': //TODO
		return function(data) {
			return data;
		};
	case 'input':
	default:
		return function(data, type, row, meta) {
			var input = $('<input />').prop('type', 'text').attr('value', data);
			if (editor['name'])
				input.prop('name', editor['name'].replace(/{}/, meta.row));
			return $('<div />').append(input).html();
		};
	}
};

$.fn.tableUpload.addRows = function(api, count) {
	for (count = count || 10; count > 0; --count)
		api.row.add({});
	api.draw();
};