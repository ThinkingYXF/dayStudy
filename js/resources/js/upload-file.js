 function mask(){
	 if($('.mask').length == 0){
		 $('body').append('<div class="mask"></div>');
	 }
	 $('.mask').show();
	 
 }
 function hideMask(){
	 $('.mask').hide();
 }
$(document).ready(function(){
	$('#upload_file').change(function(){
		if(!$('form input[type="file"]').val().endsWith('.xls') 
				&& !$('form input[type="file"]').val().endsWith('.xlsx') && !$('form input[type="file"]').val().endsWith('.csv')){
			parent.validFileTypeFailed && parent.validFileTypeFailed();
			return false;
		}
		var params = false;
		if(parent.withParam){
			params = parent.withParam();
			debugger;
			if(!params) {
				$('form input[type="file"]').val('');
				return false;
			} else {
				if(typeof params == 'object'){
					for(var key in params){
						$('form.upload-file').append('<input type="hidden" name="' + key +'" value="' + params[key] + '">');
					}
				}
			}
		}
		if($('.upload-file .upload-btn').length > 0){
			$('.upload-file .upload-btn').attr('disabled', true);
		}
		if($('form input[type="file"]').val()=='') return false;
		$('form.upload-file').submit();
		mask();
	});
	if($('#fileContent').length > 0){
		parent.uploadFileSuccess && parent.uploadFileSuccess();
	}
	if($('.success').length > 0){
		parent.uploadFileSuccess && parent.uploadFileSuccess();
	}
	$('.btn.delete-file').click(function(){
		var fileId = $(this).attr('data');
		mask();
		$.ajax({
				'url':'/message/attachment/' + fileId,
				'type':'DELETE',
				'success':function(data){
					if(data.success){
						parent.doDeleteFile && parent.doDeleteFile(fileId);
					} else {
						parent.msgBox('删除文件失败');
					}
					hideMask();
				}
		});
	});
	$('.upload-file .upload-btn').click(function(){
		$('#upload_file').trigger('click');
	});
});