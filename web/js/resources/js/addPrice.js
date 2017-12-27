$(document).ready(function(){
    var option = {
        header:[
            {
                label: "仓库",
                select: 'supplier'
            },
            {
                label:"价格表",
                ul: "ul"
            },
            {
                label:"价格名称",
                input: "名称"
            }
        ],
        body: [
            {
                header:"配件编号",
                optional:false,
                validator: /^[a-z,A-Z,\d]+$/,
            },
            {
                header:"价格",
                optional:false,
                validator: /^(0|[1-9][0-9]{0,9})(\.[0-9]+)?$/,
            }
        ],
        footer: {
            jump:"/data/download/price",
            url: "/product/price/upload"
        }
    };
    $("#add_product").createForm();
    $(".form-horizontal").createHeader(option);
    $(".form-group .col-md-5").eq(0).createSelect(option);
    $(".form-group .col-md-8").append('<ul id="price_code" class="price-code ">');
    $(".form-group .col-md-5").eq(1).createInput();
    $(".form-horizontal").createTable();
    $("thead").createTr(1);
    $("thead tr").createTh(option);
    $("tbody").createTr(10);
    $("tbody tr").createTd(2);
    $(".form-horizontal").createFooter(option);
	render_supplier($('.supplier'));
    var opt = {
		'url': '/products/price',
		'method':'POST',
		'warehouse': $('.supplier'),
		'second': 'price',
		'code':$('#price_code'),
		'name':$('.col-md-5 input'),
		'tooltip': {
			'message1':'请输入配件编号',
			'message2':'请输入价格',
			'message3':'配件编号只包含数字和字母',
			'message4':'价格只能是大于0的数字',
		},
		'data':[
			{
				"optional": false,
				"validator":/^[a-z,A-Z,\d]+$/
			},
			{
				"optional": false,
				"validator":/^(0|[1-9][0-9]{0,9})(\.[0-9]+)?$/
			}
		]
    }
    $(".form-horizontal").submitForm(opt);
    // $('.box-footer').on('click','.btn-add',function(){
    //     console.log(1);
    //     $('.table tbody').createRow(2);
    // })
})