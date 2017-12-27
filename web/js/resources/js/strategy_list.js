function uploadFileSuccess() {
    $.jump("/strategies");
}
function doDeleteFile(fileId) {
}
$(document).ready(function () {
    var start = 0;
    var return_data = [];
    var strategy_table = $('#strategy_table').DataTable({
        "ajax": {
            url: "/strategies",
            headers: {
                "Accept": "application/json"
            },
        },
        "scrollCollapse": true,
        "rowId": 'id',
        "processing": true,
        "searching": true,
        "ordering": false,
        "paging": false,
        "serverSide": false,
        "language": language,
        "columnDefs": [
            //{ 	"data": "id",
            {
                "data": "code",
                "targets": 0,
                "searchable": true,
                "defaultContent": ""
            },
            {
                "data": "name",
                "targets": 1,
                "defaultContent": '',
                "searchable": true
            },
            {
                "data": function (data) {
                    return_data.push(data.id);
                    return $.timestampToDate(data.createdTime);
                },
                "targets": 2,
                "defaultContent": ""
            },
            {
                "data": "",
                "targets": 3,
                "defaultContent": ""
            },
            {
                "data": "",
                "targets": 4,
                "defaultContent": ""
            },
            {
                "data": function (data) {
                    return '<button class="btn btn-primary btn-sm btn-edit" value="' + data.id + '">编辑</button>' +
                        '<button class="btn btn-primary btn-sm btn-save" value="' + data.id + '">保存</button>' +
                        '<a class="btn btn-primary btn-sm btn-details" href="/strategy/' + data.id + '" value="' + data.id + '">详情</a>' +
                        '<button class="btn btn-primary btn-sm btn-delete" value="' + data.id + '">删除</button>';
                },
                "targets": 5,
            }

        ],
        "info": false
    }).on('init.dt', function (e, settings, json) {
    }).on('draw.dt', function () {
        /* 点击编辑按钮获取这一列的id,进入这个id策略的详情页面,从
         $('#strategy_table .btn-edit').on('click',function() {
         var sid = $(this).attr('value');
         });*/
        //循环tr
        //全角转半角
        function ToCDB(str) {
            var tmp = "";
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
                    tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
                }
                else {
                    tmp += String.fromCharCode(str.charCodeAt(i));
                }
            }
            return tmp;
        }

        var rule_id_arr = [undefined];
        $('#strategy_table tr').each(function (i) {
            var _this = $(this);
            var rule_id;
            $(this).find('.btn-save').hide();
            if (i !== 0) {
                var sid = $(this).find('.btn-delete').attr('value');
                if (!sid) return true;
                var strategy_td = $(this).children();
                var base_peice = strategy_td.eq(3);
                var base_add_price = strategy_td.eq(4);
                $.get('/strategy/' + sid + '/rule/last', function (data) {
                    if (data.success) {
                        if (data.data[0]) {
                            var data_code = data.data[0].code;
                            var data_exp = data.data[0].expression;
                            rule_id_arr[i] = data.data[0].id;
                            //base_peice.css('background-color','#'+data.data[0].code);
                            base_peice.html($('<span></span>').css({
                                'display': 'block',
                                'background-color': '#' + data.data[0].code,
                                'width': '75px',
                                'height': '25px'
                            }));
                            base_add_price.text(data.data[0].expression);
                        }
                        //编辑
                        _this.find('.btn-edit').bind('click', function () {
                            rule_id = rule_id_arr[i];
                            _this.find('.btn-save').show();
                            _this.find('.btn-edit').hide();
                            var price_input = $('<input class="form-control input-expression price-input" />').val(data_exp);
                            base_add_price.text('');
                            base_add_price.append(price_input);
                            $.get('/product/price/code', function (data) {
                                if (data.success) {
                                    base_peice.empty();
                                    var price_selection = $('<select class="form-control price-seclect" value="' + sid + '"><option value="-1">请选择</option></select>');
                                    $.each(data.data, function (i, v) {
                                        var opt = $('<option value="' + v + '" style="background-color:#' + v + ';"></option>');
                                        price_selection.append(opt);
                                    });
                                    price_selection.val(data_code).css('background-color', '#' + data_code);
                                    base_peice.append(price_selection);
                                    base_peice.find('.price-seclect').change(function () {
                                        $(this).css('background-color', '#' + $(this).val());
                                    });
                                }
                            });
                        });
                        //删除
                        _this.find('.btn-delete').unbind().bind('click', function () {
                            $.deleteConfirm(function () {
                                $.mask();
                                $.ajax({
                                    "url": '/strategy/' + sid,
                                    "method": "delete",
                                    "success": function (data) {
                                        $.msgBox(data.message);
                                        $.reloadData(strategy_table);
                                        $.hideMask();
                                    }
                                });
                            });
                        });
                        //保存
                        _this.find('.btn-save').bind('click', function () {
                            var upload_edit = {};
                            upload_edit.code = base_peice.find('select').val();
                            upload_edit.expression = base_add_price.find('input').val().trim();
                            var rule_exp = ToCDB(upload_edit.expression).trim().match(/^([\+\-])?(\d+(\.\d+)?)$/);
                            if (!rule_exp) {
                                $.msgBox('折扣不允许字母或汉字', 'danger');
                                return;
                            }
                            switch (rule_exp[1]) {
                                case "-":
                                    if (rule_exp[2] > 100) {
                                        $.msgBox("第" + (_this.index() + 1) + "条规则折扣应小于100", "danger");
                                        return;
                                    }
                                    break;
                                case undefined:
                                    if (rule_exp[2] < 1) {
                                        $.msgBox("第" + (_this.index() + 1) + "条规则折扣应大于0", "danger");
                                        return;
                                    }
                                    break;
                            }
                            $.ajax({
                                "url": '/strategy/' + sid + '/rule/last',// + "?id="+rule_id+"&expression="+upload_edit.expression+"&code="+upload_edit.code,
                                "method": "PUT",
                                "data": {
                                    id: rule_id_arr[i],
                                    expression: upload_edit.expression,
                                    code: upload_edit.code
                                },
                                "success": function (data) {
                                    $.msgBox(data.message);
                                    if (data.success) {
                                        data_code = upload_edit.code;
                                        data_exp = upload_edit.expression;
                                        _this.find('.btn-save').hide();
                                        _this.find('.btn-edit').show();
                                        base_peice.find('select').remove();
                                        base_add_price.find('input').val('').remove();
                                        //base_peice.css('background-color','#'+upload_edit.code);
                                        base_peice.html($('<span></span>').css({
                                            'display': 'block',
                                            'background-color': '#' + upload_edit.code,
                                            'width': '75px',
                                            'height': '25px'
                                        }));
                                        base_add_price.text(upload_edit.expression);
                                    }
                                }
                            });
                        });
                    }
                });
            }
        });
        /* //删除规则
         $('#strategy_table .btn-delete').each(function(i){
         var sid = $('#strategy_table .btn-delete').eq(i).attr('value');
         var strategy_tr = $('#strategy_table tr').eq(i+1).children();
         $.get('/strategy/rule/'+sid,function (data) {
         strategy_tr.eq(3).css('background-color','#'+data.data[0].code);
         strategy_tr.eq(4).text(data.data[0].expression);
         });
         $(this).unbind().bind('click', function(){
         $.deleteConfirm(function(){
         $.mask();
         $.ajax({
         "url":'/strategy/' + sid,
         "method":"delete",
         "success":function(data){
         $.msgBox(data.message);
         $.reloadData(strategy_table);
         $.hideMask();
         }
         });
         });
         });
         });*/
    });
    //下拉框颜色
    var color_code = [];
    $.get('/product/price/code', function (data) {
        color_code = data.data;
    });
    //创建
    $('#btn-create').click(function () {
        codeSelect();
    });
    //策略名查询
    $('.name_query').on('click', function () {
        var val = $('#group_name').val();
        if (val == '') {
            $.msgBox("策略名不能为空", "warning");
            $('#group_name').addClass('error-border');
            return;
        }
        strategy_table.columns(0).search('').columns(1).search(val).draw();
        return;
    });
    //编码查询
    $('.btn-query').on('click', function () {
        var val = $('#group_code').val();
        if (val == '') {
            $.msgBox("编码不能为空", "warning");
            $('#group_code').addClass('error-border');
            return;
        }
        strategy_table.columns(0).search(val).columns(1).search('').draw();
        return;
        /* var filters = strategy_table.column(0).data().filter(function(value){
         return value == val ? true : false;
         });
         if(filters.length == 0){
         codeSelect();
         }*/

    });
    //模态框
    function codeSelect() {
        var opt = {
            "id": "user_info",
            "title": "添加规则",
            "width": 450,
            "height": 400,
            "level": "info",
            "closeIcon": false
        };
        opt.content = '<form class="form-horizontal user-info"><div class="box-body">'
            + '<div class="form-group"><input type="hidden" name="addprice">'
            + '<label for="user_code" class="col-sm-3 control-label">编码</label>'
            + '<div class="col-sm-9">'
            + '<input type="text" class="form-control" id ="group_code" name="code">'
            + '</div></div>'
            + '<div class="form-group">'
            + '<input type="hidden" name="userId">'
            + '<label for="inputEmail3" class="col-sm-3 control-label">策略名</label>'
            + '<div class="col-sm-9">'
            + '<input type="text" class="form-control" name="c_name">'
            + '</div></div>'
            + '<div class="form-group"><input type="hidden" name="price">'
            + '<label for="user_code" class="col-sm-3 control-label">基础价格表</label>'
            + '<div class="col-sm-9">'
            + '<select class="form-control" id="price-table"></select>'
            + '</div></div>'
            + '<div class="form-group"><input type="hidden" name="addprice">'
            + '<label for="user_code" class="col-sm-3 control-label">基础加价</label>'
            + '<div class="col-sm-9">'
            + '<input type="text" class="form-control" id ="add-price" name="userCode">'
            + '</div></div>'
            + '</div>'
            + '<div class="box-footer">'
            + '<button type="submit" class="btn btn-info pull-right user-confirm">确认</button>'
            + '<button class="btn btn-default user-cancel">取消</button>'
            + '</div></form>';
        module = $.doModule(opt, function (module) {
            $('#price-table').empty();
            $('#price-table').append($('<option value="-1">请选择</option>'));
            $.each(color_code, function (i, v) {
                $('#price-table').append($('<option value="' + v + '" style="background-color:#' + v + ';"></option>'));
            });
            function add_rule() {
                var param = {};
                param['code'] = module.find('input[name="code"]').val();
                param['name'] = module.find('input[name="c_name"]').val();
                param['rules[0].code'] = $('#price-table').val();
                param['rules[0].expression'] = $('#add-price').val();
                console.log(param);
                $.ajax({
                    'url': 'strategy',
                    'method': 'post',
                    'data': param,
                    'success': function (data) {
                        $.msgBox(data.message);
                        $.reloadData(strategy_table);
                    }

                });
            }

            $('.user-confirm').click(function () {
                add_rule();
                module.find('.btn-box-tool').trigger('click');
            });
            module.find(".user-cancel").unbind().click(function (e) {
                e.preventDefault();
                module.find('.btn-box-tool').trigger('click');
                $('.mask').hide();
            });
            $('#price-table').change(function () {
                $(this).css('background-color', '#' + $(this).val());
            });
        });
    }

});
