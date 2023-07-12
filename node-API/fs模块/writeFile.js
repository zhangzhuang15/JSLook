const fs = require("fs");


fs.writeFileSync(`${__dirname}/test.txt`, 
                 "随便写一行的啦\n",
                 {
                     flag: 'a'              // flag 用来设置写的方式 。'a' 表示追加写； ‘w’ 表示从头写； ‘r’ 表示从头读。
                 }
);

fs.writeFile(`${__dirname}/test.txt`,
                "再写一行吧\n",
                {
                    flag: 'a'
                },
                err => {
                    if(err) console.log(`when write to ${__dirname}/test.txt Error: ${err}`);
                }
);


const writeStream = fs.createWriteStream(`${__dirname}/test.txt`, { flags: 'a', encoding: 'utf8'});
// 如果写入到缓存了，返回 true， 缓存中的数据将异步地被操作系统写入到文件中；
// 如果返回 false， 表示缓存已经满了，无法再写入数据了，必须等待操作系统将缓存中的数据消费后，才能继续写入，这会通过"drain“事件通知你
writeStream.write("写完这行就是第几行了？\n");
writeStream.end(); // 关闭 writeStream
// end 无法保证 writeStream 立即关闭，因此要使用close事件。
writeStream.on("close", 
                () => {
                    writeStream.destroy();
                }
);