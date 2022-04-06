const child = require("child_process");

// spawn 可以是一个 shell进程，也可以是一个非shell进程
const childProcess = child.spawn("node", 
                                ["test.js"],
                                {
                                    shell: false,     // childProcess 直接开启 node 进程，而不是借由一个shell进程创建一个node进程
                                    stdio: "inherit", // childProcess 直接使用父进程的标准输入输出
                                    detached: true,   // 子进程和父进程分离
                                    cwd: __dirname    // 设置 childProcess 的 工作目录， test.js 将在该目录下寻找
                                }
);

// childProcess.unref();

// 发送给子进程信息
if(childProcess.send !== undefined)
    childProcess.send("child, I will exit");

// 获取子进程发来的信息
childProcess.on("message",
                 message => {
                     console.log("main process receive data: ", message.toString());
                 }
);


console.log("main process exit");



// 虽然设置了 detached: true ， 但是主进程依旧会等待 childProcess结束 才退出；
// 将第 14 行 注释打开，主进程输出 "main process exit" 后立即退出，但是childProcess
// 直接使用了 主进程的标准输入输出，所以你依旧可以从终端看到子进程输出的信息