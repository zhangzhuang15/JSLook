const fs = require("fs");



const buffer = fs.readFileSync(`${__dirname}/test.txt`);
console.log("test.txt 1: ", buffer.toString());



fs.readFile(`${__dirname}/test.txt`, 
            (err, data) => {
                console.log("test.txt 2: ", data.toString());
            }
);


const readStream = fs.createReadStream(`${__dirname}/test.txt`, 
                                        {
                                            start: 3       // 表示跳过test.txt开头3个字节，从第4个字节开始读。
                                                           // 一个汉字占3个字节，因此 ‘随’ 没被读到。
                                        }
);
readStream.on("data", 
              chunk => {
                  console.log("test.txt 3: ", chunk.toString());
              }
);

// 当读入流没有可读数据了，触发
readStream.on("end", 
              () => {
                  readStream.destroy();
              }
);