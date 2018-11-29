var judgeFn = function(){
    this.abc_0 = function(){
        console.log('abc_0');
    }
    this.abc_1 = function(){
        console.log('abc_1');
    }
    this.abc_2 = function(){
        console.log('abc_1');
    }
}

var fn = new judgeFn();
console.log(typeof fn.abc_1);
if(fn.abc_1 && typeof fn.abc_1 == 'function'){
    fn.abc_1();
}
else{
    fn.abc_1 = fn.abc_0;
    fn.abc_1();
}