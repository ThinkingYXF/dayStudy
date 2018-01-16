const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
	input: fs.createReadStream('cmd.js'),
	crlfDelay: Infinity
});
rl.on('line',(line)=>{
	console.log(`文件单行的内容为${line}`);
})
