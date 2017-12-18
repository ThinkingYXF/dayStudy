$.mask = function(){
    if(!$('.mask').length){
        var mask = $('<div />').addClass('mask');
        $('body').append(mask);
    }
    else
        $('.mask').show();
}
$.hideMask = function(){
    $('.mask').remove();
}