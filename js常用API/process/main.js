/**
 *  process 是对进程的封装，利用该模块可以
 *   1、获取进程信息（pid ppid exitCode gid）
 *   2、父子进程间数据发送
 *   3、获取关于 node本身 os本身的信息
 */

console.log("what operation system on this machine:  ", process.platform);
console.log("the cpu structure : ", process.arch);
console.log("node version : ", process.version);
console.log("node download url : ", process.release);
console.log("node version and other versions : ", process.versions);
console.log("the cpu usage of this process : ", process.cpuUsage());
console.log("the resource usage of this process : ", process.resourceUsage());
console.log("the memory usage of this process : ", process.memoryUsage());
/**
 *  note that
 *       rss  include  memory of C++ and js
 *       heapTotal and heapUsed include memory of js
 */
console.log("the process pid : ", process.pid);
console.log("the process ppid : ", process.ppid);
console.log("the process uid : ", process.getuid());
console.log("the process gid : ", process.getgid());
console.log("current workspace dir of this process : ", process.cwd());
console.log("environment variables of the process : ", process.env);


/**
 *  process.kill( pid )    to   send a signal to process
 *  process.abort()        to terminate the process
 *  process.exit( code )         to terminate the process with a code
 *  process.send( message )     to send message to parent process
 *  
 *  furthermore, there are also some events in process, you can use them
 *  to finish some special works, such as getting message from parent process
 */