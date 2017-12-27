$(document).ready(function(){
    if(location.pathname.match(/\/(\d+)$/).length)
        var quoteId = location.pathname.match(/\/(\d+)$/)[1];
    var tuColumns = [{
		title: '配件号',
		data: 'code',
		className: 'code table-td',
		editor: {
			type: 'input',
			name: 'codes[{}].code',
			className: 'form-control',
            readonly: 'readonly',
			validator: function(value) {
				return $.trim(value) != '';
			},
			optional:false
		}
	}, {
		title: '数量',
		data: 'quantity',
		className: 'quantity table-td ',
		editor: {
			name: 'codes[{}].quantity',
			className: 'form-control',
            readonly: 'readonly',
			validator: /^\d+$/,
			optional:false
		}
	}, {
		title: '价格/件',
		data: 'price',
		className: 'quantity table-td ',
        // render: function(data){
        //     return $.formatPrice(data.paddClassrice);
        // },
		editor: {
			name: 'codes[{}].quantity',
			className: 'form-control',
            readonly: 'readonly',
		}
	}, {
		title: '名称',
		data: 'parts.name',
		className: 'quantity table-td ',
		editor: {
			name: 'codes[{}].quantity',
			className: 'form-control',
            readonly: 'readonly',
		}
	}, {
		title: '类别',
		data: 'parts.tags.1000',
		className: 'quantity table-td ',
		editor: {
			name: 'codes[{}].quantity',
			className: 'form-control',
            readonly: 'readonly',
		}
	}, {
		title: '品牌',
		data: 'parts.brand.name',
		className: 'quantity table-td ',
		editor: {
			name: 'codes[{}].quantity',
			className: 'form-control',
            readonly: 'readonly'
		}
	}];
    $.get('/price/merchant/quoteInfo/' + quoteId,function(json){
        var arr = [];
        $.each(json.data,function(i,val){
            $.each(val.codes,function(i,opt){
                arr.push(opt);
                 $('#table_container').tableUpload({
                    columns: tuColumns,
                    data: arr,
                    appendable: false,
                });
            })
        })
    })
   
})