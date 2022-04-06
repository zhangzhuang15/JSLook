const fs = require("fs");

// fs.constants.COPYFILE_EXCL 表示 dest文件一定不能存在；
// 忽略第三个入参，如果dest文件存在，直接进行内容覆盖，不会报错；
fs.copyFileSync(`${__dirname}/test.txt`, `${__dirname}/test.txt.bak`, fs.constants.COPYFILE_EXCL);
