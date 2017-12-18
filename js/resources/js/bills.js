function uploadFileSuccess(){
	$.jump("/price/bills");
}
$(document).ready(function(){
    if($('#bills_table').length){
        getData({
            'obj': $('#bills_table'),
            'url': '/price/bills',
            'jump':'/price',
            'sedUrl': '/price/bill/'

        })
    }
    if($('#offer_table').length){
        getData({
            'obj': $('#offer_table'),
            'url': '/price/merchant/bills',
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
            {
				"data":function(data){
					return '<button class="btn btn-primary btn-sm btn-read" value="' + data.id + '">读取</button>' 
					+'<button class="btn btn-primary btn-sm btn-edit" value="' + data.id + '"  disabled="disabled">编辑</button>'
                    +'<button class="btn btn-primary btn-sm btn-save" value="' + data.id + '" disabled="disabled">保存</button>'
                    +'<button class="btn btn-primary btn-sm btn-abandon" value="' + data.id + '" disabled="disabled">放弃</button>' ;
				},
				"targets":6,
			},
			
		],
		"info" : false
        }).on('init.dt', function(e, settings, json) {
		
	    }).on('draw.dt', function () {
            $.renderName(bills_table,'user','user.id',[{'col':1, 'name': 'name'}]);
            $.renderName(bills_table,'user','createdBy',[{'col':2, 'name': 'name'}]);
            $.renderName(bills_table,'user','modifiedBy',[{'col':4, 'name': 'name'}]);
            var data = bills_table.data();
            function showbtn(data){
                for(var i=0; i<data.length; i++){
                    var flag = data[i].flag;
                    if((flag & 2) > 0 && data[i].user instanceof Object && data[i].user.id == $('#hide').html()){
                        $('tbody tr').eq(i).find('.btn-edit,.btn-save,.btn-abandon').removeAttr('disabled');
                    }
                    if((flag & 2) > 0){
                        $('tbody tr').eq(i).find('.btn-read').attr('disabled','disabled');
                    }
                }
            }
            showbtn(data);
            $('.btn-edit').on('click',function(){
                $.jump(opt.jump);
            })
            $('.btn-read').on('click',function(){
                $.get(opt.sedUrl + $(this).attr('value'),function(data){
                    location.replace(location.href)
                })
            })
            $('.btn-save').on('click',function(){
                $.ajax({
                    url: opt.sedUrl,
                    method:'PUT',
                    success:function(data){
                        if(data.success){
                            $.msgBox('保存成功');
                            location.replace(location.href);
                        } else {
                            $.msgBox('保存失败', "warning");
                        }
                    }
                })
            })
            $('.btn-abandon').on('click',function(){
                $.ajax({
                    url: opt.sedUrl,
                    method:'DELETE',
                    success:function(data){
                        if(data.success){
                            location.replace(location.href)
                        } else {
                            $.msgBox('放弃失败', "warning");
                        }
                    }
                })
            })
        })
    }
} )

	
