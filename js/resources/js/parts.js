$(document).ready(function(){
    var substitute_table = $("#substi_table").DataTable({
        "scrollCollapse": true,
        "rowId": 'id',
        "processing":false,
        "searching": true,
        "ordering": false,
        "paging": false,
        "serverSide":true,
        "deferLoading":0,
        "pagingType": "full_numbers",
        "pageLength": 25,
        "language":language,
        "columnDefs": [
            { 	"data": "code",
                "targets":0,
                "defaultContent":""
                //"searchable":true,
            },
            { 	"data": "name",
                "targets":1,
                "defaultContent":'',
            },
            { 	"data": "brand.name",
                "targets":2,
                "defaultContent":'',
            },
            { 	"data": "tags.1000",
                "targets":3 ,
                "defaultContent":'',
            },
            {
                "data":"",
                "defaultContent": '',
                "targets":4,

            },
            {
                "data":function (data) {
					return $.timestampToDate(data.createdTime);
                },
                "defaultContent": '',
                "targets":5,
            },
            {
                "data":null,
                "defaultContent": '',
                "targets":6,
            },
            {
                "data":null,
                "defaultContent": '',
                "targets":7,

            },
            {
                "data":null,
                "defaultContent": '',
                "targets":8,

            }
        ],
        "info" : false
    } ).on('init.dt', function(e, settings, json) {
    }).on('draw.dt', function (e, settings) {
    	function postMessage(d,row,col,type) {
			$.get('/data/user/'+d,function (data) {
			    if(type === 1){
			        data.name = $.timestampToDate(data.createdTime);
                }
			 	substitute_table.cell(row,col).node().innerText = data.name;
			 });
        }
    	$.renderName(substitute_table,'parts','brand.id',[{'col':2, 'name': 'code'}]);
    	$.each(settings.json.data,function (i,v) {
            postMessage(v.createdBy,i,4);
            if(v.modifiedBy !== undefined){
                postMessage(v.modifiedBy,i,6);
			}
			if(v.modifiedTime != undefined){
                postMessage(v.undefined,i,7,1);
            }
        });
    	$.hideMask();
    });
    $('#substisute_search').click(function () {
        var inp_val = $('#substisute_code').val();
        $.mask();
        substitute_table.ajax.url('/parts/substitute/'+inp_val).load();
    });




	// 车型车系选择
	$.carSelect = function(that){
		var id = $(that).find('option:selected').prop('value');
		switch($(that).prop('name')){
			case 'car_brand':
				if (id == -1){
					$(that).parent('td').next('td').find('select option').remove();
					$(that).parent('td').next('td').find('select').append('<option value="-1">请选择</option>');
					return;
				}
				$.get('/data/series/'+ id +'.json', function(data){
					$(that).parent('td').next('td').find('select[name="tags[1009]"]').find('option').remove();
					html = '<option value="-1">请选择</option>';
					$.each(data, function(index, value){
						html += '<option value="' + value.id + '">' + value.name + '</option>';
					});
					$(that).parent('td').next('td').find('select[name="tags[1009]"]').append(html).find('option').removeAttr('selected').first().prop('selected', true);
				});
				break;
		}
	}
	// 添加配件
	// $.get('/field/partsbrand', function(data){
	// 	html = '';
	// 	$.each(data, function(index, value){
	// 		html += '<option value="' + index + '">' + value + '</option>';
	// 	});
	// 	$('select[name="brand.id"]').append(html);
	// });
	// $.get('/field/category', function(data){
	// 	html = '';
	// 	$.each(data, function(index, value){
	// 		$.each(value,function(id,val){
	// 			html += '<option value="' + id + '">' + val + '</option>';
	// 		})
	// 	});
	// 	$('select[name="tags[1008]"]').append(html);
	// });
	$('.add-parts-form').submit(function(){
		// 添加配件校验
		var pass1 = $('.add-parts-form').find('#parts_code').validation({'no_blank':true,'check_code':true});
		var pass2 = $('.add-parts-form').find('#parts_name').validation({'no_blank':true});
		if(!pass1 || !pass2 ){
			return false;
		}
		$.mask();
		if($('input[type=checkbox]').is(':checked')){
			$('input[type=checkbox]').val('OE');
		}else{
			$('input[type=checkbox]').val('AM');
		}
		var param = $('.add-parts-form').serialize();
		$.ajax({
			"url":"parts",
			"method":"post",
			"data":param,
			"success":function(data){
				if(data.success){
					$.msgBox(data.info);
					$('.add-parts-form').find('input[type="text"]').val('');
				} else {
					$.msgBox(data.info, 'warning');
				}
				$.hideMask();
			}
		});
	})
	//根据配件编号搜索配件信息
	$('#parts_search').on('click',function(){
		$('tbody').html('');
		var val = $('#parts_code').val(),
			html = '',
			arr = [],
			opt = {},
			content = '';
		$.ajax({
			type: "POST",
			url: "/parts/info",
			data: {partsCodes:val},
			success: function(data){
				for(var i=0; i<data.data.length; i++){
					var code = data.data[i].code;
					content = data.data[i];
					if(!opt[code]){
						(function(code,content){
							$.get('/data/category/'+content.tags[1008],function(data){
								arr.push(code);
								opt[code] = 1;
								data.name = data.name || '无',
								content.tags[1005] = content.tags[1005] || '无';
								html = '<tr>'
								+ '<td>'+ code +'</td>'
								+ '<td>'+ content.name +'</td>'
								+ '<td>'+ content.brand.name +'</td>'
								+ '<td>'+ data.name +'</td>'
								+ '<td>'+ content.tags[1000] +'</td>'
								+ '<td>'+ content.tags[1005] +'</td>'
								+ '</tr>';
								$('tbody').append(html);
							})
						})(code,content)
					}
				}
			}
		})
	})
	ref();
	function ref(){
		$.get('/field/partsbrand', function(data){
			var html = '<option value="-1">清选择</option>';
			$.each(data, function(index, value){
				html += '<option value="' + index + '">' + value + '</option>';
			});
			$('select[name="brand.id"]').append(html);
		});
		$.get('/field/category', function(data){
			var html = '<option value="-1">清选择</option>';
			$.each(data, function(index, value){
				$.each(value,function(id,val){
					html += '<option value="' + id + '">' + val + '</option>';
				})
			});
			$('select[name="tags[1008]"]').append(html);
		});
		$.get('/data/brand.json', function(data){
			var html = '<option value="-1">清选择</option>';
			$.each(data, function(index, value){
				html += '<option value="' + value.id + '">' + value.name + '</option>';
			});
			$('select[name="car_brand"]').append(html);
		});
	}
	//批量上传

	// if($('.table tbody').length){
	// 	console.log(0);
	// 	addRow(10);
	// }
	// $('.form-horizontal').on('click',function(){
	// 	addRow(5);
	// })
	// function addRow(i){
	// 	var tb = $('.table tbody');
	// 	for(var j=0; j<i; j++){
	// 		tb.append('<tr>'
	// 				+'<td><input type="text" class="form-control table-input "></td>'
	// 				+'<td><input type="text" class="form-control table-input "></td>'
	// 				+'<td><input type="text" class="form-control table-input "></td>'
	// 				+'<td><input type="text" class="form-control table-input "></td>'
	// 				+'</tr>');
	// 	}
	// }
	$.addRow = function(i,opt){
		var tr = '<tr>'
				+ '<td><input type="text" class="form-control table-input "></td>'
				+ '<td><input type="text" class="form-control table-input "></td>'
				+ '<td><select class="form-control select2 select2-hidden-accessible" name="brand.id"></td>'
				+ '<td><select class="form-control select2 select2-hidden-accessible" name="tags[1008]"></td>'
				+ '<td><select class="form-control select2 select2-hidden-accessible" name="car_brand"></td>'
				+ '<td><select class="form-control select2 select2-hidden-accessible" name="tags[1009]"></td>'
				+ '<td><input type="checkbox" name="tags[1000]" value="AM">OE</td>'
				+'</tr>';
		for(var j=0; j<i;j++){
			opt.append(tr);
		}
	}
	$('.table').on('change','select[name="car_brand"]',function(){
		$.carSelect(this);
	})
	// if($('.parts-table').length){
	// 	$.addRow(10,$('.parts-table tbody'));
	// 	$('.form-horizontal').on('click','.btn-add',function(){
	// 		$.addRow(5,$('.parts-table tbody'));
	// 		ref();
	// 	});
	// 	$.formSubmit({
	// 	'elem':$('#inventory_parts form'),
	// 	'url': '/parts',
	// 	'method':'POST',
	// 	'tooltip': {
	// 		'message1':'请输入配件编号',
	// 		'message3':'配件编号只包含数字和字母'
	// 	},
	// 	'data':[
	// 		{
	// 			"optional": false,
	// 			"validator":/^[a-z,A-Z,\d]+$/
	// 		},
	// 		{
	// 			"optional": false
	// 		}
	// 	]
	// })
	// 	$.uploadFile($('#upload_parts_file'),{code: 'code',inventory:'inventory'});
	// };
	// if($('.add-substitute').length){
	// 	$.addRows(10,$('.add-substitute'));
	// 	$('.form-horizontal').on('click','.btn-add',function(){
	// 		$.addRows(5,$('.add-substitute'));
	// 	});
	// 	$.formSubmit({
	// 	'elem':$('#add_inventory form'),
	// 	'url': '/parts/substitute',
	// 	'method':'POST',
	// 	'tooltip': {
	// 		'message1':'请输入配件编号',
	// 		'message2':'请输入替换配件编号',
	// 		'message3':'配件编号只包含数字和字母',
	// 		'message4':'配件编号只包含数字和字母'
	// 	},
	// 	'data':[
	// 		{
	// 			"optional": false,
	// 			"validator":/^[a-z,A-Z,\d]+$/
	// 		},
	// 		{
	// 			"optional": false,
	// 			"validator":/^[a-z,A-Z,\d]+$/
	// 		}
	// 	]
	// })
	// 	$.uploadFile($('#upload_substitute_file'),{code: 'code',price:'price'});
	// }



	//导出excel
	// $('.btn-derive').on('click',function(){
	// 	var param = {};
	// 	var list = $('.table tr'),
	// 		index = 0;
	// 	for(var i=0;i<list.length;i++){
	// 		var inputList = $(list[i]).find('td input');
	// 		if($(inputList[0]).val()){
	// 			param['uploads['+ index +'].product.parts.code'] = $(inputList[0]).val();
	// 		}
	// 		if($(inputList[1]).val()){
	// 			param['uploads['+ index +'].product.parts.code'] = $(inputList[1]).val();
	// 		}
	// 		if($(inputList[2]).val()){
	// 			param['uploads['+ index +'].product.parts.brand'] = $(inputList[2]).val();
	// 		}
	// 		if($(inputList[3]).val()){
	// 			param['uploads['+ index +'].product.parts.tags[1008]'] = $(inputList[3]).val();
	// 		}
	// 		if($(inputList[4]).val()){
	// 			param['uploads['+ index +'].product.parts.tags[1000]'] = $(inputList[4]).val();
	// 		}
	// 		index++;
	// 	}
	// 	console.log(param);
	// 	$.ajax({
	// 		"url":"/product/export",
	// 		"method":"post",
	// 		"traditional": true,
	// 		"data":param,
	// 		"success":function(data){
	// 			console.log(data);
	// 		}
	// 	})
	// })
})