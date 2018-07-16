var Area = /** @class */ (function () {
    function Area(persons, seats) {
        this.persons = persons;
        this.seats = seats;
        this.qNumber = this.persons * this.persons / ((this.seats) * (this.seats + 1));
    }
    ;
    Area.prototype.updateQNumber = function () {
        this.qNumber = this.persons * this.persons / ((this.seats) * (this.seats + 1));
    };
    return Area;
}());
// let data = [
// 	{ persons: 30 },
// 	{ persons: 20 },
// 	{ persons: 10 },
// 	{ persons: 6 },
// ]
// let allSeats = 10;
// let addSeats = 5;
function init(allSeats, data, addSeats) {
    var remainSeats = 0, initAllSeats = 0, everySeats = [];
    for (var i = 0; i < data.length; i++) {
        var initSeats = Math.floor(data[i]['persons'] / sumPersons(data) * 10);
        initAllSeats += initSeats;
        everySeats.push(initSeats);
    }
    remainSeats = allSeats - initAllSeats;
    for (var i = 0; i < data.length; i++) {
        data[i]['seats'] = everySeats[i];
    }
    var exchange = data;
    if (remainSeats != 0) {
        exchange = assignSeats(allSeats, data, remainSeats);
    }
    var result = assignSeats(allSeats, exchange, addSeats);
    return result;
    // return {
    // 	allSeats: allSeats,
    // 	personsArray: data
    // }
}
function sumPersons(arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i]['persons'];
    }
    return sum;
}
function maxNumber(numberArr) {
    var max = 0, maxIndex = 0;
    for (var j = 0; j < numberArr.length; j++) {
        if (max < numberArr[j]) {
            max = numberArr[j];
            maxIndex = j;
        }
    }
    return {
        max: max,
        maxIndex: maxIndex
    };
}
//给总席位,各区人数(多少个区 ? ), 新增席位
//传参  传 ?   1. seats (席位总数)	2. 各地区人数数组  [ , , ,]	  3.新增加席位数
function assignSeats(allSeats, personsArray, addSeats) {
    var areaArr = [], qNumbers = [];
    for (var i = 0; i < personsArray.length; i++) {
        var area = new Area(personsArray[i]['persons'], personsArray[i].seats);
        qNumbers.push(area.qNumber);
        areaArr.push(area);
    }
    for (var i = 0; i < addSeats; i++) {
        var result = maxNumber(qNumbers);
        areaArr[result['maxIndex']].seats++;
        updateQNumber();
    }
    function updateQNumber() {
        qNumbers = [];
        for (var j = 0; j < areaArr.length; j++) {
            areaArr[j].updateQNumber();
            qNumbers.push(areaArr[j].qNumber);
        }
    }
    personsArray = areaArr;
    return personsArray;
}
// init();
// let assignObj = init();
// assignSeats(assignObj.allSeats, assignObj.personsArray, addSeats);
