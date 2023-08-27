ref: https://www.bilibili.com/video/BV1CJ411T7k5/?spm_id_from=333.1007.top_right_bar_window_custom_collection.content.click&vd_source=8e22a21e39978743c185c338fa9b6d6d

## 实现的结构
```
          entry
            |
            |
         es6 code 
            |
            |
           AST 
            |
            |
    dependency and es5 code 
            |
          graph
            |
          bundle
```

只实现单入口文件情形，包括以下实现：
- code string -> ast
- module解析 
- module Graph构造
- bundle code 构造 

不包含 plugin 和 loader 实现