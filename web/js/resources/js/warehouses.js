function uploadFileSuccess(){
	$.jump("/merchant/warehouses");
}
$(document).ready(function(){
    var warehouses_table = $('#warehouses_table').DataTable({
        "ajax": {
			url:"/merchant/warehouses",
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
				"data": "code",
				"targets":0,
				"defaultContent":'',
				"searchable":true
			},
            { 	//名称
				"data": "name",
				"targets":1,
				"defaultContent":'',
				"searchable":true
			},
			{ 	//电话
				"data": "phone",
				"targets":2 ,
				"defaultContent":'',
			},
			{ 	//地址
				"data": "null",
				"targets":3,
				"defaultContent":''
			},
            { 	//创建时间
				"data": function(data){
					return $.timestampToDate(data.createdTime);
				},
				"targets":4,
				"defaultContent":""
			}
			
		],
		"info" : false
	} ).on('init.dt', function(e, settings, json) {
		
	}).on('draw.dt', function () {
		$.getDistrict = function(table){
			var td = table.data();
			 $.each(td, function(i, val){
				 val = val.district;
				 if(val != ''){
					 $.get('/data/district/'+val,function(data){
						 table.cell(i, 3).nodes().to$().html(data.message);
					 })
				 }
			 })
		}
		$.getDistrict(warehouses_table);
    })
	
	
})