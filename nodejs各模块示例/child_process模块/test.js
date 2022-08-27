// 配合 spawn.js 使用
// 也配合 fork.js 使用

setTimeout(
    () => {
        console.log("child process exit");
        process.exit(1);
    },
    5000
)

// 接收 父进程传来的信息
process.on("message", 
            message => {
                console.log("child receive data: ", message.toString());
            }
);

// 发送给父进程信息，如果父子进程没有建立IPC通道，send方法就会是undefined
if(process.send !== undefined)
    process.send("hello main process");

console.log("child process is running")