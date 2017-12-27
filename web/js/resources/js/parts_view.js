// 获取配件详情
$(document).ready(function(){
    /**
	 * 筛选框设置(名称,label,关联查询列)
	 * name = [merchant] auto complete
	 */
    $.get('/parts/'+ $('.detail').html() +'',function(data){
		$('#parts_code').html(data.data[0].code);
		$('#parts_name').html(data.data[0].name);
		$('#brand_name').text(data.data[0].brand.name);
	})
})
