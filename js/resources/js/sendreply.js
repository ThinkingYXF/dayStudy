
$(document).ready(function(){
	var tuColumns = [{
		title: '配件编号',
		data: 'code',
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
		data: 'quantity',
		editor: {
			name: 'uploads[{}].code.quantity',
			validator: /^\d+$/,
			className: 'form-control',
		}
	}, {
		title: '价格',
		data: 'price',
		editor: {
			name: 'uploads[{}].code.price',
			validator: /^(0|[1-9][0-9]{0,9})(\.[0-9]+)?$/,
			className: 'form-control',
		}
	},
	
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
    var list = [];
     $.get('/message/codes/'+ $('#message_id').val(),function(json){
        if($.isArray(json.data)){
             $.each(json.data,function(i,val){
                list.push(val);
            })
            $('#table_container').tableUpload({
                // url: '/some/url/to/post/to',
            
                url: function() {
                    return "/message";
                },
                columns: tuColumns,
                data: list,
                outerFields: function() {
                    $.each($('.form-group .form-control'),function(i,val){
                        if($(val).val() == ''){
                            $(val).addClass('error');
                            return false;
                        }
                    })
                    return {
                        name: $('#title').val(),
                        content: $('#compose-textarea').val() ,
                        merchantId: $('#merchant_typehead').val(),
                        userId: $('#user_typeahead').val()
                    }
                }
            });
        }
     });
})