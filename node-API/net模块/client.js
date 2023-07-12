const net = require("net");

const client = net.createConnection(9008, "localhost", () => {
    console.log("client connect successfully");
    console.log("client remoteAddress: ", client.remoteAddress);
    console.log("client remotePort: ", client.remotePort);
    console.log("client localAddress: ", client.localAddress);
    console.log("client localPort: ", client.localPort);
});
client.on("data", data => {
    console.log("client receive data from server: ", data.toString());
});
client.on("close", () => {
    console.log("client is closing");
});
client.on("end", () => {
    console.log("server socket is closed");
});
client.write("hello server");
// 调用end方法后，client关闭自己的write端，进入半关闭状态
// client不可以再次发送数据，但是可以继续接收
// 服务端socket发来的数据
client.end();
