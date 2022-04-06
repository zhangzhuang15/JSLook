假设项目名为 Demo  

*Vue2.x*  
`npm install -g @vue/cli` 安装脚手架工具

`vue create Demo` 创建基本项目环境  

扩展项目结构，安排如下：


*Vue3.x + vite构建*  
npm6.x -> `npm init vite@latest Demo --template vue`  
npm7+  -> `npm init vite@latest Demo -- --template vue`

```
Demo
  ---- public
            编译成功后的项目代码将放置在此处，
            将public文件夹部署到服务器中，并将 nginx 的 / 
            代理到 public文件夹，那么前端代码中的绝对路径
            都是按照 public走的，也即是 public文件夹对应根路径/
  ---- src
         --- api
                   与后端交互的ajax接口的文件
         --- utils
                   一些复用的工具库文件
         --- router
                   vue路由设置方面的文件
         --- store
                   全局对象，可以是 vuex， 也可以自定义，
                   实现状态全局共享即可
         --- enum
                   定义一些重要意义的枚举字段，增加特殊数值的可读性
         --- components
                   定义子组件
         --- views
                   定义SPA每个页面组件，这里是项目的主要逻辑所在地，
                   会用到 components中的组件
         --- assets
                   放置 css style 图片 json 等静态文件

         --- App.vue
                   由 vue 脚手架生成， vue的入口组件，
                   router-view 就出自该组件
         --- main.ts
                   创建 vue App对象，注册路由，挂载 Dom，就写在这里
         --- env.d.ts
                   vue 脚手架生成的环境文件
  
  --- .env.development
  --- .env.production
                   配合vite或者webpack使用，设置不同环境下的变量
  --- vite.config.ts
                   vite的配置文件，如果没用到vite可省略
  --- webpack.config.ts
                   webpack的配置文件，如果没用到webpack可以省略
  --- tsconfig.json
                   ts的配置文件，配合typescript插件使用，
                   解决一些 ts 语法上的问题，比如 import 的路径问题
  --- package.json
                   npm配置文件

  --- index.html 
                   整个项目的入口html文件，该文件引用了 main.ts文件，
                   App.vue的 dom 挂载点就位于该文件中



```
