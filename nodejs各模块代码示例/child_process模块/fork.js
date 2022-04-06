const child = require("child_process");

// fork 直接开启一个 node 进程，只要给出 被执行的 .js 即可
const childProcess = child.fork("test.js", 
                                {
                                    cwd: __dirname,
                                    stdio: "pipe",   // childProcess 的 stdio 和 主进程建立通道 关联;
                                                     // 父子进程建立通道，子进程必须使用 process.exit()退出，关闭通道，否则父进程不会退出;
                                                     // 这个情况下，使用 childProcess.unref()也无济于事，父进程无法退出。
                                    detached: true
                                }
);
/*stdio的解释：
 *  stdio:'pipe'      等效于   stdio:['pipe', 'pipe', 'pipe']
 *  stdio: 'ignore'   等效于   stdio:['ignore', 'ignore', 'ignore']
 *  stdio: 'inherit'  等效于   stdio:['inherit', 'inherit', 'inherit']
 * 
 *  stdio[0] -> stdin
 *  stdio[1] -> stdout
 *  stdio[2] -> stderr
 * 
 *  若 stdout设置为 pipe :
 *           子进程和父进程会建立管道，管道一端是子进程的stdout，管道另一端是父进程中subprocess.stdout;
 *           子进程console.log的结果不会发送到控制台，而是发送给父进程的subprocess.stdout;
 *           父进程是管道读取端，子进程的写入端;
 *           🎉子进程可以使用 process.send 或者 监听message 事件和父进程沟通；
 * 
 *  若 stdout设置为 ipc :
 *           子进程和父进程建立ipc通道，该通道是双向的;
 *           父进程调用subprocess.send发送消息给子进程;
 *           子进程使用process.send发送消息给父进程;
 *           双方可以监听message事件获取对方发来的消息；
 *           🎉父进程无法监听 subProcess.stdout的事件。
 * 
 *  若 stdout设置为 ignore : 
 *           子进程的stdout就会被忽略，指向 /dev/null;
 * 
 *  若 stdout设置为 inherit : 
 *           子进程的stdout将使用父进程的stdout，子进程中console.log一个信息，会在父进程的控制台中输出；
*/

var stdoutBuffer = [];
var stderrBuffer = [];

childProcess.stdout.on("data",
                        chunk => { 
                            stdoutBuffer.push(chunk);
                        }
);

childProcess.stderr.on("data",
                        chunk => {
                            stderrBuffer.push(chunk);
                        }
);

childProcess.stdout.on("close", 
                        () => {
                            stdoutBuffer = stdoutBuffer.map( item => item.toString()).join("");
                            console.log("child stdout: ", stdoutBuffer);
                        }
);

childProcess.stderr.on("close", 
                        () => {
                            stderrBuffer = stderrBuffer.map( item => item.toString()).join("");
                            console.log("child stderr: ", stderrBuffer);
                        }
);

// 接收子进程发送的消息
childProcess.on("message", 
                message => {
                    console.log("main process receive data: ", message.toString());
                }
);

// 发送给子进程消息
childProcess.send("chid, I will exit");

console.log("main process exit");