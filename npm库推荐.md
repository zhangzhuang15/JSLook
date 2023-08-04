[toc]

## 基于Vue3的流行UI框架
- **Naive UI**：一个使用TypeScript编写的Vue 3组件库，支持主题定制和快速开发。
- **Vuestic UI**：一个开源的Vue 3 UI框架，提供了易于配置的前端组件，适应各种屏幕和设备，支持暗黑模式和国际化。
- **WaveUI**：一个在Vue 3 alpha阶段就开始开发的UI框架，拥有40多个漂亮且响应迅速的组件，从旋转器到日历应有尽有34。
- **Ionic**：一个更倾向于移动UI的框架，是最早提供Vue 3支持的UI框架之一，团队有着丰富的UI框架开发和维护经验。
  
## 基于React+typescript的流行UI框架
- **Ant Design**：一个基于Ant Design设计体系的React UI组件库，主要用于开发企业级中后台产品，使用TypeScript开发并提供完整的类型定义文件，支持静态和服务器端渲染，主题定制和国际化。
- **Next.js**：一个用于生产环境的React框架，提供静态和服务器端融合渲染，支持TypeScript，智能化打包，路由预取等功能，无需任何配置。
- **React-Desktop**：一个跨平台桌面应用程序的UI组件库，提供了Mac OS和Windows 10的UI组件。


## package

### command line app
#### 🌟commander
命令行参数解析库
使用者： vue-cli

#### 🌟yargs
命令行参数解析库；
使用者： mocha

#### 🌟cac
实现命令行app的工具库
使用者: vuepress vitest create-nuxt-app bumpp

#### 🌟minimist
解析命令行参数

#### 🌟chalk.js
终端彩色文字输出库

#### 🌟ansi-color
终端彩色文字输出库
使用者： mocha

#### 🌟cli-highlight
将字符串高亮处理。
比如一段字符串的内容是 c 语言代码，直接输出到终端或者文件中时，字符串就是白色的，使用这个库处理后，这段字符串就会按照 c 语言进行高亮处理，变成彩色的。处理之后的字符串可以送入终端输出，也可存入文件。

> 这个库既可以在 node.js 代码中使用，也可以直接在终端作为cli程序使用。

#### 🌟progress
实现终端进度条

#### 🌟ora
实现终端spinner提示

#### 🌟inquirer
终端用户输入交互

#### 🌟open
跨平台，打开文件、程序、网址的工具

#### 🌟debug
输出日志信息的轻量级库，输出信息中自带执行时间

---







### process management
#### 🌟execa
更加人性化的进程exec工具

#### pm2
进程管理器（<span style="color: green">源码挺好的，可以看看</span>）

#### 🌟cross-port-killer
跨平台的进程信号推送器，实现向某个进程发送信号

---








### data structure
#### 🌟lru-cache
实现lru算法的数据结构工具

#### 🌟hash-sum
生成hash值的轻量级库

---





### http serve app
#### 🌟ws
快速、小巧的websocket客户端、服务端的工具

#### 🌟portfinder
获取空闲 port 号

#### 🌟mime-types
查询文件所对应的 mime 格式全名

#### 🌟etag
生成 http 的 ETag 内容

#### 🌟selfsigned
Generate a self signed x509 certificate from node.js.






#### 🌟jsonwebtoken
生成和管理JWT的工具，用于服务端node开发。
**可以先学习下JWT的知识，再看看源码**



#### qs
处理url query参数



#### tcp-port-used
检测某个 port 是否被tcp的socket占用
> 在其提供的接口里，有个接口比较有意思，就是在判断某个端口被占用的情况下，等待这个端口被释放，并返回一个Promise。在实现的思路上，就是 Promise + setTimeout + socket event 组合出来的。
> 如果不立即使用一个 Promise，而是将Promise 的 resolve 和 reject 捕捉出来，在之后的逻辑中使用，就称这个 Promise 为 deferred Promise.

---




### http client app
#### 🌟axios
http请求库

#### 🌟umi-request
阿里巴巴开源的一款http客户端，支持浏览器和node环境，与axios功能相同。

#### 🌟history
在原生的History API上提供兼容和功能扩展，用起来更舒服。

#### js-cookie
处理 cookies

#### fly.js
http请求库， nodejs、移动端、浏览器、React Native均可

---








### file system
#### 🌟clipboardy
访问操作系统剪切板的工具库

