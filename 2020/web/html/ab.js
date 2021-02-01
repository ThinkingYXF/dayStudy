$(function() {
	//仓库筛选
	// var supplyFilter = $('#supplier_select').multipleSelect({
	// 	filter: true,
	// 	width: '100%',
	// 	maxHeight: 200,
	// 	allSelected: '全部',
	// 	noMatchesFound: '无结果',
	// 	single: true,
	// 	selectAll: false,
	// 	onClick: function(label) {
	// 		var exp = label.value;
	// 		addBrandCategory(exp);
	// 	},
	// });
	//品牌过滤
	var brandFilter = $('#filter_brand').multipleSelect({
		filter: true,
		width: '100%',
		maxHeight: 200,
		allSelected: '全部',
		noMatchesFound: '无结果',
		single: true,
		selectAll: false,
		onClick: function(label) {
			var exp = label.value;
			var supplierId = $('#supplier_select').val();
			if(supplierId)
				table.column(1).search(supplierId).column(7).search(exp).draw();
		},
	});
	//类别过滤
	var typeFilter = $('#filter_type').multipleSelect({
		filter: true,
		width: '100%',
		maxHeight: 200,
		allSelected: '全部',
		noMatchesFound: '无结果',
		single: true,
		selectAll: false,
		onClick: function(label) {
			var exp = label.value;
			var supplierId = $('#supplier_select').val();
			if(supplierId)
				table.column(1).search(supplierId).column(6).search(exp).draw();
		}
	});
	//分组过滤
	/*var groupFilter = $('#filter_group').multipleSelect({
		filter: true,
		width: '100%',
		maxHeight: 200,
		allSelected: '全部',
		noMatchesFound: '无结果',
		single: true,
		selectAll: false,
		onClick: function(label) {
			var exp = label.value;
			var supplierId = $('#supplier_select').val();
			if(supplierId)
				table.column(1).search(supplierId).column(13).search(exp).draw();
		}
	});*/
	var addFilterOption = function(filter, value, text) {
		var exist = false;
		$('option', filter).each(function() {
			if ($(this).val() == value) {
				exist = true;
				return false;
			}
		});
		if (!exist)
			filter.append($('<option />').val(value).text(text)).multipleSelect('refresh');
	};
	var supplierId = parseInt($('.navbar-nav .merchant-menu .name').data('merchant'));
	function addBrandCategory(supplierId){
		brandFilter.find('option').remove();
		typeFilter.html('');
		if(supplierId != -1)
			$.get('/products/parts/brand?supplierId=' + supplierId, function(json){
				if(json['data'] && json['data'].length){
					brandFilter.append($('<option />').val('').text('全部'));
					$.each(json['data'],function(key,val){
						addFilterOption( brandFilter, val.id, val.name );
					});
				}
				else
					brandFilter.multipleSelect('refresh');
			});
		else
			$.get('/products/parts/brand', function(json){
				if(json['data'] && json['data'].length){
					brandFilter.append($('<option />').val('').text('全部'));
					$.each(json['data'],function(key,val){
						addFilterOption( brandFilter, val.id, val.name );
					});
				}
				else
					brandFilter.multipleSelect('refresh');
			});

		//配件类别筛选
		typeFilter.append($('<option />').val('').text('全部'));
		$.each(PartsType,function(k,v){
			addFilterOption(typeFilter, k, v);
		});
	}
	addBrandCategory(supplierId);

	//获取当前存在的分组
	function getGroupName(){
		$('.groupName').val('');
		$.get('/product/group', function(json){
			if(json.data && json.data.length){
				$('.select_groupName').html('');
				groupFilter.html('');
				groupFilter.append($('<option />').val('').text('全部'));
				$.each(json.data,function(i,data){
					addFilterOption(groupFilter, data, data);
					var option = $('<option />').text(data);
					$('.select_groupName').append(option);
				});
			}
		});
	}
	getGroupName();
	// //仓库更改
	// $('#supplier_select').change(function(){
	// 	var supplierId = $(this).val();
	// 	addBrandCategory(supplierId);
	// });
	var warehouses = {},
		atoseries = {};
	var columns = [{
		data: null,
		defaultContent: '',
		className: 'select-checkbox',
		width: '10px',
		orderable: false
	},{
		title: '仓库',
		data: 'supplier.id',
		render: function( data, type, row, meta ) {
			if(type !== 'display')
				return data;
			if(!row['supplier']) {
				row['supplier'] = {};
				row['supplier']['id'] = supplierId;
				row['supplier']['name'] = '本地库存';
				row['editEnable'] = true;
			}
			if(row['supplier']['name'])
				return row['supplier']['name'];
			warehouses[row['id']] = true;
			$.getJSON('/data/merchant/' + data, function(json) {
				if( json['id'] == supplierId ) {
					row['supplier']['name'] = '本地库存';
					row['editEnable'] = true;
					table.cell(meta.row, meta.col).node().textContent = '本地库存';
				} else if( json['parentId'] == supplierId ) {
					row['supplier']['name'] = json['name'];
					table.cell(meta.row, meta.col).node().textContent = json['name'];
					row['editEnable'] = true;
					row['purchase'] = true;
				} else {
					row['supplier']['name'] = json['name'];
					table.cell(meta.row, meta.col).node().textContent = json['name'];
					row['purchase'] = true;
				}
				delete warehouses[row['id']];
				if($.isEmptyObject(warehouses))
					table.columns.adjust();
			} );
			return null;
		},
	}, {
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
		title: '配件类别',
		data: 'product.parts.tags.1000',
		render: function(data, type, row, meta){
			if(data)
				return $.typeKeyToValue(data);
		}
	}, {
		title: '配件品牌',
		data: 'product.parts.brand.id',
		render: function(data, type, row, meta){
			if(row['product']['parts'])
				return row['product']['parts']['brand'] ? row['product']['parts']['brand']['name'] : '';
		}
	}, {
		title: '分类',
		data: 'product.parts.tags.1008',
		render: function( data, type, row, meta ) {
			if (type !== 'display')
				return data;
			var value;
			$.each(CATEGORIES,function(i, key){
				if(key.id == data){
					value = $.trim(key.name);
					return false;
				}
			});
			return value ? value : data;
		}
	},{
		title: '车品牌',
		data: 'product.parts.tags.1013',
		render: function( data, type, row, meta ) {
			if (type !== 'display')
				return data;
			if(data){
				var ids = data.split(','),
					names = [];
				$.each(ids,function(i,val){
					$.each(AUTOBRAND,function(k, v){
						if(k == val){
							names.push($.trim(v));
						}
					});
				});
				names = names.join(',');
			}
			return names ? names : data;
		},
	},{
		title: '车系',
		data: 'product.parts.tags.1009',
		render: function( data, type, row, meta ) {
			if (type !== 'display')
				return data;
			if(!data)
				return;
			if(row['product']['parts']['tags']['atoseries'])
				return row['product']['parts']['tags']['atoseries'];
			var ids = data.split(',');
			var names = [],
				count = 0;
			atoseries[row['id']] = true;
			$.each( ids, function(idx, id) {
				$.getJSON('/atoseries/' + id, function(json) {
					count++;
					if(!$.isArray(json['data']))
						return;
					names.push( json.data[0].name );
					if(count == ids.length) {
						row['product']['parts']['tags']['atoseries'] = names.join(',');
						table.cell(meta.row, meta.col).node().textContent = names.join(',');
						delete atoseries[row['id']];
						if( $.isEmptyObject(atoseries) )
							table.columns.adjust();
					}
				} );
			} )
			return null;
		}
	},{
		title: '库存数量',
		data: 'product.inventory',
		defaultContent: 0
	},{
		title: '最小起订量',
		data: 'product.minOrderQuantity',
		defaultContent: 1
	},/*{
		title: '分组名称',
		data: 'product.tags.1000'
	}*/];
	var fields = [{
		label: '商品编号',
		name: 'product.code'
	}, {
		label: '商品名称',
		name: 'product.name'
	}, {
		label: '库存数量',
		name: 'product.inventory',
		type: 'number',
		def: 0
	}, {
		label: '最小起订量',
		name: 'product.minOrderQuantity',
		type: 'number',
		def: 1
	},/* {
		label: '分组名称',
		name: 'product.tags.1000',
		type: 'select2',
		opts: {
			language: 'zh-CN',
			multiple: true,
			tags: true,
		},
		separator: ','
	}*/];
	var table, editor;
	$.getJSON('/product/profile', function(json) {
		var colors = {};
		if (json.success && $.isArray(json.data)) {
			$.each(json.data, function(idx, profile) {
				colors[columns.length] = profile['code'];
				columns.push({
					title: profile['name'],
					data: 'priceObjects.' + profile['code'] + '.price',
					render: function( data, type, row, meta ) {
						if ( type !== 'display' )
							return data;
						return data ? $.formatPrice(data) : '';
					}
				});
				fields.push( {
					label: profile['name'],
					name: 'priceObjects.' + profile['code'] + '.price',
					type: 'number'
				} );
			})
		};

		function getMerchant(modal, callback){
			$.ajax({
				url: '/merchant/customers',
				method: 'GET'
			}).success(function(json){
				var select = $('select', modal);
				if ($.isArray(json.data) && json.data.length > 0) {
					$('<option />').val('').text('请选择商户').appendTo($('select', modal));
					$.each(json.data, function() {
						var id = this['merchant']['id'];
						var name = this['merchant']['name'];
						$('<option />').val(id).text(name).prop('selected', id == $.customerId).appendTo($('select', modal));
					});
					if(callback)
						callback();
				}
			})
		};

		function selectOne( e, dt, type, indexes ) {
			if ( type === 'row' ) {
				var selectData = table.rows({selected: true}).data();
				if( selectData.length === 1 ) {
					var rowData = table.row({selected: true}).data();
					var node = $(table.rows({selected: true}).nodes());
					var buttonContainer = $('<div />').addClass('button-container').css({
						height: node.height(),
						top: node.position().top + $('.dataTables_scrollBody').scrollTop()
					});
					buttonContainer.appendTo($('.dataTables_scrollBody'));
					if(rowData['purchase'])
						$('<button />').addClass('btn btn-default btn-sm').css({
							'margin-right':'10px',
							height: node.height()
						}).click(function() {
							purchase(rowData);
						}).text('直采').appendTo(buttonContainer);
					$('<button />').addClass('btn btn-default btn-sm').text('比价').css({
						'margin-right':'10px',
						height: node.height()
					}).click( function() {
						$.modal('quantity', {
							title: '配件需求数量'
						}).progress(function(modal) {
							var quantity = $('input', modal).val();
							if(!/^\d+$/.test(quantity)) {
								$.msgBox('数量输入格式有误！请重新输入', 'warning');
								return false;
							} else
								$.ajax({
									url: '/product/toCompare',
									method: 'POST',
									data: {
										code:rowData.product.parts.code,
										quantity:quantity
									}
								} ).success(function(json){
									modal.modal('hide');
									if(json.success){
										$.msgBox('导入比价成功');
									}else{
										$.msgBox(json.message,'warning');
									}
								} );
						} )
					} ).appendTo(buttonContainer);
					$('<button />').addClass('btn btn-default btn-sm').css({
						height: node.height()
					}).text('报价').click(function() {
						$.modal('add_quote', {}, function(modal) {
							$.get('/quote/bill',function(json){
								if(json.data && json.data.length){
									if(json.data[0].customer){
										getMerchant(modal, function() {
											$('select', modal).val(json.data[0].customer.id);
											$('select', modal).prop('disabled',true);
										});
									}else
										getMerchant(modal);
								}
								else{
									getMerchant(modal);
								}
							});
						} ).progress( function(modal) {
							var quantity = $('input', modal).val();
							var merchantId = $('select', modal).val();
							if(!merchantId) {
								$.msgBox('请选择报价商户','warning');
								return false;
							}
							if(!/^\d+$/.test(quantity)) {
								$.msgBox('数量输入格式有误！请重新输入', 'warning');
								return false;
							}
							$.ajax({
								url:'/product/toQuote',
								method: 'POST',
								data: {
									code:rowData.product.parts.code,
									quantity:quantity,
									merchantId: merchantId
								}
							}).success(function(json){
								modal.modal('hide');
								if(json.success){
									$.msgBox('导入报价成功');
								}else{
									$.msgBox(json.message,'warning');
								}
							});
						} );
					} ).appendTo(buttonContainer);
				} else
					$('.button-container').remove();
			}
		};
		// $.get('/product/group', function(json){
			// var options = json.data ? json.data : [];
			// fields[4]['options'] = options;
			editor = new $.fn.dataTable.Editor({
				table: '#product_table',
				ajax: {
					edit: {
						url: '/product',
						type: 'PUT',
						contentType: 'application/json',
						data: function ( d ) {
							return JSON.stringify( d );
						},
						success: function(json) {
							if(!json['success']) {
								$.msgBox(json['message'], 'warning');
								return false;
							}
						}
					}
				},
				idSrc: 'id',
				fields: fields,
				formOptions: {
					inline: {
						onBlur: 'submit',
						drawType: 'none'
					}
				}
			} ).on('preSubmit', function( e, data, action ) {
				var passCheck = preSubmitCheck( data['data'] );
				if(passCheck) {
					editor.close();
					return false;
				}
			} );
		// });
		$('#product_table').on( 'click', 'tbody td:not(:first-child)', function( e ) {
			var rowData = table.row( $(this).parent('tr') ).data();
			var selected = $(this).parent('tr').hasClass('selected');
			if(!rowData['editEnable'])
				editor.disable( ['product.code', 'product.name', 'product.inventory', 'product.minOrderQuantity', 'priceObjects.FF0000.price', /*'product.tags.1000'*/] );
			else
				editor.enable( ['product.code', 'product.name', 'product.inventory', 'product.minOrderQuantity', 'priceObjects.FF0000.price', /*'product.tags.1000'*/] );
			try {
				editor.inline( this );
			} catch (e) {
				if(selected)
					table.row( $(this).parent('tr') ).deselect();
				else
					table.row( $(this).parent('tr') ).select();
			}
		} );
		table = $('#product_table').addClass('table-bordered table-striped').css('width','100%').DataTable({
			ajax: {
				url: '/products',
				type: 'GET',
				dataSrc: function(json) {
					if(!json['success']) {
						$.msgBox(json['message'], 'warning');
						return null;
					}
					return json.data;
				}
			},
			columnDefs: [{
				sortable: true,
				targets: [2,4]
			},{
				targets: '_all',
				sortable: false,
				data: null,
				defaultContent: '',
				className: 'text-nowrap',
				searchable: false
			}],
			columns: columns,
			deferLoading: 0,
			serverSide: true,
			pageLength: 25,
			order: [[2,'asc']],
			searching: true,
			paging: true,
			info: false,
			scrollX: true,
			scrollY: '60vh',
			scrollCollapse: true,
			dom: 'tpB',
			language: language,
			select: {
				style: 'multi+shift',
				selector: 'td:first-child'
			},
			buttons: ['selectAll','selectNone',{
				text: "弃用",
				action:removeInventory
			}],
			initComplete: function() {
				$.getJSON('/merchant/suppliers', function(json) {
					var merchantId = $('.navbar-nav .merchant-menu .name').data('merchant');
					var warehouseOptions = [{
						id: '-1',
						text: '所有仓库'
					}];
					var form = $('#search_form');
					var select = $('#supplier_select', form);
					$.each(json.data, function() {
						warehouseOptions.push({
							id: this['id'],
							text: this['name']
						});
						// addFilterOption(supplyFilter,this['id'],this['name']);
						// supplyFilter.find('option[value='+merchantId+']').prop('selected',true);
						// $('<option />').val(this['id']).text(this['name']).prop('selected', this['id'] == merchantId).appendTo(select);
					});
					var supplyFilter = $('#supplier_select').select2({
						data: warehouseOptions,
						language: 'zh-CN',
						// placeholder: '本地库存',
						matcher: function (params, data) {

							// If there are no search terms, return all of the data
							if ($.trim(params.term) === '') {
								return data;
							}

							// `params.term` should be the term that is used for searching
								// `data.text` is the text that is displayed for the data object
							if (data.text.indexOf(params.term) > -1 || data.id.indexOf(params.term) > -1) {
								var modifiedData = $.extend({}, data, true);
								return modifiedData;
							}

							// Return `null` if the term should not be displayed
							return null;
						}
					});
					supplyFilter.val(merchantId).trigger('change');
					form.submit(function() {
						var supplierId = select.val();
						var code = $.trim($('#code_input', this).val());
						var goodCode = $.trim($('#good_input', this).val());
						if (!/^\d+$/.test(supplierId) && !code && !goodCode)
							$.msgBox('仓库，配件编号，商品编号不能同时为空', 'warning');
						else if (code && code.length < 4) {
							$.msgBox('配件编码不能少于4位', 'warning');
						} else{
							var brandId = brandFilter.val() ? brandFilter.val()[0] : '';
							var typeId = typeFilter.val() ? typeFilter.val()[0] : '';
							supplierId = supplierId == -1 ? '' : supplierId;
							table.column(2).search(goodCode).column(7).search(brandId).column(6).search(typeId).column(1).search(supplierId).column(4).search(code).draw();
						}
						return false;
					});

					form.submit();
				});
			},
			select: {
				style: 'multi+shift',
				selector: 'td:first-child'
			}
		}).on('draw.dt', function() {
			$(this).DataTable().columns.adjust();
			$('.button-container').remove();
			var ths = $('th', $(this).DataTable().table().header());
			$.each(colors, function(idx, code) {
				$(ths.get(idx)).css('color', '#' + code);
			});
			var supplierId = $('#supplier_select').val();
			addBrandCategory(supplierId);
		} ).on('select', selectOne ).on('deselect', selectOne );
	});

	function preSubmitCheck( rowData ){
		var hasError = false;
		$.each(rowData, function(id, obj) {
			$.each(obj, function(attr, obj) {
				switch(attr) {
					case 'priceObjects':
						$.each(obj, function(key, priceObj) {
							if(!/^\d+(\.\d+)?$/.test( priceObj['price'] ) && priceObj['price'] !== '') {
								$.msgBox('价格只能是整数或小数，请输入正确的格式', 'warning');
								hasError = true;
								return false;
							}
						} );
						break;
					case 'product':
						$.each(obj, function(key, value) {
							switch(key) {
								case 'code':
									if($.trim(value).length < 5) {
										$.msgBox('商品编号至少为5位', 'warning');
										hasError = true;
										return false;
									}
									break;
								case 'name':
									if($.trim(value) == '') {
										$.msgBox('商品名称不能为空', 'warning');
										hasError = true;
										return false;
									}
									break;
								case 'inventory':
									if(!/^\d+$/.test( value )) {
										$.msgBox('库存数量必须为整数', 'warning');
										hasError = true;
										return false;
									}
									break;
								case 'minOrderQuantity':
									if(!/^[1-9]\d*$/.test( value )) {
										$.msgBox('最小起订量必须为大于1的整数', 'warning');
										hasError = true;
										return false;
									}
									break;
								default:
									  break;
							}
						} );
						break;
					default:
						break;
				}
			} )
		} );
		return hasError;
	};
	//直接采购
	function purchase( data ) {
		var supplyingId = data['id'];
		$.modal('quantity').progress(function(modal) {
			var quantity = $('input', modal).val();
			if(!/^\d+$/.test(quantity)) {
				$.msgBox('数量输入格式有误！请重新输入', 'warning');
				return false;
			}
			var params = {
				id: supplyingId,
				quantity: quantity
			};
			$.ajax({
				url: '/product/shoppingCart',
				method: 'POST',
				data: params,
				context: modal
			}).success(function(json) {
				modal.modal('hide');
				if(json['success']){
					$.msgBox(json['message']);
					//直销单的气泡显示
					$.get('/product/shoppingCart',function(json){
						if(json.data && json.data.length)
							$('.shoppingCart').text(json.data.length);
					});
				}
				else
					$.msgBox(json['message'], 'warning');
			})
		})
	}
	//弃用库存
	function removeInventory(){
		var selectData = table.rows({selected: true}).data();
		var merchantId = $('.navbar-nav .merchant-menu .name').data('merchant');
		var warehouseId = $('#supplier_select').val();
		var fields = {
			obsolete:{}
		};
		$.each(selectData,function(i,data){
			fields['obsolete'][data.id] = data.product.id;
		});
		if(!$.isEmptyObject(fields['obsolete'])){
			judgeWarehose(selectData,removeProduct,'您无权限弃用该库存');
		}

		function removeProduct(){
			$.confirm('确定弃用所选择的库存？').done(function(){
				$(table.table().container()).parent('div.box').eq(0).mask();
				$.ajax({
					url: '/product/obsolete',
					method: 'POST',
					context: selectData,
					data: fields
				}).success(function(json){
					$(table.table().container()).parent('div.box').eq(0).mask('close');
					if(json.success){
						table.ajax.reload(null,false);	//第一个参数为回调    第二个false表示页数不重置
						$.confirm('弃用成功，是否要重新创建新的库存？').done(function() {
							var value = {
								data: []
							};
							for(var i=0; i<selectData.length; i++){
								value['data'].push(selectData[i])
							};
							sessionStorage.setItem('products', JSON.stringify(value));
							$.jump('/product/inventory');
						});
					}
				});
			})

		}
	};

	function judgeWarehose(selectData, fn, str){
		var merchantId = $('.navbar-nav .merchant-menu .name').data('merchant');
		var warehouseId = $('#supplier_select').val();
		if(merchantId == warehouseId)
			fn();
		else{
			$.get('/merchant/warehouses', function(json){
				if(json['data'] && json['data'].length){
					//选择的为所有仓库
					if(!warehouseId){
						var isTrue = true;
						for(var k = 0; k< selectData.length; k++){
							$.each(json['data'],function(i,val){
								if(selectData[k]['supplier']){
									if(selectData[k]['supplier']['id'] == val.id){
										isTrue = false;
									}
								}
								else{
									isTrue = false;
								}
							});
							if(isTrue && k == selectData.length-1){
								$.msgBox(str, 'warning');
							}
							else if(!isTrue && k == selectData.length-1){
								fn();
							}
						}
					}
					else{
						for(var i = 0;i<json['data'].length;i++){
							if(warehouseId == json['data'][i].id){
								fn();
								break;
							}
							else if(i == json['data'].length - 1){
								$.msgBox(str,'warning');
							}
						}
					}
				}
				//删除非自有仓库
				else {
					$.msgBox(str, 'warning');
				}
			});
		}
		return false;
	}
});
