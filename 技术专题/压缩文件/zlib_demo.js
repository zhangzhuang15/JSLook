const zlib = require("zlib");
const fs = require("fs");

const readStream = fs.createReadStream("./test.mp3");
const writeStream = fs.createWriteStream("./test.mp3.gz");
const gzip = zlib.createGzip();
readStream.pipe(gzip).pipe(writeStream).on("finish", () => {
    console.log("压缩test.mp3文件完毕");
});

