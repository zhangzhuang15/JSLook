vite中扩展了 `import.meta` 对象。

原生浏览器中的`import.meta`对象，只能访问`import.meta.url`。

但是在vite中，用户可以访问`import.meta.env`。

原因何在？

答案就是，vite并没有采用如下方式新增`env`属性，
```js
import.meta.env = { mode: "env" }
```
而是在编译期中使用替换的手段完成`env`属性的支持。

当代码位于编译期时，代码就是赤裸裸的字符串，vite会使用正则表达式检测字符串是否为`import.meta.env`，然后将该字符串替换为一个对象的json string，完成了所谓的`env`属性扩展。

对于一些非内置的env属性，比如内置的有env.MODE, 但用户访问了一个env.TIME, 面对这样的情况，`import.meta.env.TIME`就会被替换成`({}).TIME`, 结果虽然是undefined, 但不会引发代码runtime crash。

这一部分记录在vite源码中的`createReplacePlugin`函数。
![](./%E6%88%AA%E5%B1%8F2023-06-12%2014.45.51.png)