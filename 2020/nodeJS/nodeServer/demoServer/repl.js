const repl = require('repl');
const replServer = repl.start({prompt: '>'});
replServer.defineCommand('sayhello',
function sayhello(name){
	console.log(`你好,${name}!`);
	this.displayPrompt();
}
// {
	// help: '打招呼',
	// action(name){
	// 	this.lineParser.reset();
	// 	this.bufferedCommand = '';
	// 	console.log(`你好,${name}!`);
	// 	this.displayPrompt();
	// }
// }
);
replServer.defineCommand('saybye',function saybye(){
	console.log('good bye');
	this.close();
});
