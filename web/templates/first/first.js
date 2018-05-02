$(document).ready(function(){
	$('body').show();
	var direct = null;
	$('.container').fullpage({
		// navigation: true,
		onLeave: function(index, nextIndex, direction){
			direct = direction;
			$('.container > div').removeClass('animate-pre');
			$('.container > div').removeClass('animate-next');
		},
		afterLoad: function(anchorLink,index){
			if(direct == 'up'){
				$(this).addClass('animate-pre');
			}else
				$(this).addClass('animate-next');
		}
	});
});
