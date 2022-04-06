/**
 * cluster  该模块基于child_process模块
 * 用于建立多进程通讯, 特别是网络相关的多进程通讯;
 * 子进程通过建立IPC管道和主进程连接， 主进程和子进程的process关联来和子进程连接;
 */

const cluster = require("cluster");
const http = require("http");

function request(message) {
    let req = http.request(
        {
            hostname: "localhost",
            port: 8991,
            method: "POST",
            path: "/database"
        })
    req.write(message)
    req.end()
}



 /** 主进程 */
if(cluster.isPrimary){
   
    // 创建子进程， 返回一个Worker对象，该对象的process属性指向子进程
    const wk = cluster.fork();

    // 主进程message事件监听;
    wk.on("message", message => {
        console.log(`从子进程(id:${wk.id})中传来了消息：${message}`);      // wk.id 不是子进程PID， wk.process.id才是
        // 在主进程中，调用worker对象的send方法，把消息发送给子进程;
        wk.send("子进程，主进程在等着你呢");
        setTimeout(() => { wk.send("close");}, 5000);
    });
    
    // 主进程使用 cluster.fork衍生出一个子进程时调用
    cluster.on("fork", worker => {
        console.log(`主进程衍生了一个子进程${worker.id}, 它的IPC连接上主进程了么？${worker.isConnected()}`);
    });
    
    // 子进程开始运行时调用
    wk.on("online", () => {
        console.log(`子进程${wk.process.pid}开始运行`);
    });

    // 子进程结束时调用
    wk.on("exit", (code, signal) => {
        console.log(`子进程${wk.process.pid}断开， 返回码是${code}， \
        子进程退出时收到的信号是${signal}`);
    });

    // 子进程调用listen方法后调用
    wk.on("listening",  address => {
        console.log(`子进程${wk.process.pid}开始监听端口，address:${address.address} addressType:${address.addressType} port:${address.port}`);
      
        request("hello child Process");
        
    });
    
    // 当子进程结束的时候，主进程也会退出;
    // 这是因为主进程中设置来很多事件监听器，当没有子进程的时候，
    // 主进程中的事件loop将会被终止，从而导致主进程退出;

} else {
    // 子进程
    //cluster
    var count = 10;
    var result = 0;
    for(; count < 100; count++){
        result += count
    }

    http.createServer(
        (req, res) => {
            let list = [];
            req.on("data", chunk => { list.push(chunk.toString()) })
            req.on("end", () => {
                console.log(`子进程服务器收到消息${list.join("")}`)
                res.write(`子进程${process.pid}收到`);
                res.end();
            })
        }
    )
    .listen(8991);

    // cluster.worker 指向当前进程;
    // send 发送消息给主进程；
    cluster.worker.send(result);
    // 子进程监听message事件，一定是父进程发来的，所以不需要worker参数
    cluster.worker.on("message", (message) => {
        console.log(`来自主进程发来的消息：${message}`);
        if(message === 'close'){
            // 子进程中 kill方法会断开IPC管道， 以代码0退出子进程
            // 主进程中 kill方法会断开与worker.process的连接，并发送给子进程signal杀死子进程
            cluster.worker.kill();
            //cluster.worker.disconnect();
        }
    });
}