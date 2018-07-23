//previous
if($.billCodes){
	var isReturn = false;
	$.each($.billCodes,function(k,v){
		if(v.selected){
			$.each(rows.indexes(),function(i,idx){
				var rowData = rows.row(idx).data();
				var billCode = $.trim(v.code);
				var tableCode = $.trim(rowData['request']['code']);
				if(billCode != tableCode)
					return true;
				//删除不存在数据的组
				if(rowData['product']['name'] == '无供应'){
					selectRow( group,  0);
					isReturn = true;
					return false;
				}
				if(v.selected == rowData['id']){
					selectIdx = idx;
					isReturn = true;
					return false;
				}
			});
			if(!isReturn && k == $.billCodes.length - 1)
				selectRow( rows.row(rows.indexes()[0]).data()['request']['code'],  rows.row(rows.indexes()[0]).data()['id']);
		}
		if(isReturn)
			return false;
		if(k == $.billCodes.length - 1 && !isReturn){
			$.each(rows.indexes(),function(i,idx){
				var rowData = rows.row(idx).data();
				//删除不存在数据的组
				if(rowData['product']['name'] == '无供应'){
					// selectRow( group,  0);
					isReturn = true;
					return false;
				}
			});
			if(isReturn)
				return false;
			else
				selectRow( rows.row(rows.indexes()[0]).data()['request']['code'],  rows.row(rows.indexes()[0]).data()['id']);
		}
	});
}
else if(rows.row(rows.indexes()[0]).data()['product']['name'] != '无供应')
	selectRow( rows.row(rows.indexes()[0]).data()['request']['code'],  rows.row(rows.indexes()[0]).data()['id']);







//now
if($.billCodes){
	var isReturn = false;
	$.each($.billCodes, function(codeIndex, code){
		if(code.selected){
			$.each(rows.indexes(),function(rowIndex,row){
				var rowData = rows.row(row).data();
				var billCode = $.trim(code.code);
				var tableCode = $.trim(rowData['request']['code']);
				if(billCode != tableCode)
					return true;
				//删除不存在数据的组
				if(rowData['product']['name'] == '无供应'){
					isReturn = true;
					selectRow( code.code,  0);
					return false;
				}
				else if(code.selected == rowData['id']){
					isReturn = true;
					selectIdx = rowIndex;
					return false;
				}else{
					//selected不匹配重新选择
					selectRow( code.code,  rowData['id']);
				}
			});
			if(isReturn)
				return true;
		}else{
			let isFind = false;
			//无selected  添加selected
			$.each(rows.indexes(),function(rowIndex,row){
				var rowData = rows.row(row).data();
				var billCode = $.trim(code.code);
				var tableCode = $.trim(rowData['request']['code']);
				if(billCode != tableCode)
					return true;
				else if(rowData.product.name != '无供应'){
					selectRow(tableCode, rowData['id']);
					isFind = true;
					return false;
				}
			});
			//没找到 删除selected
			if(!isFind){
				selectRow( code.code,  0);
				return true;
			}
		}
	});
}


//latest
if($.billCodes){
	var isReturn = false;
	$.each(rows.indexes(),function(rowIndex,row){
		var rowData = rows.row(row).data();
		var tableCode = $.trim(rowData['request']['code']);
		$.each($.billCodes, function(codeIndex, code){
			var billCode = $.trim(code.code);
			if(billCode == tableCode){
				isReturn = true;
				//删除不存在数据的组
				if(rowData['product']['name'] == '无供应'){
					selectRow( code.code,  0);
					return false;
				}
				if(code.selected){
					if(rowData['id'] == code.selected){
						if(rowData['price'] == code.price){
							selectIdx = rowIndex;
							return false;
						}else{
							selectRow( code.code,  rowData['id']);
							return false;
						}
					}else{
						selectRow( code.code,  0);
						return false;
					}
				}else{
					selectRow( code.code,  rowData['id']);
					return false;
				}
			}
		});
		if(isReturn)
			return false;
		else if(rowIndex == rows.indexes().length-1 && !isReturn){
			var id = rowData['id'];
			if(rowData['product']['name'] =='无供应')
				id = 0;
			selectRow( tableCode,  id);
		}
	});
}
else if(rows.row(rows.indexes()[0]).data()['product']['name'] != '无供应')
	selectRow( rows.row(rows.indexes()[0]).data()['request']['code'],  rows.row(rows.indexes()[0]).data()['id']);
