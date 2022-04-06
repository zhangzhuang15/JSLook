## 运行代码，观察输出

* 切换到当前目录
* node server.js
* node pool.js
  

代码详细解释见server.js 和 pool.js，  
连接池具体实现见 pool.js.

关于 net 模块API，详情见 NodeJS官网手册。


## 误区
> 客户端socket长时间不发送请求给服务端socket，二者会断开连接？  

    不会的。客户端socket首先和服务端socket进行TCP握手连接，之后
    服务端产生一个worker socket接替服务端socket，和客户端socket
    进行数据交互。只要双方没有主动断开连接，或者网络有什么大的故障，
    他们的数据通讯通道不会轻易挂掉。