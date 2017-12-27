/**
 * Created by chris on 2017/4/27.
 */
$(document).ready(function () {
    if($('#offer_table').length){
        getData({
            'obj': $('#offer_table'),
            'url': '/price/merchant/send',
        });
    }
    if($('#draft_table').length){
        getData({
            'obj': $('#draft_table'),
            'url': '/price/merchant/draft',
        });
    }
    if($('#other_offer_table').length){
        getData({
            'obj': $('#other_offer_table'),
            'url': '/price/merchant/receive',
        });
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
                {
                    "data": "id",
                    "targets":0,
                    "defaultContent":'',
                    "searchable":true
                },
                {
                    "data": "null",
                    "targets":1,
                    "defaultContent":'',
                    "searchable":true
                },
                {
                    "data": "customer.company",
                    "targets":2 ,
                    "defaultContent":'',
                },
                {
                    "data": function(data){
                        return $.timestampToDate(data.createdTime);
                    },
                    "targets":3,
                    "defaultContent":""
                },
                {
                    "data": "null",
                    "targets":4 ,
                    "defaultContent":'',
                },
                {
                    "data": function(data){
                        if(data.modifiedTime){
                            return $.timestampToDate(data.modifiedTime);
                        }
                    },
                    "targets":5,
                    "defaultContent":""
                },
                {
                    "data":function(data){
                            if(opt.url == '/price/merchant/draft'){
                                return '<button class="btn btn-primary btn-sm btn-read" data-status="0" value="' + data.id + '">详情</button>'
                                    +'<button class="btn btn-primary btn-sm btn-apply" value="' + data.id + '">申请</button>'
                            }else {
                                if(data.flag < 0){
                                    return '<button class="btn btn-primary btn-sm btn-read" data-status="1" value="' + data.id + '">详情</button>'
                                }else {
                                    return '<button class="btn btn-primary btn-sm btn-read" data-status="1" value="' + data.id + '">详情</button>'
                                    +'<button class="btn btn-primary btn-sm btn-order" value="' + data.id + '">下单</button>'
                                }
                            }
                    },
                    "targets":6,
                },

            ],
            "info" : false
        }).on('init.dt', function(e, settings, json) {
        }).on('draw.dt', function () {
            opt.obj.on('click','.btn-read',function () {
                var sta = $(this).attr('data-status');
                var val = $(this).attr('value');
                // if(sta == 0){
                //     $.jump('/price/merchant?company='+val+'&status='+sta);
                //     return;
                // }
                // $.jump('/price/merchant?company='+val+'&status='+sta);
                $.jump('/price/merchant/quoteInfo/'+ val);
            });
            opt.obj.on('click','.btn-apply', function () {
                var val = $(this).attr('value');
                $.ajax({
                    url:'/price/merchant/submit/' + val,
                    type:'PUT',
                    success:function (json) {
                        if(json.success){
                            $.msgBox(json.message);
                            location.reload();
                        }
                    }
                });
            });
            opt.obj.on('click','.btn-order',function(){
                var val = $(this).attr('value');
                var param = {billId: val};
                $.ajax({
                    url:'/order',
                    data: param,
                    type:'POST',
                    success:function (json) {
                        if(json.success){
                            $.msgBox(json.message);
                            location.reload();
                        }
                    }
                });
            })
        });

    }

} );
