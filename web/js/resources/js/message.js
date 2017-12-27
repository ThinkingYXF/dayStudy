/**
 * 文件上传成功
 * @returns
 */
function uploadFileSuccess(){
	if($('iframe').length > 0){
		var lastIframe = $($('iframe').last()[0].contentDocument);
		var fileId = lastIframe.find('input[name="fileId"]').val();
		if (fileId) {
			$(".upload-file-frame").last().attr('id', 'file_' + fileId).removeClass('col-sm-3').addClass('col-sm-5').addClass("uploaded-table");
			$(".upload-file-area").addClass("uploaded-table");
			$(".message-form").append("<input type='hidden' name='fileId' value='" + fileId + "' id='msg_" + fileId + "'>");
			$(".upload-area").append('<div class="embed-responsive embed-responsive-16by9 upload-file-frame col-sm-3"><iframe class="embed-responsive-item upload-file-area" src="/message/attachment"></iframe></div>');
		}
	}
}
function doDeleteFile(fileId){
	if(fileId){
		$('#file_' + fileId).hide();
		$('#msg_' + fileId).remove();
	}
}

function doSendSuccess(){
	$(".upload-file-frame").each(function(){
		if($(this).attr('id')){
			$(this).remove();
		}
	});
	$('input[name="fileId"]').each(function(){
		$(this).remove();
	});
	$('#target_receiver, #receiver, #target_company, #company, #title, #content').val('');
}
(function(){
$(document).ready(function(){
	// $('.message-form .send-btn').click(function(e){
	// 	$.mask();
	// 	e.preventDefault();
	// 	var params = {};
	// 	$.each($('#msg_form').serializeArray(), function(idx, field) {
	// 		if (field.value)
	// 			params[field.name] = field.value;
	// 	});
	// 	console.log(params);
	// 	$.ajax({
	// 		url:'/message',
	// 		data:params,
	// 		type:"post",
	// 		dataType:"json",
	// 		success:function(data){
	// 			if(data.success){
	// 				$.msgBox(data.message);
	// 				doSendSuccess();
	// 			} else {
	// 				$.msgBox(data.message, 'warning');
	// 				console.log(data);
	// 			}
	// 			$.hideMask();
	// 		}
	// 	});
	// });
	$.autoCompleteUser();
	$.autoCompleteMerchant();
	if($('#input_user').val() != '' && parseInt($('#input_user').val()) > 0){
		$.get('/picker/user/' + parseInt($('#input_user').val()), function(data){
			$('#user_typeahead').val(data.name);
		});
	}
	if($('#input_merchant').val() != '' && parseInt($('#input_merchant').val()) > 0){
		$.get('/picker/merchant/' + parseInt($('#input_merchant').val()), function(data){
			$('#merchant_typeahead').val(data.name);
		});
	}

	var received_table = $('#received_table').DataTable( {
		"ajax": {
			url:"/messages/received",
			// url:location.href == 'http://127.0.0.1:8080/messages/received'?'/messages/received':'/personal/messages/received',
			headers:{
				"accpet":"application/json"
			}
		},
		"scrollCollapse": true,
		"paging": false,
		"rowId": 'id',
		"processing":true,
		"searching": false,
		"ordering": false,
		"paging": true,
		"pagingType": "simple_numbers",
		"language":language,
		"columnDefs": [
			{ 	"data": null,
				"targets":0,
				"defaultContent":""
			},
			{ 	"data": null,
				"targets":1,
				"defaultContent":''
			},
			{ 	"data": null,
				"targets":2,
				"defaultContent":''
			},
			{ 	"data": null,
				"targets":3,
				"defaultContent":''
			},
			{ 	"data": function(data){
					return '<a class="message-title" href="/message/received/' + data.id + '">' + data.message.name + "</a>";
				},
				"targets":4 ,
				"defaultContent":''
			},
			{ 	"data": null,
				"targets":5,
				"defaultContent":''
			},
			{ 	"data": function(data){
					return $.timestampToDate(data.message.createdTime);
				},
				"targets":6 ,
				"autoWidth":"true",
				"width":"20%"
			},
			// { 	"data": function(data){
			// 	return '<div class="btn-group">' +
			// 		'<a class="btn btn-primary btn-block btn-info btn-sm" href="/message/reply/' + data.id +'">回复<i class="fa fa-fw fa-reply"></i></a>' +
			// 		'<a class="btn btn-primary btn-block btn-info btn-sm btn-delete" value="' + data.id +'">删除<i class="fa fa-fw fa-remove"></i></a>' +
			// 		'</div>';
			// 	},
			// 	"targets":-1  ,
			// 	"defaultContent": '',
			// 	"width":"20%"
			// },
		],
		"info" : false
	} ).on('init.dt', function(e, settings, json) {
		console.log(json);
	}).on('draw.dt', function () {
        $.renderName(received_table, 'user', 'message.createdBy', [{"col":"2", "name":"name"}]);
        $.renderName(received_table, 'merchant', 'message.merchantId', [{"col":"3", "name":"name"}]);
        // renderCell(MESSAGE_STATES['UNREPLIED'], 'unreplied');
        // renderCell(MESSAGE_STATES['UNREAD'], 'unread');
		var table = $('#received_table').DataTable();
		$.each(table.rows().indexes(),function(i,idx){
			var row = table.row(idx);
			table.cell(i,0).nodes().to$().html('<div class="icheckbox_flat-blue" aria-checked="false" aria-disabled="false" style="position: relative;"><input type="checkbox" style="position: absolute; "></div>');
			table.cell(i,1).nodes().to$().html('<a href="#"><i class="fa fa-star text-yellow"></i></a>');
			table.cell(i,5).nodes().to$().html('<i class="fa fa-paperclip"></i>');
		});
		table.columns(2).nodes().flatten().to$().addClass('send-name');
		table.columns(3).nodes().flatten().to$().addClass('merchant-name');
		$('table .btn-delete').each(function(){
			var msg_id = $(this).attr("value");
			$(this).click(function(){
				$.deleteConfirm(function(){
					$.mask();
					$.ajax({
						"url":"/message/received/" + msg_id,
						"method":"delete",
						"success":function(data){
							if(data.success){
								$.reloadData(received_table);
							} else {
								$.msgBox("删除信息失败", 'warning');
							}
							$.hideMask();
						}
					});
				});
			});
		});
	});
	
	var sent_table = $('#sent_table').DataTable( {
		"ajax": {
			url:"/messages/sent",
			headers:{
				"accpet":"application/json"
			}
		},
		"scrollCollapse": true,
		"paging": false,
		"rowId": 'id',
		"processing":true,
		"searching": false,
		"ordering": false,
		"paging": true,
		"pagingType": "simple_numbers",
		"language":language,
		"columnDefs": [
			{ 	"data": null,
				"targets":0,
				"defaultContent":""
			},
			{ 	"data": null,
				"targets":1,
				"defaultContent":''
			},
			{ 	"data": null,
				"targets":2,
				"defaultContent":""
			},
			{ 	"data": null,
				"targets":3,
				"defaultContent":''
			},
			{ 	"data": function(data){
					return '<a class="message-title" href="/message/sent/' + data.id + '">' + data.message.name + "</a>";
				},
				"targets":4,
				"defaultContent":''
			},
			{ 	"data":null,
				"targets":5,
				"defaultContent":''
			},
			{ 	"data": function(data){
					return $.timestampToDate(data.message.createdTime);
				},
				"targets":6  ,
				"autoWidth":"true",
				"width":"20%"
			},
			// { 	"data": function(data){
			// 	return '<div class="btn-group">' +
			// 	'<a class="btn btn-primary btn-block btn-info btn-sm" href="/message/sent/' + data.id +'">查看<i class="fa fa-fw fa-folder-open-o"></i></a>' +
			// 	'<a class="btn btn-primary btn-block btn-info btn-sm btn-delete" value="' + data.message.id +'">删除<i class="fa fa-fw fa-remove"></i></a>' +
			// 	'</div>';
			// 	},
			// 	"targets":-1  ,
			// 	"defaultContent": '',
			// 	"width":"10%"
			// },
		],
		"info" : false
	} ).on('init.dt', function(e, settings, json) {

	}).on('draw.dt', function () {
        $.renderName(sent_table, 'user', "userId", [{"col":2, "name":"name"}]);
        $.renderName(sent_table, 'merchant', "merchantId", [{"col":3, "name":"name"}]);
		var table = $('#sent_table').DataTable();
		$.each(table.rows().indexes(),function(i,idx){
			var row = table.row(idx);
			table.cell(i,0).nodes().to$().html('<div class="icheckbox_flat-blue" aria-checked="false" aria-disabled="false" style="position: relative;"><input type="checkbox" style="position: absolute; "></div>');
			table.cell(i,1).nodes().to$().html('<a href="#"><i class="fa fa-star text-yellow"></i></a>');
			table.cell(i,5).nodes().to$().html('<i class="fa fa-paperclip"></i>');
		});
		table.columns(2).nodes().flatten().to$().addClass('send-name');
		table.columns(3).nodes().flatten().to$().addClass('merchant-name');
		$('table .btn-delete').each(function(){
			var msg_id = $(this).attr("value");
			$(this).click(function(){
				$.deleteConfirm(function(){
					$.mask();
					$.ajax({
						"url":"/message/sent/" + msg_id,
						"method":"delete",
						"success":function(data){
							if(data.success){
								$.reloadData(sent_table);
							} else {
								$.msgBox("删除信息失败", 'warning');
							}
							$.hideMask();
						}
					});
				});
			});
		});
	});
	
	function renderCell(flag, flag_name){
		var indexes = received_table.rows().eq(0).filter( function (rowIdx) {
			return (received_table.row(rowIdx).data().flag & flag) ? true : false;
		});
		$.each(indexes, function(i, val){
			var id = received_table.row(val).data().id;
			var content = '';
			if(flag_name == 'unread'){
				content = '<a href="/message/received/' + id + '"><i class="fa fa-fw fa-envelope"></i></a>';
			} else {
				content = '<a href="/message/reply/' + id + '"><i class="fa fa-fw fa-mail-reply"></i></a>';
			}
			received_table.cell(val, 0)
			.nodes()
			.to$()
			.html('')
			.append(content);
		});
	}
	
//	function renderOperatorCell(table, col, opts){
//		if(typeof opts == 'undefined' || opts.length == 0) return true;
//		$.each(table.data(), function(i,val){
//			var id = val.id;
//			var html = '<div class="btn-group">';
//			if(opts['reply']){
//				html += '<a class="btn btn-primary btn-block btn-info btn-sm" href="/message/reply/' + id +'">回复<i class="fa fa-fw fa-reply"></i></a>' ;
//			}
//			if(opts['received-delete']){
//				html += '<a class="btn btn-primary btn-block btn-info btn-sm btn-delete" type="received" value="' + id +'">删除<i class="fa fa-fw fa-remove"></i></a>' ;
//			}
//			if(opts['sent-delete']){
//				id = val.message.id; 
//				html += '<a class="btn btn-primary btn-block btn-info btn-sm btn-delete" type="received" value="' + id +'">删除<i class="fa fa-fw fa-remove"></i></a>' ;
//			}
//			html += '</div>';
//			table.cell(i, col).nodes().to$().append(html);
//		});
//	}
//	
	$('.box-header .btn-sent').click(function(){
		$(this).removeClass('btn-default').addClass('btn-primary');
		$('.box-header .btn-received').removeClass('btn-primary').addClass('btn-default');
		if(location.pathname !== "/messages/sent"){
			location.pathname = "/messages/sent";
		}
	});
	$('.box-header .btn-received').click(function(){
		$(this).removeClass('btn-default').addClass('btn-primary');
		$('.box-header .btn-sent').removeClass('btn-primary').addClass('btn-default');
		if(location.pathname !== "/messages/received"){
			location.pathname = "/messages/received";
		}
	});
	$('table .btn-delete').click(function(){
		var msg_id = $(this).attr("value");
		var type = $(this).attr("type");
		$.mask();
		$.ajax({
			"url":"/message/" + type + "/" + msg_id,
			"method":"delete",
			"success":function(data){
				if(data.success){
					if(type="received"){
						$.reloadData(received_table);
					} else {
						$reloadData(sent_table);
					}
				} else {
					$.msgBox("删除信息失败", 'warning');
				}
				$.hideMask();
			}
		});
	});
	
	$('#received_table tbody').on('click', 'tr', function () {
		var data = received_table.row(this).data();
		var id = data.id;
		if(id > 0) {
			$.jump("/message/received/" + id);
		}
	});
	
	$("#sent_table tbody").on('dblclick', 'tr', function () {
		var data = sent_table.row(this).data();
		var id = data.id;
		if(id > 0) {
			$.jump("/message/sent/" + id);
		}
	});
	$('.btn-compose').on('click', function () {
		var id = $('#message_id').val();;
		if(id > 0) {
			$.jump("/message/reply/" + id);
		}
	});
	
	if($('.message .receiver-name').length > 0 || $('.message .sender-name').length > 0){
		var user_id = $('.message .receiver-name').attr("value") || $('.message .sender-name').attr("value");
		$.get("/data/user/" + user_id, function(data){
			$('.message .receiver-name, .message .sender-name').html(data.name);
		});
	}
	$('.message .created-time').html($.timestampToDate($('.message .created-time').attr("value")));
	
	$('.message-detail .btn-delete').click(function(){
		var type = $(this).attr("msgType");
		var msg_id = $(this).attr("value");
		$.ajax({
			url:"/message/" + type + "/" + msg_id,
			method:"delete",
			success:function(data){
				if(data.success){
					$.msgBox(data.info);
					location.pathname="/messages/" + type;
				} else {
					$.msgBox(data.info, 'warning');
				}
			}
		}) 
	});
	
	if($('#target_receiver').val()){
		var user_id = $('#target_receiver').val();
		$.get("/data/user/" + user_id, function(data){
			$('#receiver').val(data.name);
		})
	}
	
	if($('#target_receiver').val()){
		var user_id = $('#target_receiver').val();
		$.get("/data/user/" + user_id, function(data){
			$('#receiver').val(data.name);
		})
	}
	if($('#target_company').val()){
		var merchant_id = $('#target_company').val();
		$.get("/data/merchant/" + merchant_id, function(data){
			$('#company').val(data.name);
		})
	}
	$('#compose-textarea').html($('#msg_content').val());
});
})();