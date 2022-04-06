const net = require("net");
const fs = require("fs");

// 连接的不是 ip address，port； 连接的是本地供ipc的文件 
const client = net.createConnection(__dirname + "/server.sock", () => {
    console.log("client connect successfully too");
});
client.write("hello server");
client.end();
client.on("close", () => {
    fs.rm(__dirname + "/server.sock", () => { console.log("删除 server.sock")});
});