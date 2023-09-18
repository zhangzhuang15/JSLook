## 怎么实现的样式隔离？
一些知识准备：
qiankun 使用 `import-html-entry` package 解析 html 内容，将其中的`<script>`抽出来，
剩下的内容就被称为 template；
也就是说，app的html不是直接放进浏览器环境，加载、运行的，而是被当作字符串，经 `import-html-entry`
处理后，人为控制地执行script，一步步加载、运行；


严格模式下，就是将app的template挂载到 shadow dom 下

scoped模式下，给app的wrapper html element设置 data-qiankun属性，
属性值由app的name决定，然后遍历app种的style节点，使用正则表达式修改里
面的css rule， 加上 data-qiankun属性选择器的限制