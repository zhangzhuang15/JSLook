## what 
monorepo是对代码的一种组织形式。传统情形，一个项目对应一个仓库（**multi repo**）。在monorepo的情景下，多个
项目会放进同一个仓库.遵循这种形式，就可以称之为monorepo。

具体实现方面，可以灵活一些。以lerna为代表的方案，是monorepo；不采用lerna这种方案，也可以达成monorepo。

接下来就举一个例子：
```
root----
      |---- static 
              |---- app1.html 
              |---- app2.html 
      |---- src 
              |---- app1 
                     |---- App.vue 
                     |---- main.js
              |---- app2
                     |---- App.jsx 
                     |---- main.js 
```

app1 和 app2 位于同一个项目管理，其工作流是这样的：
1. 用webpack打包app1项目，启动dev server 
2. 本地配置nginx，或者自己编写proxy服务器，启动
3. 访问http连接，proxy服务器会将 app1.html 返回
4. app1.html的script的src写成固定的url，该url指向webpack处理好的bundlejs
5. proxy服务器将url请求转发给dev server，dev server将bundlejs返回
   
这里边没有使用 lerna，但它依旧算是monorepo

