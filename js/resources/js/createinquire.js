$(document).ready(function(){
    var merchantId = $('.inquire-name').html();
    var tuColumns = [{
        title: '配件编号',
        data: 'code',
        editor: {
            type: 'input',
            name: 'codes[{}].code',
            className: 'form-control',
            validator: function(value) {
                return $.trim(value) != '';
            }
        }
    }, {
        title: '配件数量',
        data: 'quantity',
        editor: {
            name: 'codes[{}].quantity',
            className: 'form-control',
            validator: /^\d+$/
        }
    },  {
        title: '提示信息',
        data: 'error',
        className: 'error-msg',
        visible: false
    }];
    
    $.get('/data/merchant/'+merchantId,function(data){
        $.get('/data/district/'+data.district,function(data){
            $('.select-city option').eq(0).val(data.data[2].id);
            $('.select-city option').eq(1).val(data.data[1].id);
            $('.select-city option').eq(2).val(data.data[0].id);
            // console.log($('.select-time').value);
            var selectTime = $('.select-time'),
                selectCity = $('.select-city');
            //自动生成时间
            var reg = /\d+/g;
            $('.select-time option').each(function(key,value){
                var value = ($(this).text().match(reg)).toString();
                $(this).val(value * 60);
            })
            $.ajax({
                url:"/price/inquire/bill",
                method:"GET",
                success:function(json){
                    var list = [];
                    $.each(json.data,function(key,val){
                        $.each(val.codes,function(i,child){
                            list.push(child);
                        })
                    })
                    $('#table_container').tableUpload({
                        //url: '/some/url/to/post/to',
                        url: function() {
                            return "/price/createInquire";
                        },
                        columns: tuColumns,
                        data: list,
                        outerFields: function() {
                            return {
                                startTime : Math.floor((new Date().getTime())/1000),
                                endTime : Math.floor((new Date().getTime())/1000) + (selectTime.val() - 0),
                                district: selectCity.val()
                            };
                        },
                        buttons: [{
                            text: '发布',
                            status: 'PUBLISH'
                        }]
                    });
                }
            })
           
        })
    })
});