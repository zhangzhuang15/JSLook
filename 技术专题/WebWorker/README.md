## 与 shared worker 的区别
使用worker创建的线程是私有的，shared worker创建的线程是共有的。

比如同一个worker.js，页面A创建一个worker，页面B创建一个worker，这
两个worker代表不同的线程，如果换做shared worker，这两个worker代表
同一个线程；