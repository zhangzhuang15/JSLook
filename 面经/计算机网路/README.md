[toc]

### tcp三次握手、四次分手
三次握手：
```
客户端                 服务端
closed状态             listen状态
      sync包---------->
sync sent状态
      <------sync ack包 
                      sync receive状态
      sync ack包----->
established状态
                      established状态
```
四次挥手：
```
客户端                 服务端
established状态        established状态
      fin包----------->
fin-wait-1状态 
      <-------fin ack包
                      close-wait状态
fin-wait-2状态
      <-----------fin包
                      last-ack状态
time-wait状态 
      ------->fin ack包
                      closed状态
after 2MSL,
change to 
closed status
```
> fin-wait-1状态开始，客户端不会再继续发送业务数据给服务端了
> fin-wait-2状态和time-wait状态，客户端可能仍然会收到服务端发送来的业务数据
> last-ack状态开始，服务端不会再继续发送业务数据给客户端了

TIME_WAIT阶段的目的：
为了防止之前的连接的数据包在网络中滞留，并确保连接的可靠关闭。这样可以避免新的连接与之前的连接混淆。
网络中的数据包可能会经历延迟、重传或乱序等情况。即使对方发送了FIN包，但在网络中可能仍然存在该连接的数据包，这些数据包可能在TIME_WAIT状态期间到达。因此即使进入了TIME_WAIT状态，该方仍然会接收到对方发送的数据。

当网络中迟滞的数据全部接收到后，time-wait状态就结束了，怎么判断迟滞的数据全部接收到了呢？
1. 监听接收数据的事件或函数，在接收到数据时进行处理。
2. 使用定时器等机制，在一定时间内等待数据的到达，如果在超时时间内没有收到数据，则可以认为延迟的数据已经全部接收到。
  
> 需要注意的是，网络中的数据传输可靠的，可能会出现延迟、丢重传或乱序等情况。因此，**无法百分之百**确定延迟的数据是否全部接收到，只能按一定的机制来尽量保证数据的可靠性。

### https握手过程
首先完成tcp的三次握手；
接着：
1. 客户端发送请求给服务端，申请服务端证书，还会将自己支持的TLS协议版本和加密套件告诉服务端；
2. 服务端将证书以明文的方式发送给客户端，还会将服务端选择的TLS协议版本和加密套件告诉客户端；
3. 客户端验证证书，从证书里提取服务端perm（公钥），客户端生成对称密钥，将对称密钥用服务端公钥加密，发送给服务端；
4. 服务端返回ack，告知客户端刚才的请求已经收到。

补充知识点：
1. 数字证书 
由权威机构颁发或者个人创建的证书，里面包含申请方的公钥、域名信息、hash算法、有效期、数字签名等等

2. 数字签名 
个人或者权威机构，对数字证书的内容，使用某种hash算法处理，得到散列值，然后用自己的私钥加密这个散列值，得到的数据，就是数字签名

3. 数字证书如何抵御中间人攻击
- 如果中间人篡改数字证书的信息，在浏览器使用内置的CA机构公钥解密数字签名后，会发现数字签名和证书正文信息不一致，从而发现中间人攻击风险；
  
- 如果中间人将数字证书调包成自己的数字证书，由于数字证书写着网站域名信息，浏览器就会发现证书和目标网站不一致，从而发现中间人攻击；

### http1.1 的队首阻塞
ref: 
- https://zhuanlan.zhihu.com/p/330300133#什么是队头阻塞（Head-Of-Line%20Blocking）？
- https://calendar.perfplanet.com/2020/head-of-line-blocking-in-quic-and-http-3-the-details/

http1.1，只允许上一个请求完整返回后，再去处理下一个请求。当上一个请求的返回值很大时，比如一个大型的文件，下一个请求就被阻塞住了，这就是队头阻塞。

