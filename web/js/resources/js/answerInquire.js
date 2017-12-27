$(document).ready(function(){
    if(location.pathname.match(/\/(\d+)$/).length)
        var inquireId = location.pathname.match(/\/(\d+)$/)[1];
    var merchantId = $('.inquire-name').html();
    var tuColumns = [{
        title: '需求编号',
        data: 'code',
        editor: {
            type: 'input',
            className: 'form-control',
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
            name: 'codes[{}].originId',
        }
    },{
        title: '需求数量',
        data: 'quantity',
        editor: {
            className: 'form-control',
            validator: /^\d+$/
        }
    },{
        title: '配件编号',
        data: 'codes[{}].code',
        editor: {
            type: 'input',
            name: 'codes[{}].code',
            className: 'form-control',
            validator: function(value) {
                return $.trim(value) != '';
            }
        }
    }, {
        title: '配件数量',
        data: 'quantity',
        editor: {
            name: 'codes[{}].quantity',
            className: 'form-control',
            validator: /^\d+$/
        }
    }, {
		title: '配件价格',
        data: 'codes[{}].price',
		editor: {
			name: 'codes[{}].price',
			className: 'form-control',
			validator: /^(0|[1-9][0-9]{0,9})(\.[0-9]+)?$/
		}
	}, {
		title: '备注',
        data: 'codes[{}].comment',
		editor: {
			name: 'codes[{}].comment',
			className: 'form-control'
		}
	}
    // , {
    //     title: '提示信息',
    //     data: 'error',
    //     className: 'error-msg',
    //     visible: false
    // }
    ];
    $.ajax({
        url:"/price/inquire/reply/" + inquireId,
        method:"GET",
        success:function(json){
            var list = [];
            $.each(json.data,function(key,val){
                $.each(val.codes,function(i,child){
                    list.push(child);
                })
            })
            
            $('#table_container').tableUpload({
                //url: '/some/url/to/post/to',
                url: function() {
                    return "/price/inquire/reply" 
                },
                columns: tuColumns,
                data: list,
                outerFields: function() {
                    return {
                        originId: inquireId
                    };
                }
            });
        }
    })
});