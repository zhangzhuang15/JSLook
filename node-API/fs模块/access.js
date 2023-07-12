const fs = require("fs");

try {
    fs.accessSync(`${__dirname}/test.txt`, fs.constants.R_OK | fs.constants.W_OK | fs.constants.X_OK);
    console.log(`${__dirname}/test.txt 可读可写可执行么? 可以`);
} catch(e) {
    console.log(`${__dirname}/test.txt 可读可写可执行么? 不可以`);
}


fs.access(`${__dirname}/test.txt`, 
          fs.constants.R_OK | fs.constants.W_OK,
          err => {
              if(err) console.log(`${__dirname}/test.txt 无法被访问`);
              else console.log(`${__dirname}/test.txt 可读可写`);
          } 
);