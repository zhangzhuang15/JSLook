### 如何判断是否安装了yarn?
用exec 函数，执行 `yarn --version` ，没报错，就是安装了
> 拓展一下，判断其他软件是否安装了，就可以使用这种思路

---

### 如何判断项目使用yarn搭建的？
* 判断安装了`yarn`
* 判断是否有 `yarn.lock`

---

### 如何判断项目已经被git管理？
用 exec 函数执行 `git status`, 没有报错。

---

### 如何判断node程序运行在容器中？
```javascript

const fs = require('fs');

if (fs.existsSync('/proc/1/cgroup')) {
    const content = fs.readFileSync(`/proc/1/cgroup`, 'utf-8')
    return /:\/(lxc|docker|kubepods(\.slice)?)\//.test(content)
}
return false
```

---

### 如何用命令行方式判断某个平台上有没有安装什么软件？
* Linux 平台，安装一个软件后，就会有这个软件的二进制文件，
  执行 二进制文件名的  --version 命令即可，没有报错，就是安装了；
* Mac 平台，需要用 `mdfind` 找到该可执行文件，没有报错，就是安装了；
  ```shell
  # 以判断是否安装google浏览器为例

  # 如果google浏览器存在，命令会返回 google浏览器这个
  # 软件的绝对路径
  mdfind "kMDItemCFBundleIdentifier=='com.google.Chrome'"

  # 下边是获取google浏览器的版本号
  # 假设上边拿到的结果是 path
  /usr/libexec/PlistBuddy -c Print:CFBundleShortVersionString {path}
  ```
* windows 平台比较麻烦，要用 `reg` 命令 
  ```shell 
    reg query "HKLM\\Software\\Google\\Update\\Clients\\{8A69D345-D564-463c-AFF1-A69D9E530F96}" /v pv /reg:32
    
    # 不好使的话，用下边这个 
    reg query "HKCU\\Software\\Google\\Update\\Clients\\{8A69D345-D564-463c-AFF1-A69D9E530F96}" /v pv /reg:32
  ``` 
> 从vue-cli的代码注释中，发现上述解决方案，并非全部都由开发者原创给出，而是从stackoverflow中获得。所以，造轮子重要，但不一定必要，还要会借助现有的工具啊。我们的目的是实现我们的想法，轮子只是一种工具。用轮子，没什么不好意思的。

---

### 如何在所执行的node脚本中，获取node版本号？
`process.version`
> `process.platform` 查看操作系统；
> `process.arch` 查看CPU架构；

---

### 执行 vue serve 的时候发生了什么？
执行 `vue serve` 的时候，本质是用exec 函数执行 `npm run serve` 或者 `yarn serve`.
> 具体执行哪个，要看你使用的是什么包管理器。yarn npm pnpm 就是包管理器。

---

### 执行 vue-cli-service serve 后，服务是怎么跑起来的？
底层使用 `webpack-dev-server` 实现的。
使用`webpack`构建项目时，可以采用`配置` 和 `函数` 两种方式。

✏️`配置式`
编写好 webpack.config.json 或者 webpack.config.js，直接使用 `webpack`命令启动；

💡`函数式`
在你的js文件中，引入 `webpack` `webpack-dev-server`等包，编写配置和启动代码，无需在命令行执行 `webpack`. 这个方式灵活度更高, 集合到自身项目更爽。vue-cli-service 就是采取这种思路，二次封装webpack的，本身并没雨重新设计一套服务器。