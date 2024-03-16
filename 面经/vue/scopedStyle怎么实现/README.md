## 前言
在vue2源码中，可以查看如下文件了解相关信息：
- `packages/compile-sfc/test/stylePluginScoped.spec.ts`
    > 查看 scoped css 处理之后的效果
- `packages/compiler-sfc/src/stylePlugins/scoped.ts`
    > 查看 scoped css 的具体实现


## 大致原理
vue会使用`postcss`处理style标签的内容，它定义了一个postcss插件，
用来实现 scoped css 的逻辑。在处理css的时候，它会接受一个 ID（就是一个字符串），将css里面的selector要素重写入ID属性，达到scoped的限制。
而重新写入的这一步，vue使用`postcss-selector-parser`这个工具完成。

因此，如果想要一个很好的scoped效果，必须保证ID唯一。

## vue2如何计算ID
上一小节解释了基本原理，其关键在于ID，那么vue2是如何得到这个ID的呢？

vue2并没有在自己的仓库中实现，而是在 vue-cli 中予以实现。vue-cli 工具编译vue项目的时候，就会涉及到 .vue 文件的编译工作，整个项目构建采用 webpack，而 处理 .vue 文件是依赖 `vue-loader` 完成的，因此，ID的生成工作，发生在 `vue-loader`。

在 vue-cli 项目中的`packages/@vue/cli-service/lib/config/base.js`有：
```js 
 webpackConfig.module
        .rule('vue')
          .test(/\.vue$/)
          .use('vue-loader')
            .loader(require.resolve('@vue/vue-loader-v15'))
            .options(Object.assign({
              compilerOptions: {
                whitespace: 'condense'
              }
            }, cacheLoaderPath ? vueLoaderCacheConfig : {}))
```
而 `@vue/vue-loader-v15` 就是 `vue-loader-v15`, [NPM地址](https://www.npmjs.com/package/vue-loader-15)(里边介绍了编译.vue文件的原理).

查看该loader源代码的index.js：
```js 
 // module id for scoped CSS & hot-reload
  const rawShortFilePath = path
    .relative(context, resourcePath)
    .replace(/^(\.\.[\/\\])+/, '')

  const shortFilePath = rawShortFilePath.replace(/\\/g, '/') + resourceQuery

  const id = hash(
    isProduction
      ? (shortFilePath + '\n' + source.replace(/\r\n/g, '\n'))
      : shortFilePath
  )

  /**
   * 假设被编译的文件为 /Usr/X/a.vue
   * vue-cli在 /Usr/X 目录下执行，那么：
   * resourcePath：“/Usr/X/a.vue“
   * context: "/Usr/X"
   * 
   * 如果你在 .vue文件中写到：
   * import B from "./c.vue?ok=3"
   * 那么 resourceQuery: "?ok=3"
   * 但对于a.vue，我们假设resourceQuery: ""
   * 
   * source 表示的就是 /Usr/X/a.vue 中的内容
   * 
   * resourcePath resourceQuery source 是编写
   * webpack loader时，webpack暴露给loader
   * 开发者的数据！ 
   * 
   * hash函数来自于 hash-sum 这个package,
   * 计算结果是一个4字节的十六进制表达的字符串，
   * 也就是类似 998abbcc 这样的字符串；
   * 
   * 这个就是我们梦寐以求的 ID，随后该ID会被送入
   * 到上一节提到的处理style的postcss插件里，
   * 最终注册到 style 的 selector 属性上，
   * 形成 scoped css；
   */
```

顺便提一句处理 .vue 的事情，vue-loader 会拿到
vue文件内容，之后将该内容替换为3个import语句，
比如:
`import A from "./a.vue?type=style"`
`import B from "./a.vue?type=template"`
`import C from "./a.vue?type=script"`

分别对应style template script 的请求，然后
会有一个 pitch loader给上面三个import语句加入
其他loader，比如：
`import A from "css-loader!vue-loader!./a.vue?type=style"`

webpack就会先使用 vue-loader 处理 `./a.vue?type=style`, 得到的结果交给 css-loader 继续处理。
vue-loader第二次处理时，多出来一个 `type=style`，
根据这一点信息，就可以将SFC的template部分代码块单独编译出来了。相对于第一次做了分工处理，第二次专项完工。


```js 
// vue-cli项目
// packages/@vue/cli-service/lib/config/base.js
  webpackConfig
        .plugin('vue-loader')
          .use(require('@vue/vue-loader-v15').VueLoaderPlugin)

// 注册plugin的时候，pitch loader 随之加入到
// webpack的rules规则中
```

## 如何给html标签加入scopedID的？