**为什么上一个请求得到完整返回后，才能处理一个请求呢？**
这是因为相邻两个http返回值，在tcp层面，二者的数据可能混淆到一个tcp package里。tcp不知道哪些tcp package之间存在关系，只有遵守前后顺序，才能解决package间的关联问题。

如果不遵守顺序，浏览器无法分清楚上一个请求的返回值到哪个tcp package结束。

**http1.1支持多个并行的tcp连接，难道解决不了这个问题么？**
主流浏览器支持单个域名最多创建6个tcp连接。如果你请求的资源是6个，恰巧分配到6个tcp连接上，单独看一个tcp连接，它只会处理一个资源，不会有队头阻塞的问题。可实际上，你请求的资源不只6个，那么依然会出现单个tcp连接上，请求若干个资源的现象，这就又出现队头阻塞的问题。
另一方面，打开多个tcp连接，很增加操作系统压力。

**http/1.1的 pipeline 特性解决不了该问题么**
pipline特性，可以让多个请求一个接一个发送出去，不需要等待上一个请求返回后，再发送下一个请求，但是在处理请求的返回结果时，必须要在处理上一个请求结果之后，再处理下一个结果，这里依旧是队首阻塞问题。

### tcp的队头阻塞
应用层有队头阻塞问题，tcp层次也有。其原因在于，当tcp发送数据包1、2、3，对方接收到1、3，发现缺少数据包2，于是暂停将数据包3返回，这样数据包2就阻塞了数据包3。如果缺失数据包1，那么数据包2、3就会被阻塞。

不过这个队头阻塞和包的丢失率有关，一般情况下，包的丢失率非常小，因此tcp队头阻塞不是性能瓶颈。

但对于包丢失率较高的网络环境中，这就是瓶颈了，于是才迎来QUIC协议为代表的http3.0


### http2.0如何解决队首阻塞问题
数据帧。

在http1.1中，返回值是一个文本形式的报文，这个报文来到tcp层面，会被切割、分散到若干个更小的package里。

数据帧则是主动地将报文切割成更小的数据单元，即**数据帧**，而tcp层面，一个tcp package会包含一个或者若干个数据帧。

二者的区别在于，数据帧里包含顺序信息，数据帧可以乱序发送到另一端，另一端根据数据帧里的顺序信息，再将数据帧里的数据顺序整合。

发送http response的时候，直接按照数据帧发送，没有了报文的概念，这个数据帧可能是来自第一个请求的返回值，也可能是来自第二个请求的返回值。

### http2.0的多路复用和http1.1的pipeline有什么区别？
![](./pipeline_multilexer.png)

pipeline方式解决了请求的队头阻塞问题，但是没有解决响应的队头阻塞问题；

### QUIC不一定比TCP快的原因
- 要对QUIC package进行加密，而不是有效负载数据整体进行加密
- 多个流数据情形下，单个流数据依旧存在队头阻塞

QUIC提升速度的一些方法：
1. 增大QUICK package size, 比如 1460bytes
2. 用linux的GOS将多个udp package作为一个package处理
3. 减少ack package，比如每收到10个package，返回一个ack package，默认情况下，是收到2个package，返回一个ack package

### tcp连接中端口能不能重用
端口可以重用。默认情况下，TCP端口在被使用后会进入**TIME_WAIT**状态，这个状态会持续一段时间（通常是几分钟），在此期间该端口不能被其他进程或线程使用。这是为了确保之前的连接已经完全关闭，防止出现数据混乱或冲突的情况。

然而，有时候我们希望能够立即重用端口，而不必等待TIME_WAIT状态结束。这可以通过设置SO_REUSEADDR套接字选项来实现。当设置了SO_REUSEADDR选项后，即使端口处于TIME_WAIT状态，也可以立即重用该端口。

需要注意的是，使用SO_REUSEADDR选项时需要小心，因为如果两个连接使用相同的源IP、源端口、目标IP和目标端口，而且其中一个连接处于TIME_WAIT状态，那么**新连接可能会收到之前连接的残留数据**。因此SO_REUSEADDR选项时，需要确保不会出现这种情况，以避免数据混乱。