#### 🌟chokidar
文件系统变动检测器

#### resolve
查询一个模块入口文件的绝对路径

#### slash
将 windows 上的路径转换为 unix 风格的路径

---






### specific file 
#### 🌟dotenv
读取.env文件到 process.env 中

#### js-xlsx
解析、编写 excel

#### 🌟source-map 
sourcemap文件解析器和生成器

---







### animation
### driver.js 
页面引导动画库

#### animate.css
跨浏览器css3动画库

#### animejs
js动画库

#### vivus
js动画库，让我们使用svg制作动画

#### GreenSock JS 
绘制动画库

#### SortableJS
拖拽库

---






### media player
#### flv.js
bilibli开源，html5 flash视频播放器

---







### function tool
#### 🌟lodash
js实用工具库, 比如防抖函数功能

#### 🌟moment
时间处理工具包，包含 获取时间差、获取当天结束时间、获取当天开始时间等功能，好用且强大。

#### 🌟underscore
js常用函数的工具库，实现了包括 map filter foreach等功能，也实现了函数防抖等额外功能。
**推荐看看源码**

#### dayjs
处理事件和日期

#### big.js
任意精度，十进制运算

#### isbuiltin
Tells you if the string you pass in is a built-in node module

#### ajv
校验json的数据类型和数据格式，给出校验结果和错误；常用于后端对前端传来的请求数据进行校验。

#### ejs
将普通的数据转换为ajv可识别的标准Schema格式；

#### jsondiffpatch
获取 json 之间的差别，或者根据差别修改 json 数据。

#### KeyboardJS
键盘绑定


---






### image 
#### html2canvas
网页截图库

#### dom-to-image
将 DOM对象转化为图像

#### pica
处理浏览器中图像大小

#### Lena.js
给图像加滤镜的轻量级库

#### cropperjs
图片裁切库

#### Fabric.js
图片编辑器

---


### test 
#### 🌟mock
制造mock数据的工具，用于自测开发阶段，无需往数据库加入真实数据后才开发

#### json-schema-faker
制造 Fake Schema 数据的工具，用于自测开发阶段，无需往数据库加入真实数据后才开发

#### 🌟puppeteer
chrome浏览器自动化工具，自动化完成浏览器打开，html点击、输入文字，浏览器截图等一系列操作，解放双手，无需手动操作。

npm包有两种安装选择：
* `puppeteer`
* `puppeteer-core`

如果你没有安装 Chrome 浏览器，请选择前者，它会下载一个 Chrome;
如果本地已经安装 Chrome 浏览器，你只是想用 programmatic 的方式编写代码，驱动浏览器完成自动化内容，请选择后者；

#### chromedriver
使用代码的方式完成chrome浏览器操作，比如打开网页，点击网页上的元素等等

#### geckodriver
使用代码的方式完成firefox浏览器操作，比如打开网页，点击网页上的元素等等

---






### package management
#### 🌟husky
git-hooks 的工具库，注册git hook；

#### 🌟simple-git-hooks 
git-hooks 的工具库，vite项目中应用了这个库。比 husky 更简单，更友好。

#### 🌟lerna
多个package的集中管理器

#### 🌟only-allow
限制项目使用哪个包管理器

---


### docs website app
#### 🌟vite-press
用于开发文档网站站点的框架。比如某些技术的官方文档，就是属于文档网站站点，甚至你可以开发自己的博客网站。

#### miniselect
node和浏览器端，全文本匹配的轻量搜索引擎

#### pagefind

#### gitbook
用于生成技术文档的脚手架工具，使用该工具完成的技术文档网站有[cocos2d-x](https://docs.cocos.com/cocos2d-x/manual/zh/3d/)

---







### misc

#### 🌟magic-string
轻量级的源码转换工具

#### mescroll.js
html5 下拉刷新，上拉加载插件

#### chart.js
统计图

#### ramda


#### file-saver
客户端保存和生成文件

#### 🌟safeify
js代码安全沙盒，将js代码隔离到安全的环境中执行。
里边涉及到 进程池、IPC通信，**推荐看看源码**


#### @soda/get-current-script
一个解决平台兼容性的 返回 `document.currentScript` 的工具库。
> `document.currentScript`可以获取当前页面执行的代码位于哪个`<script>`，并判断是异步执行还是同步执行；
> 在 `type="module"`的`<script>`中不能使用`document.currentScript`