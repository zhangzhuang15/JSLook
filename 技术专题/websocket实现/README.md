
### websocket 和 http 共享端口
websocket 和 http 都是属于TCP请求，区别在于请求的内容不同。

**在TCP的角度看**，无论是websocket 还是 http， 请求的内容都是字节码。

**在http的角度看**，请求头是可见字符的字节码，请求体可能是可见字符的字节码，也可能就是二进制字节码（比如mp3 mp4）。如果使用nodejs，基于TCP API实现一个http服务器，你可以将收到的字节码直接转化为字符串，就可以看到请求头了。

**在websocket的角度看**，传输的内容是经历过编码处理后得到的websocket帧数据，这些数据如果直接转化为字符串的话，可能里边有很多奇奇怪怪不可读的字符。

因此，当你使用TCP实现一个服务器的时候，你就必须分析请求的内容，判断这到底是websocket还是http请求。

---
### 为什么websocket和http服务器共享一个端口不会发生冲突呢？

实际上，背后只有一个TCP服务器，监听一个固定的端口，当请求到来时，就会生成一个新的socket来应答请求。

如果是http请求，就会生成一个新的socket来应答http请求；

如果是websocket请求，就会生成另一个新的socket来应答websocket请求；

所以二者根本就没有冲突可言。

**值得注意的是**，websocket在**握手阶段**请求和应答的数据格式服从http协议，在握手之后请求和应答的数据格式服从websocket协议。一旦某个socket已经完成了websocket的握手阶段了，它之后收、发的数据格式都是websocket帧的格式。


---
### 为什么两个http服务器程序无法共享端口
每个http服务器程序背后都是TCP服务器程序，两个http服务器程序就意味着两个TCP服务器程序。TCP服务器程序是无法共享端口的。


---
### 问题
当浏览器发送一个请求时，nodejs中的server会产生一个socket对象来处理该请求，socket使用write方法可以回写响应给浏览器，但这时候浏览器的network会显示响应处于loading状态。

一旦socket调用end方法，响应就打破了loading状态，变成加载完毕的状态，这是为什么呢？

一个请求（预请求或者正式请求）就要使用一个新的socket对象来处理嘛，能不能复用？
不能复用的话，keep-alive的机制有什么用处呢？


```ts
console.log('uou')
let a =3
a  += 3
```
