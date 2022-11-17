### 原理

使用 nodejs 的 API 创建一个 server socket， 令该 socket 按照从小到大的顺序，依次 listen 备选端口号， 如果端口号被占用，listen 回调函数会给出这种情形下的 err 值，之后使用该 socket listen 下一个端口号，最终筛选出最小可用的端口号。

**NOTE**
* socket 由三元组决定 （ip, port, protocol），两个socket，如果三种数据全部相等，就会引发错误，比如 port already exists；
* TCP 和 UDP 是不同的 protocol， 因此 TCP Socket 和 UDP Socket 可以使用同一个 port 号；
* 传输层的数据报中，端口号字段占用 4 字节，因此最大值表示为 2^16 - 1 = 65535;
* 不要把端口号、端口占据的内存 混为一谈；


### 实现的库
portfinder