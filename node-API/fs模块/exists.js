const fs = require("fs");

let exist = fs.existsSync(`${__dirname}/test.txt`) || false;
console.log(`${__dirname}/test.txt exist ? ${exist}`);