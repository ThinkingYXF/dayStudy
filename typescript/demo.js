var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function friends(user) {
    var intro = 'I am ' + user.name + ', ' + user.age + ' years old.';
    return intro;
}
console.log(friends({ name: 'yxf', age: 20 }));
var Shap = /** @class */ (function () {
    function Shap(name, width, height) {
        this.name = name;
        this.area = width * height;
        this.color = 'blue';
    }
    return Shap;
}());
var newShap = new Shap('square', 20, 20);
console.log(newShap.area, newShap.name);
var Shap3D = /** @class */ (function (_super) {
    __extends(Shap3D, _super);
    function Shap3D(name, width, height, length) {
        var _this = _super.call(this, name, width, height) || this;
        _this.name = name;
        _this.volumn = length * _this.area;
        return _this;
    }
    return Shap3D;
}(Shap));
var cube = new Shap3D('cube', 30, 30, 30);
console.log(cube.name, cube.area, cube.volumn);
var abc = 1;
function xm(person) {
    console.log(person.name, person.sex);
}
xm({ name: 'xiaoming', sex: 1 });
var Clock = /** @class */ (function () {
    function Clock(h, m) {
    }
    Clock.prototype.setTime = function (d) {
        this.currentTime = d;
    };
    ;
    return Clock;
}());
var Animal = /** @class */ (function () {
    function Animal(name) {
        this.name = name;
    }
    return Animal;
}());
var Fox = /** @class */ (function (_super) {
    __extends(Fox, _super);
    function Fox(name, color) {
        var _this = _super.call(this, name) || this;
        _this.color = color;
        return _this;
    }
    Fox.prototype.bark = function () {
        console.log(this.name, this.color);
    };
    return Fox;
}(Animal));
var fox = new Fox('fox1', 'red');
fox.bark();
//存取器
var Company = /** @class */ (function () {
    function Company() {
    }
    Object.defineProperty(Company.prototype, "companyName", {
        get: function () {
            return this.name;
        },
        set: function (name) {
            this.name = name;
        },
        enumerable: true,
        configurable: true
    });
    return Company;
}());
var microgravity = new Company();
microgravity.companyName = 'micro';
console.log(microgravity.companyName);
//static 静态属性
var Grid = /** @class */ (function () {
    function Grid(scale) {
        this.scale = scale;
    }
    Grid.prototype.calculateDistance = function (point) {
        var xDist = (point.x - Grid.origin.x);
        var yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    };
    Grid.origin = { x: 0, y: 0 };
    return Grid;
}());
var grid1 = new Grid(1.0);
console.log(grid1.calculateDistance({ x: 4, y: 10 }));
