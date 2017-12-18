function uploadFileSuccess() {
    // $.jump("/products");
}
function doDeleteFile(fileId) {
}

function withParam() {
    var param = {};
    var supplier_id = $('.supplier').val();
    $('.supplier').removeClass('error-border');
    if (supplier_id == -1) {
        param = {};
    } else {
        param['supplierId'] = supplier_id;
    }
    if ($('#price_code').length) {
        var code = '';
        $('#price_code i.fa-check-square').each(function () {
            if (!$(this).hasClass('hidden')) {
                code = $(this).attr('value');
            }
        });
        param['code'] = code;
    }
    if ($('#price_name').length) {
        var name = $('#price_name').val();
        if (name == '') {
            $('#price_name').addClass('error-border');
            $.msgBox('请输入价格名称', 'warning');
            return false;
        }
        param['name'] = name;
    }
    return param;
}
$(document).ready(function () {
    var product_table = $('#product_table').DataTable({
        "ajax": {
            url: "/products",
            headers: {
                "Accept": "application/json"
            }
        },
        "scrollCollapse": true,
        "rowId": 'id',
        "processing": true,
        "searching": true,
        "ordering": false,
        "paging": true,
        "pagingType": "full_numbers",
        "serverSide": true,
        "pageLength": 25,
        "language": language,
        "columnDefs": [
            {
                "data": "product.code",
                "targets": 0,
                "defaultContent": "",
                "searchable": true,
            },
            {
                "data": "product.name",
                "targets": 1,
                "defaultContent": '',
            },
            {
                "data": "product.parts.code",
                "targets": 2,
                "defaultContent": '',
            },
            {
                "data": "product.inventory",
                "targets": 3,
                "defaultContent": '',
            },
            /*{ 	"data": function(data){
             if(data.price){
             return $.formatPrice(data.price);
             }
             return null;
             },
             "targets":4,
             "autoWidth":"true",
             "width":"20%",
             },*/
            {
                "data": null,
                "targets": 4,
                "visible": false,
                "defaultContent": '',
                "width": "5%"

            },
            {
                "data": null,
                "targets": 5,
                "visible": false,
                "defaultContent": '',
                "width": "5%"

            },
            {
                "data": null,
                "targets": 6,
                "visible": false,
                "defaultContent": '',
                "width": "5%"

            },
            {
                "data": null,
                "targets": 7,
                "visible": false,
                "defaultContent": '',
                "width": "5%"

            },
            {
                "data": null,
                "targets": 8,
                "visible": false,
                "defaultContent": '',
                "width": "5%"

            },
            {
                "data": "price",
                "defaultContent": '',
                "targets": 9,
                "visible": false
            },
            {
                "data": "merchant.id",
                "targets": 10,
                "defaultContent": '',
                "visible": false,
                "searchable": true
            },

            {
                "data": function (data) {
                    return '<button class="btn btn-primary btn-sm btn-edit" value="' + data.id + '">编辑</button>'
                        + '<button class="btn btn-primary btn-sm btn-delete" value="' + data.id + '">删除</button>';
                },
                "targets": 11,
            },

        ],
        "info": false
    }).on('init.dt', function (e, settings, json) {
    }).on('draw.dt', function (e, settings) {
        $.renderName(product_table, 'parts', 'parts.id', [{'col': 2, 'name': 'code'}]);
        /*for(var i=4; i<10; i++){
         product_table.columns(i).visible(false);
         };
        function render_price_header() {
            $.mask();
            var columns_index = 4;
            var sup_id = $.current_supplier_id;
            if (settings.json.addon) {
                product_table.columns(11).visible(true);
                $.profiles = {};
                $.each(settings.json.addon.profile, function (i, v) {
                    var columns_id = v.id;
                    $.profiles['profile_' + columns_id] = columns_index;
                    product_table.columns(columns_index).visible(true);
                    product_table.columns(columns_index).header().to$().text(v.name).css('background-color', "#" + v.code);
                    columns_index++;
                });
                $.each(settings.json.data, function (row_id, v) {
                    $.get('/product/price/' + v.id + (sup_id ? '/' + sup_id : ''), function (data) {
                        if (data.success) {
                            $.each(data.data, function (i, v) {
                                var column_index = $.profiles['profile_' + v.profile.id];
                                product_table.cell(row_id, column_index).node().innerText = $.formatPrice(v.price);
                            });
                        }
                    });
                });
                $.hideMask();
            } else {
                product_table.columns(9).visible(true);
                product_table.columns(11).visible(false);
                $.hideMask();
            }
        }*/
        //render_price_header();  !!old code
        var price_name = {};
        function render_price() {
            $.get('/product/profile', function (price_columns) {
                if (price_columns.success) {
                    var col_ind = 4;
                    var profile = {};
                    $.each(price_columns.data, function (i, child_col) {
                        profile['profile' + child_col.code] = col_ind;
                        price_name['name' + child_col.code] = child_col.name;
                        product_table.columns(col_ind).visible(true);
                        product_table.columns(col_ind).header().to$()
                            .text(child_col.name)
                            .css('color', "#" + child_col.code);
                        col_ind++;
                    });
                    $.each(settings.json.data, function (row_ind, row_data) {
                        $.each(row_data.prices, function (i, sin_price) {
                            product_table.cell(row_ind, profile['profile' + sin_price.code])
                                .node()
                                .innerText = $.formatPrice(sin_price.price);
                        });
                    });
                }
            });
        }

        render_price();
        $('#product_table ').on('click', '.btn-edit', function () {
            var pid = $(this).attr('value');
            var _csrf = $('#__csrf').attr('value');
            $.get('/product/' + pid, function (data) {
                var prod = data.data[0];
                var is_edit = (data.data[0].prices[0].flag & STATES.LOCKED) > 0 ? true : false;
                var opt = {
                    "id": "product_info",
                    "title": "产品信息",
                    "width": 650,
                    "height": 500,
                    "level": "info",
                    "closeIcon": true
                };
                opt.content = '<form id="product_update" class="form-horizontal" action="/product" method="post">'
                    + '<div class="box-body">'
                    //+ '<input type="hidden" name="_csrf" value="'+ _csrf + '">'
                    + '<input type="hidden" name="supplier.id">'
                    + '<input type="hidden" name="id">'
                    + '<div class="form-group">'
                    + '<label for="code" class="col-sm-2 control-label">编码</label>'
                    + '<div class="col-sm-8">'
                    + '<input type="text" class="form-control" name="code" id="code" placeholder="产品编码" >'
                    + '</div>'
                    + '</div>'
                    + '<div class="form-group">'
                    + '<label for="name" class="col-sm-2 control-label">名称</label>'
                    + '<div class="col-sm-8">'
                    + '<input type="text" class="form-control" name="name" id="name" placeholder="产品名称" >'
                    + '</div>'
                    + '</div>'
                    /*+ '<div class="form-group">'
                     + '<label for="price" class="col-sm-2 control-label">售价</label>'
                     + '<div class="col-sm-8">'
                     + '<input type="text" class="form-control"  name="price" id="price" placeholder="产品价格" >'
                     + '</div>'
                     + '</div>'*/
                    + '<div class="form-group">'
                    + '<label for="inventory" disabled class="col-sm-2 control-label">库存数量</label>'
                    + '<div class="col-sm-8">'
                    + '<input type="text" class="form-control" name="inventory" id="inventory" placeholder="库存数量">'
                    + '</div>'
                    + '</div>'
                    + '</div>'
                    + '<div class="box-footer">'
                    + '<button type="submit" class="btn btn-primary btn-sm btn-confirm">确定</button>'
                    + '</div>'
                    + '</form>';
                module = $.doModule(opt, function (module) {
                    module.find('.error').remove();
                    module.find('input[name="id"]').val(prod.product.id);
                    module.find('input[name="code"]').val(prod.product.code)
                        .attr('disabled',true);
                    module.find('input[name="name"]').val(prod.product.name)
                        .attr('disabled',is_edit?true:false);
                    // module.find('input[name="price"]').val($.formatPrice(prod.price));
                    module.find('input[name="inventory"]').val(prod.product.inventory)
                        .attr('disabled',is_edit?true:false);
                    // module.find('input[name="supplier.id"]').val(prod.product.supplier.id);
                    module.find('.pri-div').remove();
                    $.each(price_name,function (i,sin_pri_name) {
                        var s_div = $('<div>').addClass('form-group pri-div')
                            .append($('<label>').addClass('col-sm-2 control-label')
                                .css('color','#'+i.substring(4,10))
                                .text(sin_pri_name))
                            .append($('<div>').addClass('col-sm-8')
                                .append($('<input>').addClass('form-control pri-arr')
                                    .attr({type:'text',name:i})));
                        if(sin_pri_name == '成本价')
                            s_div.find("input[name='nameFF0000']").attr('disabled',is_edit?true:false);
                       module.find('#product_update .box-body .form-group:last-child').before(s_div);
                    });
                    $.each(prod.prices,function (i,v) {
                        module.find('input[name=name'+v.code+']').val(v.price);
                    });
                    var new_price = [];
                    $("#product_update .btn-confirm").unbind().on('click', function (e) {
                      //  $.mask();
                        e.preventDefault();
                        var old_price = {};
                        prod.product.code = module.find('input[name="code"]').val();
                        prod.product.name = module.find('input[name="name"]').val();
                        prod.product.inventory = module.find('input[name="inventory"]').val();
                        $('#product_update .pri-arr').each(function () {
                            var _this = $(this);
                            if($(this).val() != ''){
                                $.each(prod.prices, function (i,va) {
                                   if(_this.attr('name').substring(4,10) == va.code){
                                       va.price = _this.val();
                                       new_price.push(va);
                                       return;
                                   }
                                   var pri = {code:_this.attr('name').substring(4,10),price:_this.val()};
                                   new_price.push(pri);
                                });
                            }
                        });
                        /*module.find('input[type="text"]').each(function () {
                            if ($(this).val() == '') {
                                if ($(this).siblings('span').length == 0) {
                                    $(this).addClass("has-error");
                                    $(this).after('<span class="error">字段不允许为空</span>');
                                }
                            } else {
                                $(this).removeClass("has-error");
                                $(this).siblings('span').remove();
                            }
                        });*/
                        if (module.find('.error').length > 0) {
                            return false;
                        }
                        prod.prices = new_price;
                        var post_data = [];
                        post_data.push(prod);
                        console.log(post_data);
                        $.ajax({
                            "url": "/product",
                            "method": "put",
                            "data": post_data,
                            "success": function (data) {
                                module.find('.btn-box-tool').trigger('click');
                                $.msgBox(data.message);
                                $.reloadData(product_table);
                                $.hideMask();
                            }
                        });
                    });

                });
            });
        });
        /*$('#product_table .btn-delete').each(function(i){
         $(this).unbind().bind('click', function(){
         $.deleteConfirm(function(){
         $.mask();
         var pid = $('#product_table .btn-delete').eq(i).attr('value');
         $.ajax({
         "url":'/product/' + pid,
         "method":"delete",
         "success":function(data){
         $.msgBox(data.message);
         $.reloadData(product_table);
         $.hideMask();
         }
         });
         });
         });
         });*/
        $('#product_table').on('click', '.btn-delete', function () {
            $.deleteConfirm(function () {
                $.mask();
                var pid = $('#product_table .btn-delete').attr('value');
                $.ajax({
                    "url": '/product/' + pid,
                    "method": "delete",
                    "success": function (data) {
                        $.msgBox(data.message);
                        $.reloadData(product_table);
                        $.hideMask();
                    }
                });
            });
        });
    });
    /**
     * 筛选框设置(名称,label,关联查询列)
     * name = [merchant] auto complete
     */
    (function () {
        $.createSearch([{"name": "code", "label": "code", "col": 0}], product_table,
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
    $('.table').on('focus', 'input', function () {
        $(this).removeClass('error-border');
    });
    // 默认添加空行
    if ($('.add-prod-form').length) {
        // var opt = {'code': 'code','attr':'inventory'};
        $.addRows(10, $('.table'));
        $.formSubmit({
            'elem': $('.add-inventory-form'),
            'url': '/products/inventory',
            'method': 'POST',
            'warehouse': $('.supplier'),
            'second': 'inventory',
            'tooltip': {
                'message1': '请输入配件编号',
                'message2': '请输入数量',
                'message3': '配件编号只包含数字和字母',
                'message4': '数量只能是大于0的整数',
            },
            'data': [
                {
                    "optional": false,
                    "validator": /^[a-z,A-Z,\d]+$/
                },
                {
                    "optional": false,
                    "validator": /^[1-9]\d*$/
                }
            ]
        });
        $.uploadFile($('#upload_inventory_file'), {code: 'code', inventory: 'inventory'});
    }
    if ($('.add-price-form').length) {
        // var opt = {'code': 'code','attr':'price'};
        $.addRows(10, $('.table'));
        $.formSubmit({
            'elem': $('.add-price-form'),
            'url': '/products/price',
            'method': 'POST',
            'warehouse': $('.supplier'),
            'second': 'price',
            'code': $('#price_code'),
            'name': $('#price_name'),
            'tooltip': {
                'message1': '请输入配件编号',
                'message2': '请输入价格',
                'message3': '配件编号只包含数字和字母',
                'message4': '价格只能是大于0的数字',
            },
            'data': [
                {
                    "optional": false,
                    "validator": /^[a-z,A-Z,\d]+$/
                },
                {
                    "optional": false,
                    "validator": /^(0|[1-9][0-9]{0,9})(\.[0-9]+)?$/
                }
            ]
        });
        $.uploadFile($('#upload_price_file'), {code: 'code', price: 'price'});
    }
    // 点击添加空行
    $('.form-horizontal').on('click', '.btn-add', function () {
        $.addRows(10, $('.table'));
    });

    /**
     * 库存上传
     */

    // $.uploadFile($('#upload_inventory_file'),{code: 'code',inventory:'inventory'});
    $('#batch_import').click(function () {
        $.searchCode(window.location.href);
        window.addEventListener('message', function (event) {
            $('#model-mask').modal('hide');
            $('.table-products tbody tr').each(function (i, v) {
                $(this).find('td').eq(0).find('input').val(event.data[i]);
                if (i > event.data.length) {
                    $.addRows(1, $('.table'));
                }
            });
        }, false);
    });
    // }
    // if($('.add-price-form').length){
    // var opt = {'code': 'code','attr':'price'};
    /**
     * 价格上传
     */
    // 	$.addRows(10,$('.table'));
    function render_supplier(e) {
        $.get('/merchant/warehouses', function (data) {
            if (data.success) {
                var html = '<option value="-1">自有仓库</option>';
                $.each(data.data, function (i, sup) {
                    html += '<option value="' + sup.id + '">' + sup.name + "</option>";
                });
                $(e).append(html);
            }
        });
    }

    render_supplier($('.supplier'));
    // };
    $('#batch_import').click(function () {
        $.addRows(1, $('.table'));
        $.searchCode();
        window.addEventListener('message', function (event) {
            var res_data_len = event.data.length;
            var tr_len = $('.table-products tbody tr').length;
            $('#model-mask').modal('hide');
            if (res_data_len > tr_len) {
                $.addRows(res_data_len - tr_len, $('.table'));
            }
            $('.table-products tbody tr').each(function (i, v) {
                $(this).find('td').eq(0).find('input').val(event.data[i]);
            });
        }, false);
    });
    /**
     * 价格上传
     */
	$('.table').on('focus', 'input', function(){
		$(this).removeClass('error-border');
	})
	//默认添加空行	
	if($('.add-prod-form').length){
		var opt = {'code': 'code','attr':'inventory'};
		$.addRows(10,opt);
	}
	if($('.add-price-form').length){
		var opt = {'code': 'code','attr':'inventory'}
		$.addRows(10,opt);
	}
	//点击添加空行
	$('.form-horizontal').on('click','.btn-add',function(){
		$.addRows(5,opt);
	})


    /**
     * 批量添加商品
     */
    $('#upload_file').change(function () {
        $('form.product-upload-file').submit();
    });


    //价格列表填充
    $.get('/data/product/price/code', function (json) {
        var data = json.data;
        if (data && data.length > 0) {
            var html = '';
            $.each(data, function (i, d) {
                html += '<li class="price-color"><i class="fa fa-fw fa-check-square hidden" value="' + d + '" style="color:#' + d + '"></i><i class="fa fa-fw fa-square" value="' + d + '" style="color:#' + d + '"></i></li>';
            });
            $('#price_code').append(html);
            $('#price_code li').first().find('i.fa-square').addClass('hidden');
            $('#price_code li').first().find('i.fa-check-square').removeClass('hidden');
            $('#price_code li').click(function () {
                $('#price_code').find('i.fa-check-square').addClass('hidden');
                $('#price_code').find('i.fa-square').removeClass('hidden');
                $(this).find('i.fa-square').addClass('hidden');
                $(this).find('i.fa-check-square').removeClass('hidden');
            });

            $('#price-code').append(html);
            $('#price-code li').first().find('i.fa-square').addClass('hidden');
            $('#price-code li').first().find('i.fa-check-square').removeClass('hidden');
            $('#price-code li').click(function () {
                $('#price-code').find('i.fa-check-square').addClass('hidden');
                $('#price-code').find('i.fa-square').removeClass('hidden');
                $(this).find('i.fa-square').addClass('hidden');
                $(this).find('i.fa-check-square').removeClass('hidden');
            });
            //上传价格
            /*(function () {
                var $price_color = {};
                var single_price;
                //默认自有仓库请求
                $.get('/product/profile', function (data) {
                    if (data.success) {
                        $.each(data.data, function (i, v) {
                            $price_color[v.code] = v.name;
                            single_price = $('#price_code li').first().find('i.fa-square').attr('value');
                            judgment_price(single_price);
                        });
                    } else {
                        $price_color = {};
                    }
                });

                $('.supplier').change(function () {
                    var $price_val = $(this).val();
                    $.get('/product/profile/' + $price_val, function (data) {
                        if (data.success) {
                            $.each(data.data, function (i, v) {
                                $price_color[v.code] = v.name;
                            });
                        } else {
                            $price_color = {};
                        }
                        judgment_price(single_price);
                    });
                });
                $('#price_code li').each(function () {
                    $(this).click(function () {
                        $('#price_code li .fa-check-square').each(function () {
                            if (!$(this).hasClass('hidden')) {
                                single_price = $(this).attr('value');
                                judgment_price(single_price);
                            }
                        });
                    });
                });
                function judgment_price(key) {
                    $('.price-name').val($price_color[key]);
                }
            })();*/
            /*(function () {
                $('#price_code li').each(function () {
                    $(this).click(function () {
                        $(this).find('i').each(function (i, v) {
                            if (!$(this).hasClass('hidden')) {
                                $.get('/product/profile/' + $(this).attr('value'), function (data) {
                                    if (data.success) {
                                        $('#price_name').val(data.data[0].name);
                                    } else {
                                        $('#price_name').val('');
                                    }
                                });
                            }
                        });
                    });
                });
            })();*/

        }
    });


    // 库存批量上传
    // $('#upload_inventory_file').load(function(){
    // 	if($('form.upload-file', $('#upload_inventory_file').contents()).length == 0){
    // 		// $('#upload_inventory_file').addClass('hidden');
    // 		var resp = $('body', $('#upload_inventory_file').contents()).text();
    // 		if(resp != '') {
    // 			var json = eval("(" + resp + ")");
    // 			if(json.success){
    // 				$.msgBox(json.message);
    // 			} else {
    // 				$.msgBox(json.message, 'warning');
    // 			}
    // 			json['addon'] && json['addon']['url'] && $('form.add-inventory-form').append('<div class="col-md-5 down-tpl error-product"><a href="' + json['addon']['url'] + '">错误产品列表</a></div>');
    // 			console.log(json.data);
    // 		}
    // 		var src = $('#upload_inventory_file').attr('src');
    // 		$('#upload_inventory_file').attr('src', src);
    // 	} else {
    // 		$('#upload_inventory_file').removeClass('hidden');
    // 	}
    // });
    //价格批量上传
    // $('#upload_price_file').load(function(){
    // 	if($('form.upload-file', $('#upload_price_file').contents()).length == 0){
    // 		$('#upload_price_file').addClass('hidden');
    // 		var resp = $('body', $('#upload_price_file').contents()).text();
    // 		if(resp != '') {
    // 			var json = eval("(" + resp + ")");
    // 			if(json.success){
    // 				$.msgBox(json.message);
    // 			} else {
    // 				$.msgBox(json.message, 'warning');
    // 			}
    // 			json['addon'] && json['addon']['url'] && $('form.add-price-form').append('<div class="col-md-5 down-tpl error-product"><a href="' + json['addon']['url'] + '">错误产品列表</a></div>');
    // 		}
    // 		var src = $('#upload_price_file').attr('src');
    // 		$('#upload_price_file').attr('src', src);
    // 	} else {
    // 		$('#upload_price_file').removeClass('hidden');
    // 	}
    // });
    // 导出到excel
    // $('.btn-derive').on('click',function(){
    // var param = {};
    // var list = $('.table tbody tr'),
    // 	index = 0;
    // for(var i=0;i<list.length;i++){
    // 	var inputList = $(list[i]).find('td input');
    // 	if($(inputList[0]).val()){
    // 		param['products['+ index +'].product.parts.code'] = $(inputList[0]).val();
    // 	}
    // 	if($(inputList[1]).val()){
    // 		param['products['+ index +'].product.inventory'] = $(inputList[1]).val();
    // 	}
    // 	if($(inputList[2]).val()){
    // 		param['products['+ index +'].product.message'] = $(inputList[1]).val();
    // 	}
    // 	index++;
    // }
    // console.log(param);
    // $.ajax({
    // 	"url":"/product/export",
    // 	"method":"post",
    // 	"traditional": true,
    // 	"data":param,
    // 	"success":function(data){
    // 		console.log(data);
    // 	}
    // })
    // var table = document.getElementsByClassName('table')[0];
    // return ExcellentExport.excel(table, 'datatable');
    // })
    // $('.btn-derive').click(function() {
    // 	/* bookType can be 'xlsx' or 'xlsm' or 'xlsb' or 'ods' */
    // 	var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };

    // 	var wb = XLSX.utils.table_to_book($(".table").get(0), {sheet:"Sheet Name"});
    // 	var wbout = XLSX.write(wb, wopts);

    // 	function s2ab(s) {
    // 		var buf = new ArrayBuffer(s.length);
    // 		var view = new Uint8Array(buf);
    // 		for (var i=0; i!=s.length; ++i)
    // 			view[i] = s.charCodeAt(i) & 0xFF;
    // 		return buf;
    // 	}

    // 	/* the saveAs call downloads a file on the local machine */
    // 	saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "test.xlsx");
    // });
	
	// 库存批量上传
	// $('#upload_inventory_file').load(function(){
	// 	if($('form.upload-file', $('#upload_inventory_file').contents()).length == 0){
	// 		// $('#upload_inventory_file').addClass('hidden');
	// 		var resp = $('body', $('#upload_inventory_file').contents()).text();
	// 		if(resp != '') {
	// 			var json = eval("(" + resp + ")");
	// 			if(json.success){
	// 				$.msgBox(json.message);
	// 			} else {
	// 				$.msgBox(json.message, 'warning');
	// 			}
	// 			json['addon'] && json['addon']['url'] && $('form.add-inventory-form').append('<div class="col-md-5 down-tpl error-product"><a href="' + json['addon']['url'] + '">错误产品列表</a></div>');
	// 			console.log(json.data);
	// 		}
	// 		var src = $('#upload_inventory_file').attr('src');
	// 		$('#upload_inventory_file').attr('src', src);
	// 	} else {
	// 		$('#upload_inventory_file').removeClass('hidden');
	// 	}
	// });
	//价格批量上传
	// $('#upload_price_file').load(function(){
	// 	if($('form.upload-file', $('#upload_price_file').contents()).length == 0){
	// 		$('#upload_price_file').addClass('hidden');
	// 		var resp = $('body', $('#upload_price_file').contents()).text();
	// 		if(resp != '') {
	// 			var json = eval("(" + resp + ")");
	// 			if(json.success){
	// 				$.msgBox(json.message);
	// 			} else {
	// 				$.msgBox(json.message, 'warning');
	// 			}
	// 			json['addon'] && json['addon']['url'] && $('form.add-price-form').append('<div class="col-md-5 down-tpl error-product"><a href="' + json['addon']['url'] + '">错误产品列表</a></div>');
	// 		}
	// 		var src = $('#upload_price_file').attr('src');
	// 		$('#upload_price_file').attr('src', src);
	// 	} else {
	// 		$('#upload_price_file').removeClass('hidden');
	// 	}
	// });
	$.uploadFile($('#upload_inventory_file'),{code: 'code',inventory:'inventory'});
	$.uploadFile($('#upload_price_file'),{code: 'code',price:'price'});
});