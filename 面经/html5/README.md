### html5 新特性
* 新增 canvas
* 新增更加强大的表单
* 新增 video audio
* 地理定位
* 拖放
* web存储
* 应用程序缓存
* web worker
* 服务器发送事件
* websocket

<br>

### html5 中input的新特性
* color 
  > 颜色控件
* date
  > 日期控件，选择年、月、日
* month
  > 月份控件，选择年、月，不带时区
* week 
  > 星期、年组成的日期控件，不包括时区
* time
  > 时间控件
* datetime
  > 基于UTC的日期时间控件，选择时、分、秒及几分之一秒
* datetime-local
  > 日期时间控件，不包含时区
* email 
  > 包含 e-mail 地址的输入域。在提交表单时，会自动验证 email 域的值。
* number 
  > 用于应该包含数值的输入域。只能输入数字
* range 
  > 用于应该包含一定范围内数字值的输入域。range 类型显示为滑动条。
* search 
  > 用于输入搜索字符串的单行文本字段。换行会被从输入的值中自动移除。
* tel 
  > 用于输入电话号码的控件。在移动端输入会显示数字键盘，PC端无效果
* url 
  > 用于编辑URL的字段
  
<br>

### web程序作用域有哪些？
* 请求作用域
* 会话作用域
* 上下文作用域


### 哪个标签表示一个表行
* `<br>` 表示一个空行
* `<hr>` 表示一行线
* `<tr>` 表示一个表行

<br>

### 哪种输入类型定义周和年控件？
* date 定义年、月、日
* month 定义年、月
* week 定义周、年
* time 定义小时、分钟

<br>

### p标签的特殊点
* p标签不能内嵌块级元素
```html
<p>hello <div>1314</div> world</p>
```
会被解析为
```html
<p>hello</p><div>1314</div><p>world</p>
```

* p标签内部不能包含任何其他的标签
> 补充：  
> a标签可以包含任意块级元素


<br>


### 为什么html文件开头会有`<!DOCTYPE html>`的声明？
拥有这个声明后，浏览器便会按照标准的w3c模式去解析该文件，反之，浏览器可能按照
兼容模式（也成怪异模式）去解析，从而带来意想不到的渲染结果。

<br>

### 如何检查input中的拼写和语法？
```html
<input type='text' spellcheck='true' />
```
> 此时当你输入文字的时候，浏览器会给出拼写的建议，对于错误的拼写，会标有红色的下划线  


<br>  


### 使用table的时候，发现table比预想的要宽，需要怎么解决？
* 设置 cellpadding='0'
  > 单元格边框和其内容之间的距离
* 设置 cellspacing='0'
  > 单元格之间的间距


<br>



### 鼠标移动到按钮，并点击按钮的过程中，依次发生了什么事件？
hover -> focus -> active
> 简记 love and hate   
> link   
> visited   
> hover  
> active  
> 在 hover 和 active 中间，有个 focus

<br>

### `link` 和 `@import` 的区别？
* `link` 是XHTML标签，没有兼容问题；`@import`是css2.1提出的，低版本的浏览器不支持；
* `link` 可以加载 css， javascript； `@import` 只能加载css；  
* `link` 加载的内容和页面是同时的； `@import`需要页面网页完全载入后加载；
  
*用法：*
```html
<link rel="stylesheet" href="index.css">

<style>
  @import url("index.css")
</style>
```  

<br>


### 如何禁止输入框，如何禁止按钮
> 禁止输入框，则输入框置灰；  
> 禁止按钮，则按钮置灰。  

通用方法:   
`elememt.disabled = true`  
`element.setAttribute('disabled', true)`
> 实际上设置为 false 也有效；

只针对于`input(text/password)` `textarea`：  
`elememt.readonly = true`

<br>


### svg 和 canvas的区别
* svg
  * 基于xml
  * 不依赖分辨率
  * 支持事件绑定
  * 不能用来实现网页游戏
  * 可以使用css设置动画样式
  * 适用于大型渲染区域程序（百度地图，google地图等）

* canvas
  * 依赖分辨率
  * 产生的DOM元素比svg少
  * 不支持事件绑定
  * 适合网页游戏
  * 能保存为'.jpg'格式的图片 

<br>

### 视频控制方面的属性
*视频控制*
```html
<video autoplay="autoplay" controls="controls">
  <source src="movie.mp4" type="video/mp4" />
  <source src="movie.ogg" type="video/ogg" />
</video>
```
* `autoplay`, 控制视频在加载后立即播放；
* `controls`, 控制是否浮现视频控制器；
* `preload`, 控制在页面加载完毕后，是否立即加载视频；

<br>

### html元素中的层级显示优先级？
帧元素 > 表单元素 > 非表单元素  
  
* 帧元素 `frameset`  
* 表单元素
  * 文本输入框
  * 密码输入框
  * 单选框
  * 复选框
  * 文本输入域
  * 列表框
  * ........
* 非表单元素 
  * a
  * div
  * table
  * ........  

html元素可分为：  
* 有窗口元素
  * select
  * object
  * frames
  * .........
* 无窗口元素
  * div
  * span 
  * img 
  * ...........
> 有窗口元素总是显示在无窗口元素前面

<br>

### \<script\>标签中的async defer 属性？
```
<script>
html解析过程出现阻塞
|||||||||||||               ||||||||||||||||||
             aaaaaaaaabbbbbb

<script async>
html解析过程可能会被javascript执行阶段阻塞
|||||||||||||||||||||      |||||||||||||||||||
           aaaaaaaaaabbbbbb

<script defer>
html不会被阻塞
||||||||||||||||||||||||||||||||||||||||||||||
           aaaaaaaaaaa                        bbbbb

|||||表示html解析过程
aaaa表示javascript下载过程
bbbb表示javascript执行阶段
```

<br>

### 屏幕尺寸标准

| 超小屏幕(手机) | 小屏幕(平板) | 中等屏幕(桌面) | 大屏幕(桌面) |  
|:------------:|:----------:|:------------:|:-----------:|
|   < 768px    |  >= 768px  |   >= 992px   |  >= 1200    |
|   .col-xs-   |  .col-sm-  |  .col-md-    |  .col-lg-   |