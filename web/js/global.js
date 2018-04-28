$.ajaxSetup({
    contents: {
        mycustometype: '/mycustomtype/'
    },
    converters: {
        'text mycustometype': true,
        'mycustometype json': function(result){
            return result;
        }
    },
    data: {name: '123'}
    // beforeSend: function(xhr){

    // }
});
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

//解析excel
$.analysisExcel = function(e, that, callback, obj){
    if (!/\.xlsx?$/.test($(that).val())) {
        alert('请选择Excel文件上传');
        return false;
    }
    var files = e.target.files;
    var file = files[0];
    {
        var reader = new FileReader();
        var name = file.name;  //文件名
        reader.onload = function(e) {
            var data = e.target.result;
            var excelData;
            if(!testIE())
                excelData = XLSX.read(data,{type:'binary'});
            else{
                var arr = fixdata(data);
                excelData = XLSX.read(btoa(arr), {type: 'base64'});
            }
            $.dealExcelData(excelData, callback, obj);
        };
        var size = file.size;  //文件大小
        if((size/1024/1024) > 5){
            $.confirm('您所上传的文件数据量过大，可能会导致浏览器暂时无响应，是否继续？').done(function(){
                testIE()?reader.readAsArrayBuffer(file):reader.readAsBinaryString(file);
            });
        }
        else{
            testIE()?reader.readAsArrayBuffer(file):reader.readAsBinaryString(file);
        }
    }
    //清除  input file 中的value
    that.value = "";
    //是否为IE
    function testIE(){
        if (window.ActiveXObject || "ActiveXObject" in window){
            return true;
        }else{
            return false;
        }
    }
    //为IE时加工数据
    function fixdata(data) {
        var o = "", l = 0, w = 10240;
        for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
        o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
        return o;
    }
}

$.dealExcelData = function(excelData, callback, obj){
    var output = to_json(excelData);
    var uploadData = [];
    var sheetNum = 0;
    $.each(output,function(sheetName,sheetData){
        sheetNum++;
        if(sheetNum == 1){
            var excelResult = [];
            $.each(sheetData, function(){
                if(!obj){
                    excelResult.push(this);
                    return true;
                }
                var oneObj = {};
                $.each(this, function(k, v){
                    var isMatch = false;
                    for(var i in obj){
                        if(k == i){
                            oneObj[obj[i]] = v;
                            isMatch = true;
                            break;
                        }
                    }
                    if(!isMatch)
                        oneObj[k] = v;
                });
                excelResult.push(oneObj);
            });
            if(callback && $.isFunction(callback))
                callback(excelResult);
        }
    });
    //将excel中数据解析成json形式
    function to_json(workbook) {
        var result = {};
        workbook.SheetNames.forEach(function(sheetName) {
            var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            if(roa.length > 0){
                result[sheetName] = roa;
            }
        });
        return result;
    }
}
