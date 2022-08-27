const os = require("os");

console.log("os release: ", os.release());  // kernel release
console.log("os version: ", os.version());
console.log("os platform: ", os.platform()); // kernel name
console.log("os type: ", os.type());     // kernel name
console.log("os cpus: ", os.cpus());     // speed unit: MHz
                                         // model: cpu name
                                         // times unit: ms
console.log("os endianness: ", os.endianness()); // 小端字节还是大端字节
console.log("os hostname: ", os.hostname());
console.log("os homedir: ", os.homedir());
console.log("os freemem: ", os.freemem()); // unit byte
console.log("os totalmem: ", os.totalmem()); // unit byte
console.log("os userInfo: ", os.userInfo());
console.log("os uptime: ", os.uptime()); // system running time(unit:s)