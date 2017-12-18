$(function() {
	var columns = [{
		title: '商品编号',
		data: 'product.code'
	}, {
		title: '商品名称',
		data: 'product.name'
	}, {
		title: '配件编号',
		data: 'product.parts.code'
	}, {
		title: '配件名称',
		data: 'product.parts.name'
	}, {
		title: '库存数量',
		data: 'product.inventory'
	}];
	$.getJSON('/product/profile', function(json) {
		var colors = {};
		if (json.success && $.isArray(json.data)) {
			$.each(json.data, function(idx, profile) {
				colors[columns.length] = profile['code'];
				columns.push({
					title: profile['name'],
					data: 'price_' + profile['code']
				});
			})
		}
		columns.push({
			title: '操作',
			sortable: false,
			createdCell: function(cell, cellData, rowData, rowIndex, colIndex) {
				$(cell).empty();
				$('<button />').addClass('btn btn-primary btn-sm btn-edit')
						.attr('data-toggle', 'modal')
						.attr('data-target', '#modal-edit')
						.text('编辑')
						.click(function() {
					var modal = $('#modal-edit');
					$('input:hidden[name="id"]', modal).val(rowData['id']);
					$('input:hidden[name="product.id"]', modal).val(rowData['product']['id']);
					$('input:text[name="product.code"]', modal).val(rowData['product']['code']);
					$('input:text[name="product.name"]', modal).val(rowData['product']['name']);
					$('input:text[name="product.inventory"]', modal).val(rowData['product']['inventory']);
					$('div.color-price', modal).remove();
					$.each(json['data'], function(idx, profile) {
//<div class="form-group">
//	<label class="col-sm-2 control-label">库存数量</label>
//	<div class="col-sm-9">
//		<input type="text" class="form-control" name="product.inventory">
//	</div>
//</div>
						var group = $('<div />').addClass('form-group color-price').appendTo($('div.modal-body', modal));
						$('<label />').addClass('col-sm-2 control-label').css('color', '#' + profile['code']).text(profile['name']).appendTo(group);
						var input = $('<input />').prop('type', 'text').addClass('form-control').val(rowData['price_' + profile['code']]);
						$('<div />').addClass('col-sm-9').append(input).appendTo(group);

						var price = undefined;
						$.each(rowData['prices'], function() {
							if (profile['code'] == this['code']) {
								price = this;
								return false;
							}
						});
						if (!price || (price['flag'] & STATES['LOCKED']) == 0) {
							input.prop('name', 'prices[' + idx + '].price');
							$('<input />').prop('type', 'hidden').prop('name', 'prices[' + idx + '].code').val(profile['code']).appendTo(group);
						}
					});
				}).appendTo(cell);
				//$('<button />').addClass('btn btn-primary btn-sm btn-delete').text('删除').click(function() {
				//	console.log(rowIndex);
				//}).appendTo(cell);
			}
		});
		$('#form-edit').submit(function() {
			$.mask();
			var params = {};
			$.each($(this).serializeArray(), function() {
				params[this.name] = this.value;
			});
			$.ajax({
				url: '/product',
				method: 'PUT',
				data: params
			}).success(function(json) {
				if (json.message)
					$.msgBox(json.message);
				$('#product_table').DataTable().ajax.reload();
				$('#modal-edit').modal('hide');
			}).done($.hideMask);
			return false;
		});
		var product_table = $('#product_table').DataTable({
			ajax: {
				data: '/products',
				dataSrc: function(json) {
					var data = [];
					if (json.success && $.isArray(json.data))
						$.each(json.data, function(idx, supplying) {
							if ($.isArray(supplying.prices))
								$.each(supplying.prices, function(idx, price) {
									supplying['price_' + price['code']] = price['price'];
								});
							data.push(supplying);
						});
					return data;
				}
			},
			columnDefs: [{
				targets: '_all',
				data: null,
				defaultContent: ''
			}],
			columns: columns
		}).on('draw.dt', function() {
			var ths = $('th', $(this).DataTable().table().header());
			$.each(colors, function(idx, code) {
				$(ths.get(idx)).css('color', '#' + code);
			});
		});

		/**
		 * 筛选框设置(名称,label,关联查询列)
		 * name = [merchant] auto complete
		 */
		(function () {
			$.createSearch([{"name": "配件编号", "label": "配件编号", "col": 0}], product_table,
				'<a class="btn  btn-primary btn-sm add-btn col-md-1" href="/product/inventory">上传库存</a><a class="btn  btn-primary btn-sm add-btn col-md-1" href="/product/price">上传价格</a>');
			function sup_select(e) {
				$.get('/merchant/suppliers', function (data) {
					if (data.success) {
						$.each(data.data, function (i, sup) {
							$('<option />').val(sup.id).text(sup.name).appendTo(e);
						});
					}
				});
			}

			sup_select($('#supplier_select'));
			$('#supplier_select').change(function () {
				var sup_id = $('#supplier_select').val();
				$.current_supplier_id = sup_id;
				product_table.ajax.url('/products/' + sup_id).load();
			});
			$('.search .search-btn').click(function () {
				var sup_id = $('#supplier_select').val();
				var code_value = $('#input_code').val();
				product_table.ajax.url('/products/' + sup_id + '/' + code_value).load();
			});
		})();
	});
});