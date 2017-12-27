
$(document).ready(function(){
	var tuColumns = [{
		title: '配件编号',
		data: 'code.code',
		editor: {
			type: 'input',
			name: 'uploads[{}].code.code',
			className: 'form-control',
			validator: function(value) {
				return $.trim(value) != '';
			}
		}
	}, {
		title: '数量',
		data: 'code.quantity',
		editor: {
			name: 'uploads[{}].code.quantity',
			validator: /^\d+$/,
			className: 'form-control',
		}
	}, {
		title: '价格',
		data: 'code.price',
		editor: {
			name: 'uploads[{}].code.price',
			validator: /^(0|[1-9][0-9]{0,9})(\.[0-9]+)?$/,
			className: 'form-control',
		}
	},
	// ,{
	// 	title: '分类',
	// 	data: 'product.parts.tags.1008',
	// 	editor: {
	// 		type: 'select',
	// 		name: 'uploads[{}].product.parts.tags.1008',
	// 		source: {
	// 			url: '/field/category',
	// 			//root: '',
	// 			value: 'id',
	// 			text: 'name'
	// 		},
	// 		className: 'form-control select2 select2-hidden-accessible',
	// 		options: {
	// 			'': '请选择'
	// 		},
	// 		optional:true
	// 	}
	// }, {
	// 	title: '品牌',
	// 	data: 'product.parts.brand.id',
	// 	editor: {
	// 		type: 'select',
	// 		name: 'uploads[{}].product.parts.brand.id',
	// 		source: {
	// 			url: '/field/partsbrand',
	// 			//root: '',
	// 			value: 'id',
	// 			text: 'name'
	// 		},
	// 		className: 'form-control select2 select2-hidden-accessible',
	// 		options: {
	// 			'': '请选择'
	// 		},
	// 		optional:true
	// 	}
	// },
	{
		title: '备注',
		data: 'comment',
		editor: {
			name: 'uploads[{}].comment',
			className: 'form-control',
		}
	}
	// ,{
	// 	title: '提示信息',
	// 	data: 'error',
	// 	className: 'error-msg',
	// 	visible: false
	// } 
	];
	$('#table_container').tableUpload({
		// url: '/some/url/to/post/to',
		url: function() {
			return "/message";
	// var recipient = $.get_url('mername');
	// var repname = $.get_url('repname');
	// if(recipient && repname){
	// 	$('#user_typeahead').val(repname);
	// 	$('#merchant_typehead').val(recipient);
	},
    // addRows(10);
    // function addRows(i){
    //     var tb = $('.table-message tbody');
    //     for(var j=0; j<i; j++){
    //         tb.append('<tr>'
    //                     +'<td><input type="text" class="form-control table-input code"></td>'
    //                     +'<td><input type="text" class="form-control table-input"></td>'
    //                     +'<td><input type="text" class="form-control table-input"></td>'
    //                     +'</tr>');
    //     }
    // }
    // $.formSubmit({
    //     'elem':$('#msg_form'),
	// 	'url': '/message',
	// 	'method':'POST',
	// 	'tooltip': {
	// 		'message1':'请输入配件编号',
	// 		'message2':'请输入替换配件编号',
	// 		'message3':'配件编号只包含数字和字母',
	// 		'message4':'数量只能是大于0的整数',
	// 		'message5':'价格只能是大于0的数字',
	// 	},
		columns: tuColumns,
		data: [],
		outerFields: function() {
			$.each($('.form-group .form-control'),function(i,val){
				if($(val).val() == ''){
					$(val).addClass('error');
					return false;
				}
			})
			return {
				// user: {
				// 	name: $('#received_person').val(),
				// },
				// merchant: {
				// 	name: $('#company').val(),
				// },
				// recipient: {
				// 	message: {
				// 		name: $('title').val()
				// 	}
				// }
				name: $('#title').val(),
				content: $('#compose-textarea').val() ,
				merchantId: $('#input_merchant').val(),
				userId: $('#input_user').val()

			}
		}
	});
    // addRows(10);
    // function addRows(i){
    //     var tb = $('.table-message tbody');
    //     for(var j=0; j<i; j++){
    //         tb.append('<tr>'
    //                     +'<td><input type="text" class="form-control table-input code"></td>'
    //                     +'<td><input type="text" class="form-control table-input"></td>'
    //                     +'<td><input type="text" class="form-control table-input"></td>'
    //                     +'</tr>');
    //     }
    // }
    // $.formSubmit({
    //     'elem':$('#msg_form'),
	// 	'url': '/message',
	// 	'method':'POST',
	// 	'tooltip': {
	// 		'message1':'请输入配件编号',
	// 		'message2':'请输入替换配件编号',
	// 		'message3':'配件编号只包含数字和字母',
	// 		'message4':'数量只能是大于0的整数',
	// 		'message5':'价格只能是大于0的数字',
	// 	},
	// 	'data':[
	// 		{
	// 			"optional": false,
	// 			"validator":/^[a-z,A-Z,\d]+$/
	// 		},
	// 		{
	// 			"optional": false,
	// 			"validator":/^[1-9]\d*$/
	// 		},
    //         {
	// 			"optional": true,
	// 			"validator":/^(0|[1-9][0-9]{0,9})(\.[0-9]+)?$/
	// 		}
	// 	]
    // });
	// $.uploadFile($('#message_file'),{code: 'code',price:'price'});
})