### http服务升级为websocket后，能不能继续提供服务
可以的。http服务升级为websocket，意味着某个应答socket自此接受websocket形式的报文。当向监听socket发送一个新的http请求时，监听socket会生成一个新的应答socket去处理。二者的应答，发生在不同的socket上，不会冲突。

### 前端如何设置Token，控制客户登录状态？
Token假设是 [JWT(JSON Web Token)](https://jwt.io/introduction).

Token可以在前端生成，也可以在后端生成。

如果是在前端生成，前端会使用 XMLHttpRequest 设置 `Authorization` http header, 采用 `Bear` scheme, 然后伴随请求发送给后端，同时前端会将这个token存储在本地，比如 localStorage。
> Authorization不是 forbidden header，因此可以用XMLHttpRequest设置。
> 
当前端发送请求的时候，可以检查这个token，判断用户登录是否超时了，由前端将用户踢出登录状态。

<br>

如果是后端生成，可以由以下几种方式返回给前端：
- 放在 `set-cookie` 响应头里；
- 放在服务端自定义的响应头里；
  > 后端还需要设置 `access-control-allow-headers` `access-control-expose-headers`
- 放在返回的响应体数据里；
前端拿到token后，存储到本地，在接下来的请求中，根据token判断用户登录是否过期。

### cookie的几个问题
#### 如何禁止js访问cookie值
在服务端设置Set-Cookie Header，或者使用 document.cookie修改cookie时，将cookie的 httpOnly 属性设置为 true。

```txt 
Set-Cookie: name=jack; HttpOnly
```

#### 浏览器端js能访问哪些cookie？
取决于 Cookie 的 Domain 和 Path。

实验：[cookie接收实验](../../技术专题/cookie/index.js)

结论：
浏览器位于页面：http://a.b.com/index.html, 
发送请求：http://a.b.com/api, 
响应头：
```txt 
Set-Cookie: a=4
Set-Cookie: b=5; Path=/index.html 
Set-Cookie: c=6; Path=/api 
Set-Cookie: d=7; Domain=b.com
Set-Cookie: e=8; Domain=b.com; Path=/work
```
你能使用document.cookie访问到 a b d.
因为：
c 的路径是 /api, 不是 /index.html, 无法被访问;
d 的域名是 b.com，a.b.com是 b.com的 subdomain, 可以被访问到；
e 的域名情况和d一样，但是Path没有匹配 /index.html, 无法被访问；

在上述操作基础上，再次发送一个请求: http://b.com/abi，并且带上cookie，则服务端只能收到d.
因为：
a b c 的域名都是 a.b.com， 不是 b.com；
e 的域名是正确的，但是 Path不匹配 /abi;



### 为什么浏览器要加入同源策略？
因为要保证安全。

XSS(跨站脚本攻击)：当用户已经登录一个网站后，登录权限的信息会存储在cookie上，然后用户进入黑客的网站，点击黑客网站上的链接，触发了一次请求，如果没有同源策略限制，这次请求就会将cookie发送出去，躲过权限验证。

CSRF(跨站请求攻击)：用户登录一个网站，比如一个评论区，黑客在评论区里发送一段html，埋下了一个链接。用户点击黑客的评论时，就会发送一个请求，此时这个请求里就包含了用户登录的信息cookie，如果没有同源策略限制，这个请求就发出去了，可能就绕过了后端的身份验证，但是有同源策略的话，就会被拦下。

### 哪些资源文件被允许跨域
js css png mp3 mp4 pdf 这些文件都被允许跨域访问；

注意，上述文件如果经过 Ajax or Fetch，依旧会引发跨域哦

### 为什么设置Token可以防范 CSRF ？
因为CSRF只会将cookie转发，它并不知道cookie里有什么，也无法修改cookie，如果在cookie之外，比如请求体中加入一个token验证，那么真正安全的请求里就会有这个token，但是CSRF却无法做到。

### preflight request 有啥作用？
当发送跨域请求时，你使用XMLHttpRequest发送了一个请求，如果这个请求是 non-simple 请求，浏览器会先发送一个preflight request， 这个请求通过后，再发送你定义的那个请求。

之所以需要 preflight request, 还是出于安全问题。先发送一个请求给后端，让后端知道发送方是什么情况，如果在安全范围内，后端再设置一次安全范围内的http请求字段给对方，让对方接下来的请求中可以发送这些字段给自己。如果超出安全范围，后端可以直接拒绝。

注意啊，这个preflight request，只有请求头，请求行，没有请求体，不会带来通信压力。

### 什么是 simple request ?
simple request可以是跨域请求，也可以不是；
满足以下所有要求，就是 simple request：
- 请求方法仅限：Get Post Head 
- 除了浏览器自动添加的请求头外，只能包含这些请求头：
  - Accept
  - Accept-Language
  - Content-Language
  - Content-Type, 且只能选择这些值：
    - application/x-www-form-urlencoded
      ```txt 
      name=jack&age=5
      ```
    - multipart/form-data
      ```txt 
      POST /upload HTTP/1.1
      Host: example.com
      Content-Type: multipart/form-data; boundary=AABBCCJ

      --AABBCCJ
      Content-Disposition: form-data; name="file"
      Content-Type: text/plain
      Content-Length: 3

      abc
      --AABBCCJ--
      ```
    - text/plain
  - Range， 必须是 simple range header value，比如`bytes=256- `
- 如果使用XMLHttpRequest发送请求，不能使用`xhr.upload.addEventListener`
- 请求中不能使用 ReadableStream，比如你用 fetch 发送了一个请求，并且使用 response.body 读取数据


### 如何理解不能用编程的方式修改 forbidden header ?
请求头里，有一部分字段，完全由浏览器控制，这部分字段被称作 forbidden header。

也就是说，你不需要自己添加这些字段，当你使用XMLHttpRequest 和 fetch 发送请求的时候，浏览器会自动给你加上。如果你强行使用 XMLHttpRequest 或 fetch 给添加上了，浏览器可能会报错或者直接忽略掉你设置的这些字段值。

不能用编程的方式修改，就是说你不能用 XMLHttpRequest 和 fetch 直接设置这些字段值。像 cookie 字段，你没办法在XMLHttpRequest直接设置, 但是你却可以用document.cookie修改，这并不会妨碍 cookie就是 forbidden header 的事实。编程方式，说的就是 XMLHttpRequest 和 fetch 

### CSP(Content Security Policy)
refer:
https://content-security-policy.com/#directive

CSP的实质就是白名单制度，开发者明确告诉客户端，哪些外部资源可以加载和执行，等同于提供白名单。它的实现和执行全部由浏览器完成，开发者只需提供配置.

开发者配置 `Content-Security-Policy` response header 实现。


### url最长有多长
|浏览器 or 服务器 |url最大长度|
|:---:|:---:|
| IE | 2083个字符 |
| Firefox | 65536个字符 |
| Safari | 80000个字符 |
| Opera | 190000个字符 |
| Chrome | 8182个字符 |
| Apache服务器 | 8192个字符 |
| Microsoft Internet Information Server(IIS) | 16384个字符 |

### http中get请求和post请求的区别
Get请求：数据放在url中传输；不太安全；请求的数据可以被浏览器缓存；幂等请求，不会改变服务器状态；
> 按照Http/1.1规范，Get请求的数据不可以放在body里，但在具体实现上，可以放在body里 

Post请求：数据放在body中传输；较安全；请求的数据不可以被浏览器缓存；非幂等请求;

### http请求中的强制缓存和协商缓存
强制缓存是指，浏览器请求一个资源的时候，不询问服务器，直接从本地内存或者磁盘获取；
> 应用场景：不需要经常更新，比如网站logo；

协商缓存是指，浏览器请求一个资源的时候，都要询问服务器，验证资源的过期情况，如果没有过期，直接从本地获取，否则重新从服务器获取；
> 应用场景：资源更新频率不大，比如网站头条新闻；

强制缓存相关的请求头：
- `cache-control`
  - no-store  资源完全不缓存
  - no-cache  资源需要缓存，每次请求资源时，要向服务器验证资源是否过期
  - max-age=200 资源需要缓存，在缓存后的200s内是未过期的

- `Expires`, 指定一个时间，在该时间之后，资源就认为是过期了
  > Cache-Control优先级比Expires高，二者存在，Expires会被忽略


协商缓存相关的请求头：
- `ETag` 资源的字符串标记，当资源更新时，字符串标记会重新生成，并且和以前的标记不一样，用作 response header
- `If-Match` 指定资源的字符串标记，服务器拿到该字段去判断资源是否过期，搭配 `ETag` 使用；

- `Last-Modified` 服务器通过这个header，告诉浏览器资源最近更新的时间节点 
- `If-Modified-Since` 搭配`Last-Modified`使用，存储的是上一次`Last-Modified`的时间节点，如果在这个时间节点之后，资源被修改，服务器将最新的资源返回给浏览器，否则浏览器直接从本地缓存获取

强和弱是针对是否要发送请求和后端协商而言的，无需协商，就是强制缓存


### 什么是uuid？
uuid(Universally Unique Identifier), 由32个16进制数组成的数字标识，如 "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAB92";

按照这样的规律，uuid的数量非常庞大，使用者可以用它作为资源的唯一标识符号。

### OSI模型中各层协议举例
* 应用层
  * http
  * ftp
  * nfs
  * smtp
* 传输层
  * tcp
  * udp
  * spx
* 网络层
  * ip
  * icmp
* 数据链路层
  * atm
  * fddi
* 物理层
  * rj45
  * 802.3
  * x.25


<br>

### 一台 24 口的交换机连接了 8 台设备，这里有多少个广播域？
1个广播域。
> 1. 冲突域是第一层物理层的概念，用第二层及其以上的设备才可以分离冲突域；  
> 2. 广播域是第二层数据链路层的概念，用第三层及其以上的设备才可以分离广播域;  
> 3. 交换机属于第二层的设备，所以可以分离冲突域，但不能分离广播域.
> 4. 一台交换机中的每个端口都是一个冲突域，而所有的端口构成一个广播域，有8台设备连接了交换机，则一共有8个冲突域，一个广播域。

<br>

### 在小红书公司的局域网中，署队长的私人电脑可以查看到的同事的电脑，也成功了登录了QQ，但无法访问到公司的站点"http://www.xiaohongshu.com”,请协助署队长查找最有可能出现的问题的地方是？
> UDP   
> DHCP  
> DNS  
> HTTP  
> 浏览器

解答：
* 可以访问QQ，说明UDP没问题；
* 可以看到同事的电脑，说明内网可以连上，DHCP没问题；
* 此时最有可能的就是DNS出现问题，无法解析到站点IP。
  
答案：`DNS`

<br>

### 网络拓扑结构中存在网桥S1、S2、S3、S4，若对应MAC地址分别为AABB-CCDD-EE00、AABB-CCDD-EE11、BBBB-CCDD-EE00、BBBB-CCDD-EE11,所有网桥优先级采用默认值,则使用STP协议后，哪个网桥会被确定为根网桥?
> S1   
> S2  
> S3  
> S4   

解答：
* 在一个广播域里找根网桥，在该广播域当中找网桥ID最小的交换机做根网桥。
* 优先级相同的情况下再去对比MAC地址，MAC地址最小的交换机做根网桥。
* 采取STP协议，在网桥优先级采用默认的情况下，网桥应该选择MAC地址较小的地址.

答案： `S1`