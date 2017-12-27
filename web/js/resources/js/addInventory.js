$(document).ready(function(){
    var option = {
        header:[
            {
                label: "仓库",
                select: 'supplier'
            }
        ],
        body: [
            {
                header:"配件编号",
                optional:false,
                validator: /^[a-z,A-Z,\d]+$/,
            },
            {
                header:"数量",
                optional:false,
                validator: /^(0|[1-9][0-9]{0,9})(\.[0-9]+)?$/,
            }
        ],
        footer: {
            jump:"/data/download/inventory",
            url: "/product/inventory/upload"
        },
        url: '/products/inventory',
		method:'POST',
		warehouse: $('.supplier'),
		second: 'inventory',
		tooltip: {
			message1:'请输入配件编号',
			message2:'请输入数量',
			message3:'配件编号只包含数字和字母',
			message4:'数量只能是大于0的整数',
		}
    };
    $("#add_product").createForm();
    $(".form-horizontal").createHeader(option);
    $(".form-group .col-md-5").createSelect(option);
    $(".form-horizontal").createTable();
    $("thead").createTr(1);
    $("thead tr").createTh(option);
    $("tbody").createTr(10);
    $("tbody tr").createTd(2);
    $(".form-horizontal").createFooter(option);
	render_supplier($('.supplier'));
    var opt = {
        'url': '/products/inventory',
		'method':'POST',
		'warehouse': $('.supplier'),
		'second': 'inventory',
		'tooltip': {
			'message1':'请输入配件编号',
			'message2':'请输入数量',
			'message3':'配件编号只包含数字和字母',
			'message4':'数量只能是大于0的整数',
		},
		'data':[
			{
				"optional": false,
				"validator":/^[a-z,A-Z,\d]+$/
			},
			{
				"optional": false,
				"validator":/^[1-9]\d*$/
			}
		]
    }
    $(".form-horizontal").submitForm(opt);

})