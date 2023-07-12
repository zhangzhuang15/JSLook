GO 编写 .wasm 需要只用 "syscall/js" 库；
> 在编写本文时，GO官网并没有给出该库的详尽介绍；

生成 .wasm : `GOOS=js GOARCH=wasm go build -o main.wasm main.go`

使用nodejs调用 main.wasm 有点麻烦：
1. ` cp "$(go env GOROOT)/misc/wasm/wasm_exec_node.js" ./`
2. ` cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" ./`
   > 拷贝两个GO本身提供的.js文件， wasm_exec_node.js 用于在 node 环境执行 .wasm 文件，很可惜，这个脚本只能作为cli工具调用 .wasm； wasm_exec.js 用于在 浏览器 环境执行 .wasm 文件。
3. 我们不能直接使用 wasm_exec_node.js, 而是基于它，写一个改版 main.js，这个文件直接参考了github上一个项目 https://github.com/riskers/nodejs-exec-go-wasm/blob/main/wasm_exec_node_myself.js ；
4. `node main.js` 就可以执行啦；
   
美中不足的是，GO编写的 .wasm 文件，其中实现的 API 最终在 nodejs 加载之后，绑定在了 **globalThis** 对象上。如果能指定绑定在一个**局部对象**上就好了。这一点后续可以探究改进。还有一点就是 **WebAssembly.instantiate** 函数的**第二个参数**，到底是干啥用的，也需要补充