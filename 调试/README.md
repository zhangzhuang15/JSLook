## 内容
* 调试 node js 程序
* 调试 node ts 程序
* 调试 React 程序
* 调试 Vue 程序

---

### 调试 node js 程序
#### 1、node inspect
1. 在js文件中使用debugger标记断点；
2. 使用 `node inspect main.js` 开启调试；
3. 你会来到类似`gdb`调试器的界面，使用上基本和`gdb`没有太大区别；
   > 不会用的话，`help`  查看帮助信息

**示例程序**
```js{.line-numbers}
// main.js
function main() {
    debugger
    console.log("Welcome to California")
}

main()
```

#### 2、vscode 调试 
1. 直接在js文件中打断点
2. 打开vscode调试面板，点击debug，选择nodejs调试器
3. 此时你就会看到代码已经开始进入调试状态了
4. 默认调试的时候，被调试的程序不会接收到命令行参数，你可以在vscode调试面板中，点击左侧上方绿色箭头所在的下拉框，选中 Add configuration，在launch.json配置文件中，为被调试的程序加入命令行参数。
   例如：
   ```json{.line-numbers}
   {
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Launch Program",
            "program": "${workspaceFolder}/调试/nodejs/main.js",
            "request": "launch",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "type": "node",
            "args": ["-c", "4"]
        },
    ]
   }
    ```
    > args 设置命令行参数

---

### 调试 node ts 程序
确保：
1. 安装typescript编译器: `npm install typescript`;
2. 安装ts-node程序： `npm install ts-node`;
    > ts-node用于直接执行ts文件，相当于 node程序直接执行js文件；
3. 在编写ts文件前，初始化ts开发环境： `tsc --init`;
    > 此时目录会生成一个 tsconfig.json文件，vscode内置会识别该文件，并按照该文件的内容，在你编写ts代码时，给你一些语法辅助。

具体调试过程：
1. 在编写好的ts文件中打断点；
2. 选择vscode调试面板，选择 Add configuration，加入如下配置：
```json{.line-numbers}
 {
    "name": "ts file debug",
    "request": "launch",
    "runtimeArgs": ["-r", "ts-node/register"],
    "args": ["${file}"],
    "skipFiles": [
        "<node_internals>/**"
    ],  
    "cwd": "${workspaceFolder}/用ts编写node程序",
    "type": "node"
}
```
* runtimeArgs 是固定配置，开启ts-node的编译器
* cwd指定进程的工作目录，也就是被调试的ts文件所在的目录
* args 的 ${file} 表示vscode编辑器中当前处于编辑状态的文件绝对路径

---

### 调试 React 程序
React框架编写的项目一旦运行后，就会开启一个服务进程，监听某个端口（可能是8000），当我们使用浏览器访问这个端口时（比如http://localhost:8000/），就会访问到我们的前端项目。

安装`vscode debugger for Chrome 插件`

具体调试：
1. 在tsx或者jsx文件中打好断点，启动项目；
2. 在vscode调试面板中打开 Add configuration，选中 `Chrome: Attach`, 加入如下配置：
   ```json{.line-numbers}
    {
            "name": "Attach to Chrome",
            "request": "attach",
            "type": "chrome",
            "url": "http://localhost:8000/",
            "webRoot": "${workspaceFolder}"
    },
    ```
> 带有 Attach 的配置选项，会对一个已经在运行的程序进行调试；
> 带有 Launch 的配置选项，会启动一个程序并加以调试；

---

### 调试 Vue 程序
安装 `vscode debugger for Chrome 插件`

1. 在vue文件中打上断点；
2. 运行 vue 项目；
3. 在vscode调试面板中点击⚙️，打开launch.json, 加入如下配置：
```json{.line-numbers}
{
    "type": "chrome",
    "request": "attach",
    "name": "vuejs: chrome",
    "url": "http://localhost:8080",
    "webRoot": "${workspaceFolder}/src",
    "breakOnLoad": true,
    "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
    }
}
```
> url 为 vue项目启动后的服务地址；
> sourceMapPathOverrides 指定源代码映射，这样才能在调试的时候定位到源代码位置；