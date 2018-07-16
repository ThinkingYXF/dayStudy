interface User{
	name: string,
	age: number
}
function friends(user: User){
	var intro = 'I am ' + user.name + ', ' + user.age + ' years old.';
	return intro;
}
console.log(friends({name:'yxf', age: 20}));


class Shap {
	private color:string;
	area: number;

	constructor(public name:string, width: number, height: number){
		this.area = width * height;
		this.color = 'blue';
	}
}
var newShap = new Shap('square', 20, 20);
console.log(newShap.area, newShap.name);

class Shap3D extends Shap{

	volumn: number;

	constructor(public name: string, width: number, height: number, length: number){
		super(name, width, height)
		this.volumn = length * this.area;
	}
}
var cube = new Shap3D('cube', 30, 30 ,30);
console.log(cube.name, cube.area, cube.volumn);

const abc = 1;
interface People{
	readonly name: string,
	readonly sex: number
}
function xm(person: People){
	console.log(person.name, person.sex);
}
xm({name: 'xiaoming', sex: 1});

interface ClockInterface{
	currentTime: Date;
	setTime(d: Date);
}
class Clock implements ClockInterface {
	currentTime: Date;
	setTime(d: Date) {
		this.currentTime = d;
	};
	constructor(h: number, m: number){}
}


class Animal {
	protected name: string;					//private 只能被自己本身类内部调用		protected 可以被自己和自己的派生类 内部调用
	constructor(name: string){
		this.name = name;
	}
}
class Fox extends Animal {
	color: string;
	constructor(name: string, color: string){
		super(name);
		this.color = color;
	}
	bark(){
		console.log(this.name, this.color);
	}
}
var fox = new Fox('fox1', 'red');
fox.bark();


//存取器
class Company{
	private name: string;
	members: number;

	get companyName():string {
		return this.name;
	}

	set companyName(name: string) {
		this.name = name;
	}
}

var microgravity = new Company();
microgravity.companyName = 'micro';
console.log(microgravity.companyName);

//static 静态属性
class Grid{
	static origin = {x: 0, y: 0};

	calculateDistance(point: {x: number, y: number}){
		let xDist = (point.x - Grid.origin.x);
		let yDist = (point.y - Grid.origin.y);
		return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
	}
	constructor(public scale: number){ }
}

var grid1 = new Grid(1.0);
console.log(grid1.calculateDistance({x: 8, y:10}));

//abstract  抽象类
abstract class Department{
	constructor(public name: string){ };
	printName(): void{
		console.log(`The department name is ${this.name}`);
	}
	abstract printMeeting(): void;		//对应
}

class AccountingDepartment extends Department{
	constructor(){
		super('Accounting depart');
	};
	printMeeting(): void{				//对应
		console.log('The accounting departs meeting at 10AM');
	}
	generateReports(): void{
		console.log('This is generate reports');
	}
}
var department: Department;
department = new AccountingDepartment();
department.printName();
department.printMeeting();
//department.generateReports();	//报错
