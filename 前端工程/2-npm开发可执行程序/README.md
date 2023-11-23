## Description
- 介绍如何编写nodejs可执行程序
- 介绍command line 参数接收规律


## nodejs可执行程序 
开发一个可执行程序，要在 `package.json` 的 `bin`字段指定程序入口。

当执行`npm install -g` 的指令安装一个package时, 其 `bin`字段下记录的程序就会安装在主机上，直接使用。

比如`npm install -g vue-cli` 后，就可以直接使用`vue`指令了。


## command line 参数接收规律
我们使用`node`直接执行一个js文件，启动程序，怎样将参数传给 `node`？怎样将参数传给js文件创建的进程呢？

同样，我们也会使用例如`npm run dev` 的方式启动程序，那么如何将参数传给 `dev` 表示的command line 呢？

依次执行`package.json`的`scripts`中的命令，根据输出结果，体会规律吧！

> 在解析 options 参数时，pnpm 和 npm 存在区别！尽量使用pnpm吧，直觉上它更合理
> options参数到底传给npm，还是传给 program file，确实令人头痛，需要查看npm help