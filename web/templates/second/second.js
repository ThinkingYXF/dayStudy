function animationIn(i){
	$('.product-info').fadeIn();
}
function animationOut(i){
	$('.product-info').fadeOut();
}
$(document).ready(function(){
	var partsType = {"OE":"主机原厂件","SUPPORTOE":"配套原厂件","CIRCULATEOE":"流通原厂件","AM":"经济适用件",
	"BRANDPARTS":"配套品牌件","AFTERMARKETBRANDPARTS":"售后品牌件","DETACHEDPARTS":"拆车回用件",
	"RENOVATIONPARTS":"再制造件","COMMONPARTS":"通用件","CHOICESTPARTS":"精品选装件",
	"INDUSTRIALPARTS":"工业用品","TOOLEQUIPMENT":"工具设备","OTHERS":"其他"};

	$('.product-info').each(function(){
		var span = $(this).find('span');
		span.html(typeToValue(span.html()));
	});

	function typeToValue(type){
		if(!type)
			return '';
		var value = '';
		for(let key in partsType){
			if(key == type || partsType[key] == type){
				value = partsType[key];
				break;
			}
		}
		return value;
	}
});
