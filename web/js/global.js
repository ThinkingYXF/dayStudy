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
$.selected = function(params,allBtn, cancelBtn){
    var chineseSettings = {
        selectedAll: '全部',
        selectedNone: '取消'
    };
    var usSettings = {
        selectedAll: 'ALL',
        selectedNone: 'CANCEL'
    }
    if(params['language'])
        if(params['language'] === 'zh-CN')
            params['language'] = chineseSettings;
        else
            params['language'] = usSettings;
    else
        params['language'] = usSettings;
    $(allBtn).text(params['language']['selectedAll']);
    $(cancelBtn).text(params['language']['selectedNone']);
}
