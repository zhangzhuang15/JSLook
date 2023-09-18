const fs = require("fs");

let result = fs.readFileSync("./response_body.txt");
result = result.toString();

const reg = /"text":"(.*?)"/g;

let r = "";

for(;;) {
    const t = reg.exec(result);
    if (t === null) break;
    r += t[1];
}

console.log(r);