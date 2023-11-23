在vue2源码中，可以查看如下文件了解相关信息：
- `packages/compile-sfc/test/stylePluginScoped.spec.ts`
    > 查看 scoped css 处理之后的效果
- `packages/compiler-sfc/src/stylePlugins/scoped.ts`
    > 查看 scoped css 的具体实现


大致原理是：
vue会使用`postcss`处理style标签的内容，它定义了一个postcss插件，
用来实现 scoped css 的逻辑。在处理css的时候，它会接受一个 ID（就是
一个字符串），将css里面的selector要素重写入ID属性，达到scoped的限制。
而重新写入的这一步，vue使用`postcss-selector-parser`这个工具完成。

因此，如果想要一个很好的scoped效果，必须保证ID唯一。