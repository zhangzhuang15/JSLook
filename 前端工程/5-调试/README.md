## 内容
* 调试 node js 程序
* 调试 node ts 程序
* 根据进程号调试 node 程序
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
**直接调试一个js文件**
假设你写了一个 main.js 文件，直接用 `node main.js`运行，在这种情况下调试，你可以：
1. 直接在js文件中打断点
2. 打开vscode调试面板，点击debug，选择nodejs调试器
3. 此时你就会看到代码已经开始进入调试状态了
4. 默认调试的时候，被调试的程序不会接收到命令行参数，你可以在vscode调试面板中，点击左侧上方绿色箭头所在的下拉框，选中 Add configuration，在`launch.json`配置文件中，为被调试的程序加入命令行参数。
   `launch.json`：
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
    * `program` 告诉 node 程序要执行的文件
    * `args` 告诉 node 程序执行 `program` 时要传入的命令行参数
    * 以上两条的信息等效于 `node main.js -c 4`
    * 当 vscode 无法找到 node 的路径时，你可能要设置 `"runtimeExecutable": "/usr/bin/node"` 告诉vscode
    * 去掉`"<node_internals>/**" `，可深入到 node 内部js代码去调试，跟踪标准库的代码。

注意：
`node -c 4 main.js`， `-c` 和 `4` 是 node 的命令行参数；
`node main.js -c 4`, `-c` 和 `4` 是 main.js 的命令行参数；

