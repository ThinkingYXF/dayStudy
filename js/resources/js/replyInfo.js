$(document).ready(function(){
    if(location.pathname.match(/\/(\d+)$/).length)
        var replyId = location.pathname.match(/\/(\d+)$/)[1];
    var merchantId = $('.inquire-name').html();
    var tuColumns = [{
        title: '需求编号',
        data: 'code',
        editor: {
            type: 'input',
            className: 'form-control',
            readonly: 'readonly',
            validator: function(value) {
                return $.trim(value) != '';
            }
        }
    }, {
        title: 'id',
        data: 'id',
        className: 'hidden',
        editor: {
            type: 'input',
            readonly: 'readonly',
            name: 'codes[{}].originId',
        }
    },{
        title: '需求数量',
        data: 'quantity',
        editor: {
            className: 'form-control',
            readonly: 'readonly',
            validator: /^\d+$/
        }
    },{
        title: '配件编号',
        data: 'originCode.code',
        editor: {
            type: 'input',
            className: 'form-control',
            readonly: 'readonly',
            validator: function(value) {
                return $.trim(value) != '';
            }
        }
    }, {
        title: '配件数量',
        data: 'originCode.quantity',
        editor: {
            className: 'form-control',
            readonly: 'readonly',
            validator: /^\d+$/
        }
    }, {
		title: '配件价格',
        data: 'price',
		editor: {
			className: 'form-control',
            readonly: 'readonly',
			validator: /^(0|[1-9][0-9]{0,9})(\.[0-9]+)?$/
		}
	}, 
    {
		title: '备注',
        data: '.comment',
		editor: {
			className: 'form-control',
            readonly: 'readonly'
		}
	}
    // , {
    //     title: '提示信息',
    //     data: 'er详情ror',
    //     className: 'error-msg',
    //     visible: false
    // }
    ];
    $.ajax({
        url:"/reply/" + replyId,
        method:"GET",
        success:function(json){
            var list = [];
            $.each(json.data,function(key,val){
                list.push(val);
            });
            $('#table_container').tableUpload({
                //url: '/some/url/to/post/to',
                url: function() {
                    return "/price/reply" 
                },
                columns: tuColumns,
                data: list,
                appendable: false
                // outerFields: function() {
                //     return {
                //         originId: inquireId
                //     };
                // }
            });
        }
    })
});