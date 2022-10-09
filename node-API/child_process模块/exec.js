const child = require("child_process");

// exec 启动一个 shell 进程
const childProcess = child.exec("echo hello world", 
                                 (err, stdout, stderr) => {
                                    // err 是在创建子进程的时候发生的错误, 不是子进程执行过程中产生的错误
                                    if(err) {
                                        console.log("child process Error: ", err);
                                    } else {
                                        console.log("stdout: ", stdout);
                                        if(stderr.length > 0) {
                                            console.log();
                                            console.log("stderr: ", stderr);
                                        }
                                    }
                                }
);

childProcess.on("close", 
                (code, signal) => {
                    console.log("exit code: ", code);
                    console.log("exit signal: ", signal)
                }
);