**Reference:**
像"${workspaceFolder}"这种变量称之为 `vscode variable`, [到这里查看](https://code.visualstudio.com/docs/editor/variables-reference)

`launch.json`, [到这里查看](https://code.visualstudio.com/Docs/editor/debugging#_launchjson-attributes)


<br>

**调试一个更复杂的nodejs程序**
有时候，你不是使用 node 直接执行js文件产生一个node进程，
比如使用 `npm run dev`指令启动一个node进程，
此时，调试配置文件需要做出调整了：
* 去掉 `program` 和 `args`;
* 设置 `runtimeExecutable` 和 `runtimeArgs`;

```json{.line-numbers}
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Launch Program",
            "request": "launch",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "type": "node",
            "runtimeExecutable": "npm",
            "runtimeArgs": ["run", "dev"]
        },
    ]
}
```
等效于`npm run dev`启动一个进程并调试

注意：
`args` 参数是传给 `program` 用的；
`runtimeArgs` 参数是传给 `runtimeExecutable` 用的；

对于不同的编程语言，`launch.json` 的 field种类，field含义会不同，需要参考 vscode 官网具体编程语言话题下的debug板块，不要刻板去记忆，[vscode-nodejs-debug](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_launch-configuration-support-for-npm-and-other-tools)

---

### 调试 node ts 程序
#### 快速调试 
无须tsconfig.json, 无须手动编译；
缺点是无法精确调试；

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
    "cwd": "${workspaceFolder}/调试/nodets",
    "type": "node"
}
```
* runtimeArgs 是固定配置，开启ts-node的编译器
* -r 是传给 node 的参数，用于运行时加载外部模块
* cwd指定进程的工作目录，也就是被调试的ts文件所在的目录
* ${workspaceFolder}指vscode打开的项目挂载在哪个文件夹下
* args 的 ${file} 表示vscode编辑器中当前处于编辑状态的文件绝对路径

注意点：
1. 该方法无法保证调试的时候，程序准确地在断点处停止，部分位置打断点会无效。
   ```ts{.line-numbers}
   const hello = (msg: string[]) => {
        let i = 0;
        const l = msg.length;

        for (;i < l; i++) {
            console.log(msg[i]);
        }

        return true;
   } 

   const r = hello();
   console.log(r);

   // 第 12 行打断点，很可能无效；
   // 第 6 行打断点，也很可能无效；
   // 第 2 行打断点，有效，但是程序停止的位置却不在这里
   ```
2. 如果在main.ts文件中使用import，执行`ts-node main.ts`会因为module引入格式的问题报错，应该使用`NODE_OPTIONS="--loader ts-node/esm" ts-node main.ts`
更多关于 ts-node 的信息见其在npm官网的介绍


#### 完美调试 
无需安装 ts-node；

调试之前，先使用tsc编译ts代码，注意tsconfig.json要开启`sourceMap`;
> 编译这一步，建议在tasks.json里定义

launch.json:
```json 
{
    "name": "perfectlly debug node ts",
    "type": "node",
    "request": "launch",
    "program": "${file}",
    "skipFiles": [
        "<node_internals>/**"
    ],
    "outFiles": [
        "${fileDirname}/**/*.js",
        "!**/node_modules/**"
    ]
}
```
outFiles 给出编译后的js文件

然后在 ts 文件里打好断点，直接调试即可。

---

### 根据进程号调试node程序
[详细参考 Attaching to Nodejs](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_attaching-to-nodejs)

* 被调试的node程序启动方式必须是 `node --inspect main.js` or `node --inspect-brk main.js`；
* 打好断点；
* Command+Shift+P 打开vscode命令面板，输入`Attach to Nodejs`回车，根据提示选择要调试的进程ID；
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

### vscode launch.json 
vscode里调试代码，是在 .vscode/launch.json配置的。

```json 
{
    // “node” | "chrome"
    // nodejs nodets 程序选择 "node" 
    // 运行在浏览器里的应用，选择 "chrome"
    "type": "",

    // "attach" | "launch"
    // 调试一个已经运行的node进程或浏览器应用，选择 "attach";
    // 开启一个node进程，然后调试它，选择 "launch"
    "request": "",

    // 给本次调试工作起一个名字，方便在UI界面上查找
    "name": "",

    // 被调试的js文件或ts文件
    "program": "",

    // 解释器程序路径
    // 当遇到vscode找不到node时，手动设置node的程序路径
    "runtimeExecutable": "",

    // 送给解释器程序的参数
    // node -c hello main.js -p 
    // -c hello 送给 node，就是 runtimeArgs,
    // -p 送入main.js， 就是 args
    "runtimeArgs": [""],
    "args": [""],

    // current working directory
    "cwd": "",

    // 调试的时候，被省略的文件跳转不到
    "skipFiles": [""],

    // 如果request: "launch", 在真正
    // 启动进程前，先执行该任务。
    // 这个任务应该在 .vscode/tasks.json中定义。
    // preLaunchTask 的值就是 task 的 label 属性值
    "preLaunchTask": "",

    // 如果调试ts文件，要在这里给出编译后的js代码在哪里，
    // 方便 vscode 在调试的时候，完成sourcemap
    "outFiles": [""]
}
```

问题：
1. vscode找不到 node 怎么办？
 一般不会出现这种问题，可以设置`runtimeExecutable`解决，但不推荐。可以尝试重启vscode。

### vscode tasks.json 
```json 
{
    "tasks": [
        {
            // task名，便于在 command palette 寻找
            "label": "",

            // "shell" | "process"
            // 命令想在shell中执行，选择 "shell"
            // fork一个进程，execute命令，选择 "process"
            "type": "shell",

            // 命令
            "command": "tsc",

            // 额外的一些配置
            "options": {
                // 当前工作目录
                "cwd": "",
                // 环境变量
                "env": {}
            },

            // task分组，也是便于在 command palette 寻找
            "group": "build"
        }
    ],
    "inputs": [
         {
            // 输入变量唯一标识，在task中使用 ${input:projectName} 访问
            "id": "projectName",

            // "pickString" | "promptString" | "command"
            // 让用户输入一个值，选择 "promptString",
            // 让用户选择一个值，选择 "pickString",
            // 想执行一个命令，将命令返回值作为值，选择 "command"
            "type": "promptString",

            // vscode UI界面的 placeholder
            "description": "your project name, such as demo",

            // 默认值
            "default": ".",
            
            // 配合 type: "pickString" 使用
            "options": ["A", "B"],
            
            // 配合 type: "command" 使用 
            // 这里的命令是在vscode里注册的command，不是常见的
            // commnandline
            "command": "",
            // 传入 command 的可选参数
            "args": {
                "url": "https://zhangzhuang15.github.io/"
            },
        }
    ]
}

```

问题：
1. shell无法执行某个命令，找不到该命令
一般不会有这的问题。只要你在vscode集成终端里可以成功执行某个命令，在 `type: "shell"`的 task 里，一定可以执行的。建议重启vscode，或者完成vscode版本更新。

### vscode varaibles 
假设：
1. vscode文件编辑窗口打开文件`/home/your-username/your-project/folder/file.ext`
2. vscode的workspace对应文件夹`/home/your-username/your-project` 

则：
- ${userHome}
  /home/your-username

- ${workspaceFolder}
  /home/your-username/your-project

- ${workspaceFolderBasename}
  your-project

- ${file}
  /home/your-username/your-project/folder/file.ext

- ${fileWorkspaceFolder}
  /home/your-username/your-project

- ${relativeFile}
  folder/file.ext

- ${relativeFileDirname} 
  folder

- ${fileBasename}
  file.ext

- ${fileBasenameNoExtension}
  file

- ${fileDirname}
  /home/your-username/your-project/folder

- ${fileExtname}
   .ext

- ${lineNumber}
  line number of the cursor

- ${selectedText}
  text selected in your code editor

- ${execPath}
  location of Code.exe

- ${pathSeparator}
  / on macOS or linux, \ on Windows