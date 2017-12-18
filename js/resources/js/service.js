$(document).ready(function(){
    var tuColumns = [{
		title: '配件号',
		data: 'code',
		className: 'code table-td',
		editor: {
			type: 'input',
			name: 'codes[{}].code',
			className: 'form-control',
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
			validator: /^\d+$/,
			optional:false
		}
	}];
    $('#table_container').tableUpload({
		//url: '/some/url/to/post/to',
		url: function() {
			return "/price/createBill";
		},
		columns: tuColumns,
		data: [],
		outerFields: function() {
            if($('#item_name').val() == ''){
                $('#item_name').addClass('error');
                return false;
            }else {
                return {name: $('#item_name').val()};
            }
		}
	});
    $('.upload-file-area').fileUpload(function(json){
        var list = [];
        $.each(json.data,function(i,val){
            list.push(val);
        })
        $('#table_container').tableUpload({
            columns: tuColumns,
            data: [],
        })
    })
    // var option = {
    //     header:[
    //         {
    //             label: "项目名称",
    //             input: "名称"
    //         }
    //     ],
    //     body: [
    //         {
    //             header:"配件编号",
    //             optional:false,
    //             validator: /^[a-z,A-Z,\d]+$/,
    //         },
    //         {
    //             header:"数量",
    //             optional:false,
    //             validator: /^(0|[1-9][0-9]{0,9})(\.[0-9]+)?$/,
    //         }
    //     ],
    //     footer: {
    //         jump:"/data/download/inventory",
    //         url: "/price/createBill/upload"
    //     }
    // };
    // $("#add_item").createForm();
    // $(".form-horizontal").createHeader(option);
    // $(".form-group .col-md-5").createInput();
    // $(".form-horizontal").createTable();
    // $("thead").createTr(1);
    // $("thead tr").createTh(option);
    // $("tbody").createTr(10);
    // $("tbody tr").createTd(2);
    // $(".form-horizontal").createFooter(option);
    // $(".form-horizontal").submitForm(option);
    //默认添加空行
	// if($('.add-item-form').length){
	// 	var opt = {'code': 'code','attr':'inventory'};
	// 	$.addRows(10,opt);
	// }
    //点击添加空行
	// $('.form-horizontal').on('click','.btn-add',function(){
	// 	$.addRows(5,opt);
	// })
    // function withParam(){
    //     var param = {};
    //     if($('#item_name').length){
    //         var name = $('#item_name').val();
    //         if(name == ''){
    //             $('#price_name').addClass('error-border');
    //             $.msgBox('请输入项目名称', 'warning');
    //             return false;
    //         }
    //         param['name'] = name;
    //     }
    //     return param;
    // }
    // $.addRows(10,$('.table'));
    // $('.form-horizontal').on('click','.btn-add',function(){
	// 	$.addRows(10,$('.table'));
	// })
    // $.formSubmit({
	// 	'elem':$('.form-horizontal'),
	// 	'url': '/price/createBill',
	// 	'method':'POST',
    //     itemname: $('#item_name'),
	// 	'second': 'inventory',
	// 	'tooltip': {
	// 		'message1':'请输入配件号',
	// 		'message2':'请输入数量',
	// 		'message3':'配件编号只包含数字和字母',
	// 		'message4':'数量只能是大于0的整数',
	// 	},
	// 	'data':[
	// 		{
	// 			"optional": false,
	// 			"validator":/^[a-z,A-Z,\d]+$/
	// 		},
	// 		{
	// 			"optional": false,
	// 			"validator":/^[1-9]\d*$/
	// 		}
	// 	]
	// })
    // $.uploadFile($('#upload_inventory_file'),{code: 'code',inventory:'inventory'});


})