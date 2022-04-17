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