## 写C++扩展必备工具
* node-gyp
  > 安装：`npm install -g node-gyp`
  > 用于根据.cpp文件生成 .node文件

* node-addon-api
  > 安装：`npm install node-addon-api`
  > 对 node 头文件的封装，你可以在.cpp中引入`<napi.h>`,
  > 更方便地使用Node API。原生的C++ Node API理解起来比较费劲。

* bindings
  > 安装:`npm install bindings`
  > 快速搜索 .node 的工具，搜索的起点从 带有 package.json的文件夹开始

---

## 构建过程
基础步骤：
1. `cd ~/`
   
2. `mkdir cppExtention && cd cppExtension`
   
3. `npm init`

4. `npm install -g node-gyp`

5. `npm install bindings node-addon-api`


如果你想将C++写好的node扩展放在单独的文件夹中调用，执行接下来的步骤：
6. `mkdir extension && cd extension`  
7. 编写cpp文件和gyp文件：
   ```c++
    // main.cpp
    #include <napi.h>
    #include <iostream>

    Napi::String Log(const Napi::CallbackInfo& callbackInfo) {
        Napi::Env env = callbackInfo.Env();
        Napi::String input = Napi::String::New(env, callbackInfo[0].As<Napi::String>().Utf8Value());
        return input;
    }

    Napi::Object Init(Napi::Env env, Napi::Object exports) {
        exports.Set(Napi::String::New(env, "log"), Napi::Function::New(env, Log));
        return exports;
    }

    NODE_API_MODULE(quick, Init);
   ```
   ```gyp
    // binding.gyp 
    {
        "targets": [
            {
                "target_name": "quick",
                "sources": ["main.cpp"],
                "cflags!": [ "-fno-exceptions" ],
                "cflags_cc!": [ "-fno-exceptions" ],
                "include_dirs": [
                    "<!@(node -p \"require('node-addon-api').include\")"
                ],
                'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
            }
        ]
    }
   ```
8. `node-gyp configure build`
   > 会生成一个build文件夹，其中build/Release/下可以看到生成的
   > 拓展文件`quick.node`;
9. `cd ..`;
10. 编写main.js文件：
    ```javascript
    // main.js

    // .node文件在require时，.node后缀可以忽略
    const quick = require('./extension/build/Release/quick');

    const result = quick.log('jackie Jump');

    if (typeof(result) === 'string') {
        console.log('result is string as : ', result);
    }
    ```
11. `node main.js`
    
如果你不想将C++写好的扩展放在单独的文件夹中引用，请执行下边的步骤：
6. 编写main.cpp 和 binding.gyp，内容和上边一样
7. `node-gyp configure build`
8. 编写main.js文件 
   ```javascript
    // main.js

    // .node文件在require时，.node后缀可以忽略
    // 这里可以使用bindings的原因：
    // bindings可以自动寻找quick.node，搜索的起始文件夹就是
    // cppExtension文件夹，因为它拥有 package.json文件，
    // 它会依次在下面的文件夹下搜寻 quick.node文件 ：
    // cppExtension/build
    // cppExtension/build/Debug
    // cppExtension/build/Debug/Release
    // cppExtension/build/default
    // cppExtension/out/Debug
    // cppExtension/out/Release
    // cppExtension/Debug
    // cppExtension/Release
    // cppExtension/addon-build/release/install-root
    // cppExtension/addon-build/debug/install-root
    // cppExtension/addon-build/default/install-root
    // cppExtension/lib/binding/node-v93-darwin-arm64
    // cppExtension/compiled/16.15.0/darwin/arm64/
    // 最后两个因node版本号和平台差异，会有所不同
    // 把这一套逻辑套用在上一种处理方式上，bindings没办法找到quick.node
    const quick = require('bindings')('quick');

    const result = quick.log('jackie Jump');

    if (typeof(result) === 'string') {
        console.log('result is string as : ', result);
    }
   ```
9. `node main.js`

---

## 最后 
善用 C++ 编写的扩展，提升 nodeJS性能吧！