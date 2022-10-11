const fs = require("fs");


const dir = fs.opendirSync(__dirname);
console.log(`dir_path: ${dir.path}`);
const dirent = dir.readSync();
console.log(`${dirent.name}  is file: ${dirent.isFile()}  \t is dir: ${dirent.isDirectory()}`);



const fd = fs.openSync(`${__dirname}/test.txt`, 'r');
const buffer = Buffer.alloc(12, 0);
fs.read(fd, 
        buffer, 
        0,       // offset: buffer的偏移量，确定读取到的数据写入到buffer的起始位置，从buffer[0]开始写入
        9,       // length：确定读取的数据长度，读取 9 个字节，也就是3个汉字；
        3,       // position： 文件数据读取的起始位置， 跳过文件开头的3个字节内容，也就是跳过一个汉字
        (err, bytes, buff) => {
            if(!err) {
                console.log("has read ", bytes, " bytes");
                console.log("buffer is same : ", buffer === buff);
                console.log("buff: ", buff.toString());
            }
        }
);