(function(){//获取field的基础数据
	var urls = [{'id':'code', 'url':'/product/price/code'},{'id':'1005','url':'/field/productgroup'}, {'id':'1007','url':'/field/saleslevel'}, {'id':'1006','url':'/field/atomanufacturer'}, {'id':'1004','url':'/field/atobrand'}, {'id':'1003','url':'/field/partsbrand'}, {'id':'1002','url':'/field/category'}];
	var field_data = {};
	var pn_id=[];
	$.each(urls , function(i, u){
		$.get(u['url'], function(data){
			field_data[u['id']] = data;
			var complete = true;
			$.each(urls, function(i, _u){
				if(!field_data[_u['id']] && complete) complete = false;
			});
			if(complete){
				$(window).trigger('field_data_complete');
			}
		});
	});

	$(document).ready(function(){
		var rule_table = $('#rule_table').DataTable({
			'ajax': '/price/strategies',
			"paging": false,
			"rowId": 'id',
			"processing":true,
			"searching": false,
			"language":language,
			"ordering":false,
			"columnDefs": [
				{ 	"data": "name",
					"targets":0
				},
				{ 	"data": "null",
					"targets":1  ,
					'defaultContent':''
				},
				{ 	"data": function(data){
						return $.timestampToDate(data.createdTime);
					},
					"targets":2 ,
				},
				{ 	"data": function(data){
						return '<a href="/price/strategy/' + data.id + '" class="btn btn-primary btn-sm btn-edit">编辑</a>'
							+'<button class="btn btn-primary btn-sm btn-delete" value="' + data.id + '">删除</button>' ;
					},
					"targets":3  ,
				}
			],
			"info" : false
		}).on('init.dt', function(e, settings, json) {

		}).on('draw.dt', function () {
			$.renderName(rule_table, 'user', 'createdBy', [{'col':1, 'name': 'name'}]);
			//删除role
			$('#rule_table').on('click', '.btn-delete', function(){
				var group_id = $(this).prop("value");
				$.mask();
				$.deleteConfirm(function(){
					$.ajax({
						'url':'/price/strategy/' + group_id,
						'method':'delete',
						'success':function(data){
							$.reloadData(rule_table);
							$.hideMask();
							$.msgBox(data.message);
						}
					})
				});
			});
		});

		//编辑role
		var selection = function(field_id, condition){
			var td = $('<td value="' + field_id + '"></td>');
			var select = $('<select class="form-control" value="' + field_id + '"><option value="-1">请选择</option></select>');
			var data = field_data[field_id];
			if( typeof data == 'object'){
				if(data instanceof Array){
					$.each(data, function(i, d){
						$('<option />').val(d['id']).append(d['name']).appendTo(select);
					});
				} else {
					if(data.success){
						var dd = data.data;
						$.each(dd, function(i, d){
                            var opt = $('<option value="' + d + '" style="background-color:#' + d + ';"></option>');
                            select.append(opt);
						});
					} else {
                        for (var key in data) {
                            if (key != 'data' && key != 'recordsFiltered' && key != 'recordsTotal') {
                                var opt = $('<option value="' + key + '">' + data[key] + '</option>');
                                select.append(opt);
                            }
                        }
                    }
				}
			}
			td.append(select);
			if(condition){
				td.find('select>option').removeAttr('checked');
				td.find('select>option[value="' + condition['name'] + '"]').prop('selected', true);
				td.find('select').attr('condition', condition['id']);
			}
			return td;
		}
		var index = 0;
		var generate_tr = function(tr, con){
			tr.find('td').each(function(){
				if($(this).hasClass('rule-index')){
					$(this).append('<span class="form-control">' + index + '</span>');
				} else if($(this).hasClass('operator')){
					var btn = $('<button class="btn btn-xs btn-danger delete-button"><i class="fa fa-fw fa-minus-circle"></i></button>');
					$(this).append(btn);
				} else if($(this).hasClass("rule-expression")){
					var input = $('<input class="form-control input-expression">');
					if(con && con.expression){
						input.val(con.expression);
					}
					$(this).append(input);
				} else if($(this).hasClass("start-time")) {
					var input = $('<input class="form-control input-start" name="start_date">');
					$(this).append(input);
				} else if($(this).hasClass("end-time")){
					var input = $('<input class="form-control input-end" name="end_date">');
					$(this).append(input);
				} else if($(this).hasClass("btn-move")) {
                    var btn_move = $('<div><i class="fa fa-fw fa-angle-up btn-move-up"></i></div>'+
						             '<div><i class="fa fa-fw fa-angle-down btn-move-down"></i></div>');
                    	$(this).append(btn_move);
				} else if($(this).hasClass("rule-pn"))	{
					var rule_input = $('<input class="form-control rule-input">');
						$(this).append(rule_input);
				}else {
					var field_id = $(this).attr('value');
                    $(this).append(selection(field_id, con && con[field_id]));
				}

			});
            tr.find('.btn-move-up').click(function () {
				if(tr.index() === 1){
					return;
				}
                tr.fadeOut().fadeIn();
				tr.prev().before(tr);
                update_index();
            });

            tr.find('.btn-move-down').click(function () {
            	if(tr.index() === tr.parent().children().length-1){
            		return;
				}
                tr.fadeOut().fadeIn();
                tr.next().after(tr);
                update_index();
            });
			tr.find('input[name="start_date"]').datepicker({
					dateFormat: 'yy-mm-dd',
					onSelect: function(dateText, inst) {
						$(this).removeClass('error-border');
						var star = (new Date(dateText).getTime())/1000;
						$(this).attr('time', star);
						var end = tr.find('input[name="end_date"]').attr('time');
						if(end && end < star){
							$(this).addClass('error-border');
							$.msgBox("开始时间需小于结束时间", "warning");
						}
					}
			}).val(con && con.start_time && $.simpleDate(con.start_time));
			if(con && con.start_time) tr.find('input[name="start_date"]').attr('time', con.start_time);
			tr.find('input[name="end_date"]').datepicker({
				dateFormat: 'yy-mm-dd',
				onSelect: function(dateText, inst) {
					$(this).removeClass('error-border');
					var d = (new Date().getTime())/1000;
					var end = (new Date(dateText).getTime())/1000;
					if(end < d){
						$(this).addClass('error-border');
						$.msgBox("结束时间需大于当前时间", "warning");
					}
					var star = tr.find('input[name="start_date"]').attr('time');
					if(star && end < star){
						$(this).addClass('error-border');
						$.msgBox("结束时间需大于开始时间", "warning");
					}
					$(this).attr('time', end);
				}
			}).val(con && con.end_time && $.simpleDate(con.end_time));
			if(con && con.end_time) tr.find('input[name="end_date"]').attr('time', con.end_time);
			index ++;
		}

		var update_index = function(){
			$('#add_rule_table tr.rule').each(function(i){
				var e_index = i + 1;
				$(this).find('td.rule-index').html('<span class="form-control">' + e_index + '</span>');
			});
		};
		var change_color = function () {
            $('#rule_code select').each(function () {
            	$(this).change(function () {
                    $(this).css('background-color','#'+$(this).val());
                });
            });

        }
		$(window).on('field_data_complete', function(){
			//数据加载完后创建规则表格
			$('.btn-add-condition').removeClass('hidden').click(function(e){
				e.preventDefault();
				$('.conditions').removeClass('hidden');
				var tr = $( '<tr class="rule">' +
							'<td class="btn-move"></td>'+
		                    '<td class="rule-index"></td>' +
							'<td class="rule-pn" value="1008"></td>' +
		                    '<td value="1002"></td>' +
		                    '<td value="1003"></td>' +
		                    '<td value="1004"></td>' +
		                    '<td value="1005"></td>' +
		                    '<td value="1006"></td>' +
		                    '<td value="1007"></td>' +
							'<td value="code" id="rule_code"></td>'+
		                    '<td class="rule-expression"></td>' +
		                    '<td class="start-time"></td>' +
	   	 					'<td class="end-time"></td>' +
		                    '<td class="operator"></td>' +
		                  	'</tr>');
					if(parseInt($('.conditions').attr('strategy_id')) > 0){
                        $('#add_rule_table tbody tr:last-child').before(tr);
					}else {
                        $('#add_rule_table tbody').append(tr);
                    }
					generate_tr(tr);
					update_index();
                	change_color();
            });
			$('.btn-delete-condition').click(function(e){
				e.preventDefault();
				var $this = $(this);
				$.deleteConfirm(function(){
					index = 1;
					e.preventDefault();
					$this.addClass('hidden');
					$('.btn-add-condition').removeClass('hidden');
					$('#add_rule_table tr.rule').remove();
					var tr = $( '<tr class="rule">' +
                        		'<td class="btn-move"></td>'+
                        		'<td class="rule-index"></td>' +
								'<td class="rule-pn" value="1008"></td>' +
	                    		'<td value="1002"></td>' +
	                    		'<td value="1003"></td>' +
	                    		'<td value="1004"></td>' +
	                    		'<td value="1005"></td>' +
	                    		'<td value="1006"></td>' +
	                    		'<td value="1007"></td>' +
                        		'<td value="code" id="rule_code"></td>'+
								'<td value="rule-expression"></td>' +
	                    		'<td class="start-time"></td>' +
   	 							'<td class="end-time"></td>' +
	                    		'<td class="operator"></td>' +
	                  			'</tr>');
					$('#add_rule_table tbody').append(tr);
					generate_tr(tr);
                    change_color();
				});
			});
			//编辑模式
			if(parseInt($('.conditions').attr('strategy_id')) > 0){
				var strategy_id = parseInt($('.conditions').attr('strategy_id'));
				$.get('/strategy/' + strategy_id, function(data){
					if(data.success){
						var strategy = data.data[0];
                        var edit_color = [];
						$('#group_name').val(strategy.name);
						$('#group_code').val(strategy.code);
						$('#group_id').val(strategy.id);
						$.each(strategy.rules, function(i, rule){
                            edit_color.push(rule);
                            var tr = $( '<tr class="rule">' +
                                		'<td class="btn-move"></td>'+
                                		'<input type="hidden" value="' + rule.id + '">' +
				                    	'<td class="rule-index"></td>' +
                                		'<td class="rule-pn" value="1008"></td>' +
				                    	'<td value="1002"></td>' +
				                    	'<td value="1003"></td>' +
				                    	'<td value="1004"></td>' +
				                    	'<td value="1005"></td>' +
				                    	'<td value="1006"></td>' +
				                    	'<td value="1007"></td>' +
                                		'<td value="code" id="rule_code"></td>'+
                                		'<td class="rule-expression"></td>' +
				                    	'<td class="start-time"></td>' +
			   	 						'<td class="end-time"></td>' +
				                    	'<td class="operator"></td>' +
				                  		'</tr>');
							$('#add_rule_table tbody').append(tr);
							var con = {};
							$.each(rule.conditions, function(i, condition){
								con[condition.field.id] = {'name': condition.name, 'id': condition.id};
								pn_id.push(condition.field.id === 1008?condition.id:undefined);
							});
							con['expression'] = rule.expression;
							con['start_time'] = rule.startTime;
							con['end_time'] = rule.endTime;
							generate_tr(tr, con);
							update_index();
                            change_color();
						});
                        $('#add_rule_table tr.rule').each(function (i) {
                            if(edit_color[i].conditions){
                                $(this).find('.rule-input').val(edit_color[i].conditions[0].name);
                            }
                            $(this).find('#rule_code select').css('background-color','#'+edit_color[i].code);
                            $(this).find('#rule_code select').val(edit_color[i].code);
                        });
					}
				});
			} else {
				var tr = $('#add_rule_table tr.rule').last();
				generate_tr(tr);
			}
			$('#add_rule_table').on('click', 'tr.rule .btn', function(e){
				e.preventDefault();
				$(this).find('i').removeClass('fa-minus-circle').addClass('fa-plus-circle');
				$(this).removeClass('btn-danger delete-button').addClass('btn-primary add-button');
				$(this).parent().parent().remove();
				//刷新index
				update_index();
			});
		});
		//全角转半角
        function ToCDB(str) {
            var tmp = "";
            for(var i=0;i<str.length;i++)
            {
                if(str.charCodeAt(i)>65248&&str.charCodeAt(i)<65375)
                {
                    tmp += String.fromCharCode(str.charCodeAt(i)-65248);
                }
                else
                {
                    tmp += String.fromCharCode(str.charCodeAt(i));
                }
            }
            return tmp;
        }
	$('form').submit(function(){
        var param = {};
		/*if(!$('form .conditions').hasClass('hidden')){
			$('form .condition').each(function(i){
				param['conditions[' + i + '].field.id'] = $(this).find("select.fields").find("option:selected").val();
				param['conditions[' + i + '].name'] = $(this).find("select.field-values").find("option:selected").val();
                param['conditions[' + i + '].field.id'] = $(this).find('.rule-pn').attr('value');
                param['conditions[' + i + '].name'] = $('.rule-input').val();
			});
		}*/

		if($('#group_id').length > 0){
			param['id'] = $('#group_id').val();
		}
		$('#group_name').removeClass("error-border");
		if( $('#group_name').val() == ''){
			$('#group_name').addClass("error-border");
			$.msgBox("策略名不应为空", "warning");
			return false;
		}
        $('#group_code').removeClass("error-border");
        if( $('#group_code').val() == ''){
			$('#group_code').addClass("error-border");
			$.msgBox("编码名不应为空", "warning");
			return false;
		}
        /*if($('#rule_code select').val() == '-1'){
            $.msgBox('请选择颜色', 'warning');
            return false;
        }*/
		param['code'] = $('#group_code').val();
		param['name'] = $('#group_name').val();


		param[$('#_csrf').attr('name')] = $('#_csrf').val();
		var has_blank = false;
		var has_invalid = 0;
		if($('form input.input-expression').each(function(){
			if(!has_blank && ($(this).val() == '')){
				has_blank = true;
			}
			if($(this).val() == ''){
				$(this).css('border-color', '#d73925');
			} else {
				$(this).css('border-color', '#d2d6de');
			}
		}));
		if(has_blank){
			$.msgBox('有规则的折扣未填', 'warning');
			return false;
		}
		if(!$('form .conditions').hasClass('hidden')){
			var rule_index = 0;
			if(parseInt($('.conditions').attr('strategy_id')) > 0){
				param['id'] = parseInt($('.conditions').attr('strategy_id'));
			}
			$('#add_rule_table tr.rule').each(function(i){
				param['rules[' + rule_index + '].expression'] = ToCDB($(this).find('input.input-expression').val().trim());
                param['rules[' + rule_index + '].code'] = $(this).find('#rule_code select').val();
                var rule_exp = ToCDB($(this).find('.input-expression').val()).trim().match(/^([\+\-])?(\d+(\.\d+)?)$/);
				var startTime = $(this).find('input.input-start').attr('time');
				var endTime = $(this).find('input.input-end').attr('time');
				if($(this).find('#rule_code select').val() == '-1'){
                    $.msgBox('请选择颜色', 'warning');
					has_invalid = 1;
					return;
                }
                if(!rule_exp){
                    $.msgBox('折扣不允许字母或汉字','danger');
                    has_invalid = 1;
                    return
                }
				switch (rule_exp[1]){
					case "-":
						if(rule_exp[2] > 100){
							$.msgBox("第"+$(this).index()+"条规则折扣应小于100","danger");
                            has_invalid = 1;
						}
						break;
					case undefined:
						if(rule_exp[2] < 1){
                            $.msgBox("第"+$(this).index()+"条规则折扣应大于0","danger");
                            has_invalid = 1;
                        }
						break;
				}
				if(startTime && endTime && endTime < startTime){
					$.msgBox("规则" + (rule_index +1) + "的结束时间小于起始时间", "warning");
					return false;
				}
				if($(this).find('input[type="hidden"]').length > 0){
					param['rules[' + rule_index + '].id'] = $(this).find('input[type="hidden"]').val();
				}
				if(startTime > 0){
					param['rules[' + rule_index + '].startTime'] = startTime;
				}
				if(endTime > 0){
					param['rules[' + rule_index + '].endTime'] = endTime;
				}
				var index =0;
                param['rules[' + rule_index + '].conditions[' + index + '].field.id']= $(this).find('.rule-pn').attr('value');
                param['rules[' + rule_index + '].conditions[' + index + '].name'] = $(this).find('.rule-input').val();
                if(pn_id[i]){
                    param['rules[' + rule_index + '].conditions[' + index + '].id'] = pn_id[i];
                }
                index ++;
				/*$(this).find('.rule-input').each(function (i) {
				    console.log(i)
                    param['rules[' + rule_index + '].conditions[' + index + '].field.id']= _this.find('.rule-pn').attr('value');
                    param['rules[' + rule_index + '].conditions[' + index + '].name'] = _this.find('.rule-input').val();
                    if(pn_id[i]){
                        param['rules[' + rule_index + '].conditions[' + index + '].id'] = pn_id;
                    }
                    index ++;
                });*/
				$(this).find('select').each(function(){
                    if(!($(this).attr('value') == 'code')){
                        if($(this).val() != '-1'){
                            param['rules[' + rule_index + '].conditions[' + index + '].id'] = $(this).attr('condition');
                            param['rules[' + rule_index + '].conditions[' + index + '].field.id']= $(this).parent().attr("value");
                            param['rules[' + rule_index + '].conditions[' + index + '].name'] = $(this).find('option:selected').val();
                            index ++;
                        }
					}

				});
				rule_index ++;
			});
		}
		if(has_invalid === 1){
			return false;
		}
		console.log(param);
		$.ajax({
			'url':'/strategy',
			'method':'post',
			'data': param,
			'success':function(data){
				$.msgBox(data.message);
				$.jump('/strategies');
			}
		});
		return false;
	});
});
})();