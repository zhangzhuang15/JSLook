出于特别的原因，我们很想知道在执行`npm install`之后，npm都做了些什么，依次安装哪些package。

方法就是`npm install --loglevel=verbose`

下图就是一个结果：
![npm install --loglevel=verbose](./example.png)

可见，事无巨细地输出日志。

当然，如果你只关心日志的错误信息，可以执行`npm install --loglevel=error`
> 这个指令在 esbuild 源码中使用过