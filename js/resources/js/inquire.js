
$(document).ready(function(){
    if($('#inquire_table').length){
        getData({
            'obj': $('#inquire_table'),
            'url': '/price/inquire',
            'jump':'/price',
            'sedUrl': '/price/bill/'

        })
    }
    if($('#otherInquire_table').length){
        getData({
            'obj': $('#otherInquire_table'),
            'url': '/price/otherInquire',
            'jump':'/price/merchant',
            'sedUrl': '/price/merchant/bill/'
        })
    }
    function getData(opt){
        var bills_table = opt.obj.DataTable({
        "ajax": {
			url: opt.url,
			headers:{
				"Accept":"application/json"
			}
		},
		"scrollCollapse": true,
		"rowId": 'id',
		"processing":true,
		"searching": true,
		"ordering": false,
		"paging": true,
		"pagingType": "full_numbers",
		"serverSide":true,
		"pageLength": 25,
		"language":language,
		"columnDefs": [
			{ 	//编号
				"data": "id",
				"targets":0,
				"defaultContent":'',
				"searchable":true
			},
            { 	//创建人
				"data": "null",
				"targets":1,
				"defaultContent":'',
				"searchable":true
			},
			{ 	//操作人
				"data": "user.id",
				"targets":2 ,
				"defaultContent":'',
			},
            { 	//创建时间
				"data": function(data){
					return $.timestampToDate(data.createdTime);
				},
				"targets":3,
				"defaultContent":""
			},
            { 	//最后操作人
				"data": "null",
				"targets":4 ,
				"defaultContent":'',
			},
            { 	//最后操作时间
				"data": function(data){
                    if(data.modifiedTime){
                        return $.timestampToDate(data.modifiedTime);
                    }
				},
				"targets":5,
				"defaultContent":""
			},
            { 	//最后操作时间
				"data": function(data){
                    if(data.endTime){
                        return $.timestampToDate(data.endTime);
                    }
				},
				"targets":6,
				"defaultContent":""
			},
            {
				"data":function(data){
                    if(opt.url == '/price/inquire'){
                        return '<button class="btn btn-primary btn-sm btn-read" value="' + data.id + '" status="'+ data.status +'" >读取</button>' ;
                    }else {
                        return '<button class="btn btn-primary btn-sm btn-reply" value="' + data.id + '">回复</button>' ;
                    }
				},
				"targets":7,
			},
			
		],
		"info" : false
        }).on('init.dt', function(e, settings, json) {
		
	    }).on('draw.dt', function () {
            $.renderName(bills_table,'user','user.id',[{'col':1, 'name': 'name'}]);
            $.renderName(bills_table,'user','createdBy',[{'col':2, 'name': 'name'}]);
            $.renderName(bills_table,'user','modifiedBy',[{'col':4, 'name': 'name'}]);
            var data = bills_table.data();
            var table = $(this).DataTable();
            if(opt.url == '/price/inquire'){
                $.each(table.rows().indexes(), function(i, idx) {
                    table.cell(i,0).nodes().to$().html('<i class="fa fa-fw fa-plus-square btn-details" ></i>');
                    var row = table.row(idx);
                    $(row.node()).data('row-index', idx).click(function() {
                        var idx = $(this).data('row-index');
                        var row = table.row(idx);
                        if (row.child() == undefined){
                            appendChild(row, '/price/otherInquire/'+ row.data().id );
                        }
                        else if (row.child.isShown())
                            row.child.hide();
                        else
                            row.child.show();
                    });
                })
            
            }
            // function showbtn(data){
            //     for(var i=0; i<data.length; i++){
            //         var flag = data[i].flag;
            //         if((flag & 2) > 0 && data[i].user instanceof Object && data[i].user.id == $('#hide').html()){
            //             $('tbody tr').eq(i).find('.btn-edit,.btn-save,.btn-abandon').removeAttr('disabled');
            //         }
            //         if((flag & 2) > 0){
            //             $('tbody tr').eq(i).find('.btn-read').attr('disabled','disabled');
            //         }
            //     }
            // }
            // showbtn(data);
            $('.btn-read').each(function(key,value){
                if($(value).attr('status') == "PUBLISH"){
                    $(this).html('已发布').attr('disabled','disabled');
                }
            })
            $('.btn-edit').on('click',function(){
                $.jump(opt.jump);
            })
            $('.btn-read').on('click',function(){
                // $.get(opt.sedUrl + $(this).attr('value'),function(data){
                //     location.replace(location.href)
                // })
                $.ajax({
                    url: '/price/inquire/bill/'+ $(this).attr('value'),
                    method: 'GET',
                    success: function(){
                        $.jump('/price/createInquire');
                    }
                })
            })
           
            $('.btn-merchant').on('click',function(){
                $.ajax({
                    url: '/price/inquireToQuote/' + $(this).attr('value'),
                    method:'POST',
                    success: function(data){
                        if(data.success){
                            $.msgBox(data.message);
                        }
                    }
                })
            })
            $('#inquire_table').on('click','.btn-publish',function(){
                $.ajax({
                    url: '/price/publishInquire/'+ $(this).attr('value'),
                    method: 'PUT',
                    success: function(data){
                        if(data.success){
                            $.msgBox(data.message);
                            $.jump(window.location.href);
                        }
                    }
                })
            })
        })
        function appendChild(row, baseUrl) {
            var record = row.data();
            $.get( baseUrl , function(json) {
                if (!$.isArray(json.data))
                    return;
                var children = {};
                var trs = {};
                $.each(json.data, function(i, child) {
                    var orderNo = child['id'];
                    var tr2 = $('<tr />').prop('id', 'tr-2-' + orderNo).addClass('tr-lvl-2');
                    $('<td />').text(child['merchant']['name']).appendTo(tr2);
                    $('<td />').appendTo(tr2);
                    $('<td />').text(child['user']['name']).appendTo(tr2);
                    $('<td />').text(child['codes'].length).appendTo(tr2);
                    $('<td />').appendTo(tr2);
                    $('<td />').text($.timestampToDate(child['createdTime'])).appendTo(tr2);
                    $('<td />').html('<button class="btn btn-primary btn-sm btn-repley" value="'+ orderNo +'" >回复</button>'
                                        + '<button class="btn btn-primary btn-sm btn-detail" value="'+ orderNo +'" >查看</button>').appendTo(tr2);
                    trs[orderNo] = tr2.get(0);

                });
                var tra = [];
                var tr3 = $('<tr />').addClass('tr-lvl-3');
                $('<td />').text('供应商名称').appendTo(tr3);
                $('<td />').appendTo(tr3);
                $('<td />').text('回复人').appendTo(tr3);
                $('<td />').text('配件号数量').appendTo(tr3);
                $('<td />').appendTo(tr3);
                $('<td />').text('回复时间').appendTo(tr3);
                $('<td />').appendTo(tr3);
                tra.push(tr3);
                $.each(trs, function(orderNo, tr) {
                    tra.push(tr);
                });
                if(tra.length > 1)
                    row.child(tra).show();
            });
        }

    }
    $('body').on('click','.btn-detail',function(){
        $.jump('/reply/'+ $(this).attr('value'));
    })
    $('#otherInquire_table').on('click','.btn-reply',function (e) {
        $.jump('/parts/inquire/answer/'+ $(this).attr('value'));
        // var _this = $(this);
        // var inquire_id = _this.val();
        // var opt = {
        //     "id": "inquire_module",
        //     "title": "回复询价",
        //     "width": 800,
        //     "height": 400,
        //     "level": "info",
        //     "closeIcon": false
        // };
        // opt.content = '<div>'
        //     +'<table>'
        //     +'<thead>'
        //     +'<tr>'
        //     +'<th class="col-md-1">需求PN号</th>'
        //     +'<th class="col-md-1">需求数量</th>'
        //     +'<th class="col-md-1">PN号</th>'
        //     +'<th class="col-md-1">数量</th>'
        //     +'<th class="col-md-1">名称</th>'
        //     +'<th class="col-md-1">AM/OE</th>'
        //     +'<th class="col-md-1">品牌</th>'
        //     +'<th class="col-md-1">价格</th>'
        //     +'<th class="col-md-1">备注</th>'
        //     +'</tr>'
        //     +'</thead>'
        //     +'<tbody></tbody>'
        //     + '</table>'
        //     + '<div class="box-footer">'
        //     + '<button type="submit" class="btn btn-info pull-right user-confirm">确认</button>'
        //     + '<button class="btn btn-default user-cancel">取消</button>'
        //     + '</div>'
        //     +'</div>';
        // $.doModule(opt, function (module) {
        //     $.get('/price/inquire/reply/'+inquire_id, function (data) {
        //         $('#inquire_module table tbody').empty();
        //        $.each(data.data[0].codes, function (i, v) {
        //           var tr = $('<tr>').val(v.id).append($('<td>').text(v.code))
        //               .append($('<td>').text(v.quantity))
        //               .append($('<td>').append($('<input>').addClass('form-control inquire-code')))
        //               .append($('<td>').append($('<input>').addClass('form-control inquire-quintity').val(v.quantity).attr('disabled', true)))
        //               .append($('<td>').append($('<input>').addClass('form-control')))
        //               .append($('<td>').append($('<input>').addClass('form-control')))
        //               .append($('<td>').append($('<input>').addClass('form-control')))
        //               .append($('<td>').append($('<input>').addClass('form-control inquire-price')))
        //               .append($('<td>').append($('<input>').addClass('form-control')));
        //           $('#inquire_module table tbody').append(tr);
        //        });
        //     });
        //     function rep_list() {
        //         var is_valid = 0;
        //         var params = {};
        //         var codes = [];
        //         var tr = module.find('table tbody tr');
        //         $(tr).each(function (i,v) {
        //             var rep_obj = {};
        //             rep_obj.originId = $(this).val();
        //             rep_obj.code = $(this).find('.inquire-code').val();
        //             rep_obj.quantity = $(this).find('.inquire-quintity').val();
        //             rep_obj.price  = $(this).find('.inquire-price').val();
        //             if(rep_obj.code == ''){
        //                 $.msgBox('请输入pn号','warning');
        //                 is_valid = 1;
        //             }else if(rep_obj.price == ''){
        //                 $.msgBox('请输入价格','warning');
        //                 is_valid = 1;
        //             }
        //             codes.push(rep_obj);
        //         });
        //         params.codes = codes;
        //         console.log(params)

        //         if(is_valid == 0){
        //             $.ajax({
        //                 'url':'/price/inquire/reply?id=' + _this.val(),
        //                 'method':'post',
        //                 'data':params,
        //                 'success':function (data) {
        //                     console.log(data)
        //                 }
        //             });
        //         }

        //     }
        //     module.find('.user-confirm').unbind().click(function () {
        //         rep_list();
        //     });
        //     module.find(".user-cancel").unbind().click(function (e) {
        //         e.preventDefault();
        //         module.find('.btn-box-tool').trigger('click');
        //         $('.mask').hide();
        //     });
        // });
    });
} );

	
