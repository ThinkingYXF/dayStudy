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
$.dateSelected = function(dom, callback){
    $(dom).datepicker({
        autoclose: true,
        dateFormat: "yy-mm-dd",
		dayNamesMin: ['日','一','二','三','四','五','六'],
        monthNames: [ "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月" ]
    }).on('hide',function(e){
        var selectedTime = parseInt(new Date(e.date).getTime()/1000);
        if(callback && $.isFunction(callback))
            callback(selectedTime);
    });
}
