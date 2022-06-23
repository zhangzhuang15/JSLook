## 环境准备
  * npm init 
  * npm install ts-node 
  * tsc --init
    > 自动生成`tsconfig.json`;  
    > 没有这个文件，你在 `.ts`文件中没办法引用node模块；

<br>

## 编写文件
这里简单编写了一个`main.ts`文件，里边开启一个http服务程序。

<br>

## 运行代码
* 方法一： `npx ts-node main.ts`
* 方法二：
  * 在package.json的scripts加入`"dev": "ts-node main.ts"`
  * `npm run dev`

<br>

## 使用vscode调试代码
* 点击vscode左侧边栏的`Run And Debug`, 点击上边栏的⚙️，进入到`launch.json`；
* 配置文件为
    ```json
    {
        "version": "0.2.0",
        "configurations": [
            {
                "name": "Launch Program",
                "request": "launch",
                "runtimeArgs": ["-r", "ts-node/register"],
                "args": ["main.ts"],
                "skipFiles": [
                    "<node_internals>/**"
                ],
                "cwd": "${workspaceRoot}/用ts编写node程序",
                "type": "node"
            }
        ]
    }
    ```
  如果执行debug，  

  进程的工作目录切换为`"${workspaceRoot}/用ts编写node程序"`文件夹， 

  `“${workspaceRoot}”`指的就是 .vscode文件夹所在的目录。  
  
  因为我把.vscode文件夹放入了JSLook文件夹，所以 `“${workspaceRoot}”` == JSLook文件夹的绝对路径。

  之后会执行`/bin/node -r ts-node/register main.ts`
    > 注意，在 `JsLook/用ts编写node程序`的目录和子目录下，一定要保证
    > 可以找到 `ts-node/register`路径。否则，无法debug。

* 知道了这些，点击绿色的箭头，debug吧。（记得打断点哦😂）



<br>

## import 和 require 带来的困惑
前端项目.js文件中，有的文件使用`import`的ES6模块导入方式，有的文件使用`require`的COMMONJS模块导入方式，二者是冲突的，但为什么可以共存呢？

* 我们在编写组件代码的时候，这些代码实际上是运行在浏览器端，浏览器端支持的是es6模块导入模式，因此组件中就是使用`import`；
* 我们的项目经由脚手架去打包处理，而脚手架自身是运行在本地计算机的，走的是node.js环境，因此相关脚手架的配置文件中，使用的是`require`，脚手架运行时可以读取到配置文件，执行配置文件;
  > webpack.config.js   
  > vue.config.js
* 无论是`import` 还是 `require`，在webpack打包工具处理之后，都会转换为模块对象（这个就是js对象），因此不会受到模块导入系统的约束，唯一约束的就是运行环境。运行在nodejs环境的代码，即便经过打包，也是无法运行在浏览器中的，因为浏览器能识别js，但是无法提供nodejs的本机IO功能。