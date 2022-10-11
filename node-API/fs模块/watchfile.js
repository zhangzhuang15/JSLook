const fs = require("fs");

var changeTimes = 0; 
const fileWatcher = fs.watchFile(`${__dirname}/test.txt`,
                                  (curr, prev) => {
                                      console.log(`watch ${__dirname}/test.txt`);
                                      console.log(`prev atime: ${prev.atime} \t curr atime: ${curr.atime}`);
                                      changeTimes += 1;
                                      // 将 fileWatcher和主进程事件循环解绑，准许主进程可以退出
                                      if(changeTimes > 2) fileWatcher.unref();
                                  });
// 将 fileWatcher 和主进程事件循环绑定，主进程无法退出；
fileWatcher.ref();


const dirWatcher = fs.watch(__dirname, 
                            (event, filename) => {
                                // 修改目录下文件的内容
                                if(event === "change") {
                                    console.log(`${__dirname} changes: ${filename}`);
                                }
                                // 删除目录下的文件： filename是被删除的文件名；
                                // 新建一个文件： filename 是新建的文件名；
                                // 修改文件名字： 会触发两次事件，第一次事件的filename是原文件名， 第二次事件的filename是新文件名
                                if(event === "rename") {
                                    console.log(`${__dirname} rename: ${filename}`);
                                }
                                changeTimes += 1;
                                if(changeTimes > 3) dirWatcher.unref();
                            });
dirWatcher.ref();


// 只有 fileWatcher dirWatcher都 unref后，主进程才能退出