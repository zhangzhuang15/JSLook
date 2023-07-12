## Before
通常情况下，要执行一个程序，需要这样做：
* 打开一个终端
* 在终端的shell环境中输入可执行文件路径，回车即可
> shell环境：bash，zsh，cmd，powershell，sh等等

<br>

更具体的例子：  
假设有一个二进制文件叫go，存储于/usr/bin目录下，要想执行这个程序，通常你要这样做：
* 打开终端，执行`/usr/bin/go`;
* 或者将 /usr/bin 注册到环境变量PATH中，直接执行`go`;

## 误区
执行一个程序，并非只能依赖二进制文件，只要文件是可执行的，他就可以开启一个程序。

不信？

给你一个`main.js`文件，你会如何执行它？  
`node main.js`

但是这个例子会告诉你，直接执行`./main.js`也是可以的。  

如何实现？

<br> 

## 实现
创建一个`main.js`文件，随便写一些打印字符的代码，在文件首行写上`#!/usr/bin/env node` 或者 `#!node`。
> 一定要写上这个东西，非常重要，他会告诉shell，执行这个文件的时候，需要用哪个二进制文件，用什么环境变量

接下来，让`main.js`变成可执行文件`chmod u+x main.js`  

最后直接执行`./main.js` ， 你就可以看到结果啦！

这个过程中，你并没有在shell中输入node，但是shell知道要用node去执行！从本质上来讲，还是采用二进制文件，但从语言上看，main.js化身为二进制文件，直接执行啦。

![实战操作](./mainjs%E7%9B%B4%E6%8E%A5%E6%89%A7%E8%A1%8C.png)

## 局限
这种玩法仅仅在解释性语言中奏效，在编译型语言中并不管用，这需要编译型语言自身提供支持。

比如写一个`main.go`文件：
```go
#!go run
package main

import "fmt"

func main() {
    fmt.Println("OK")
}
```
将`main.go`变成可执行文件后，在默认是zsh的终端执行`./main.go`
* zsh会识别 `#!go run`，准确找到了二进制文件go去执行`main.go`；
* 尴尬的是，go 并不认识 `#!go run`这行东西，导致无法执行。