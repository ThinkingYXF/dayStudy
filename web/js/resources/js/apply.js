/**
 * Created by chris on 2017/4/19.
 */
$(document).ready(function(){
    var apply_table = $("#apply-table").DataTable({
        "scrollCollapse": true,
        "rowId": 'id',
        "processing":false,
        "searching": true,
        "ordering": false,
        "paging": false,
        "serverSide":true,
        "deferLoading":0,
        "pagingType": "full_numbers",
        "pageLength": 25,
        "language":language,
        "columnDefs": [
            { 	"data": "supplier.name",
                "targets":0,
                "defaultContent":""
            },
            { 	"data": function(data){
                if(data.flag){
                    var html = '';
                    if((data.flag & STATES.LOCKED) > 0){
                        html += '已锁定  ' + '<a class="supply-open" data-sup="'+data.customer.id+'" value="' + data.supplier.id + '">启用</a>';
                    } else {
                        html += '已启用  ' + '<a class="supply-close" data-sup="'+data.customer.id+'" value="' + data.supplier.id + '">锁定</a>';
                    }
                    return html;
                }
            },
                "targets":1,
                "defaultContent":'',
                "width":"20%"
            },
            { 	"data": function (data) {
                    if(data.flag){
                        return '<a class="btn  btn-primary btn-sm" href="/merchant/strategy/merchantId/' + data.supplier.id + '" >编辑</a>'
                            +'<button data-sup="'+ data.customer.id +'"  value="' + data.supplier.id + '" class="btn  btn-primary btn-sm btn-dele">删除</button>';
                    }else {
                        return '<a class="btn  btn-primary btn-sm" href="/merchant/strategy/merchantId/' + data.supplier.id + '" >编辑</a>'
                    }

                },
                "targets":2,
                "defaultContent":'',
            },
        ],
        "info" : false
    } ).on('init.dt', function(e, settings, json) {
    }).on('draw.dt', function (e, settings) {
        function aplly_operation(selecter,checked,url_name,btn,ajax_type) {
            $('#apply-table').on('click', selecter , function () {
                var super_id = $(this).attr('value');
                var sup_id = $(this).attr('data-sup');
                $.confirmBox(checked ,btn ,function(){
                    $.mask();
                    $.ajax({
                        "url":'/strategy/'+(url_name ===''?'':url_name+'/')+sup_id+'/'+super_id,
                        "method":ajax_type,
                        "success":function(data){
                            $.msgBox(data.message);
                            $.reloadData(apply_table);
                            $.hideMask();
                        }
                    });
                });
            });
        }
        //启用供货
        aplly_operation('.supply-open','启用','locked','supply-open',"PUT");
        //锁定供货
        aplly_operation('.supply-close','锁定','locked','supply-close',"DELETE");
        //删除
        aplly_operation('.btn-dele','确认删除','','btn-dele',"DELETE");
        /*
        $('#apply-table').on('click', '.supply-open', function(){
            var super_id = $(this).attr('value');
            var sup_id = $(this).attr('data-sup');
            $.confirmBox('启用','supply-open',function(){
                $.mask();
                $.ajax({
                    "url":'/strategy/locked/'+sup_id+'/'+super_id,
                    "method":"DELETE",
                    "success":function(data){
                        $.msgBox(data.message);
                        $.reloadData(apply_table);
                        $.hideMask();
                    }
                });
            });
        });
        $('#apply-table').on('click', '.supply-close', function(){
            var super_id = $(this).attr('value');
            var sup_id = $(this).attr('data-sup');
            $.confirmBox('锁定', 'supply-close', function(){
                $.mask();
                $.ajax({
                    'url':'/strategy/locked/'+sup_id+'/'+super_id,
                    'method':'PUT',
                    'success':function(data){
                        $.msgBox(data.message);
                        $.reloadData(apply_table);
                        $.hideMask();
                    }
                });
            })
        });
        $('#apply-table').on('click','.btn-dele',function () {
            var super_id = $(this).attr('value');
            var sup_id = $(this).attr('data-sup');
            $.confirmBox('确认删除', 'btn-dele', function(){
                $.mask();
                $.ajax({
                    'url':'/strategy/'+sup_id+'/'+super_id,
                    'method':'DELETE',
                    'success':function(data){
                        $.msgBox(data.message);
                        $.reloadData(apply_table);
                        $.hideMask();
                    }
                });
            })
        });*/
        $.hideMask();
    });
    $.autoCompleteMerchant();
    $('#substisute_search').click(function () {
        $.mask();
        var inp_val = $('#input_merchant').val();
        apply_table.ajax.url('/strategy/apply/'+inp_val).load();
    });
});