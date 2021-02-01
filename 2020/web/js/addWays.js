$.dealNumber = function(num){
    if(num < 10)
        return '0' + num;
}
//选出数组中最大或最小的数  arr str('max' or 'min')
$.arrayMaxOrMin = function(arr, str){
    if(arr.length && arr.length > 0){
        if(str == 'max'){
            var initNum = arr[0];
            $.each(arr,function(i, v){
                if(initNum > v)
                    return true;
                else
                    initNum = v;
            });
            return initNum;
        }
        else if(str == 'min'){
            var initNum = arr[0];
            $.each(arr,function(i, v){
                if(initNum < v)
                    return true;
                else
                    initNum = v;
            });
            return initNum;
        }
    }
    else{
        return '该数组为空';
    }
}
/**
*记录当前dom的纵向滚动条 并设置纵向滚动条
*
*/
$.domScrollY = function(dom, action, scrollY){
    if(action == 'get'){
        scrollY = $(dom).scrollTop();
        return scrollY;
    }
    else if(action == 'set')
        $(dom).scrollTop(scrollY);
}
