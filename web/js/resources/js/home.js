$(document).ready(function(){
	var marchant_id = $('span.merchant').attr('value');
	if(marchant_id > 0){
		$.get('/data/merchant/' + marchant_id, function(data){
			$('span.merchant').text(data.name);
		});
	} else {
		$('span.merchant').text("还未选择商户");
	}

	$.get('/home/merchants', function(data){
		var html = '';
		if(data.success){
			html = '<table class="table no-margin"><thead>'
				+ '<tr><th>商户ID</th><th>名称</th><th>状态</th><th></th></tr>'
				+ '</thead>'
				+ '<tbody>'
				+ '</tbody>'
				+ '</table>';
			$.each(data.data, function(i, val){
				var mhtml = '';
				$.get('/data/merchant/' + val.id, function(mdata){
					mhtml= '<tr><td>' + mdata.code + '</td><td>' + mdata.name
					+ '</td><td><span class="label label-success">' + val.flag
					+ '</span></td><td><a href="/home/' + val.id + '" class="btn btn-block btn-primary btn-sm btn-change">使用该商户</a></td></tr>';
					$('.table-responsive tbody').append(mhtml);
				});

			});
		} else {
			html = "暂无商户";
		}
		$('.table-responsive').html(html);
	});
	if($("a:contains('销售报价')").length){
		location.href='/price/merchant';
	}else {
		location.href='/message/received';
	}
});