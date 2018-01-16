const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: '请输入>'
});
rl.prompt();
rl.on('line',(line)=>{
	switch (line.trim()){
		case ('hello' || 'Hello'):
		console.log('world!');
		break;
		default:
		console.log(`您输入的是${line.trim()}`);
	}
	rl.prompt();
}).on('close',()=>{
	console.log('再见');
	process.exit(0);
})
