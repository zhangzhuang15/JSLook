/**
 * 使用 readline 可以实现一个终端交互界面，就像cmd和bash一样.
 * 
 * readline模块只负责从指定的输入流读入数据，做一些处理后，将数据写入到指定的输出流。
 * 
 * 如果想对终端做一番控制，比如说清屏（clear的效果），还需要tty模块辅助。
 * 
 * readline中的函数，已经对tty部分的函数做了封装，不用单独引入tty.
 * 
 * 如果想实现一些更具体的定制化的tty功能，还是要结合tty。
 */

const readline = require("readline");
const child_process = require("child_process");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "Robot"
});
var where = __dirname;

rl.question("what's your name?\n", name => {
    console.log("hello  ", name);
    rl.setPrompt(where+">>>");
    rl.prompt();
});



rl.on("line", command => {
    if( command == "exit"){
        process.exit();
    }
    if ( command == "clear") {
        process.stdout.cursorTo(0, 0);
        rl.prompt();
        return;
    }
    const newCommand = where == ""? command + " && pwd": `cd ${where} && ${command} && pwd`;
    child_process.exec(newCommand, ( err, result, errText) => {
        if (err){
            console.log(errText);
        } else {
            const output = result.split("\n").slice(0, -2).join("\n");
            console.log(output);
        }
        if (command.includes("cd")) where = result.split("\n").slice(-2)[0];
        rl.setPrompt(where+ ">>");
        rl.prompt();
    });
});