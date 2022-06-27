### meta用来做什么
`meta` 标签是文档集标签元数据元素，表示无法使用`<base>` `<script>` `<title>` 等html元素所表达的数据。


### meta定义的元数据的类型
* 设置了`name`属性，`meta`提供的是文档级别的元数据，应用于整个页面；
* 设置了`http-equiv`属性，`meta`元素则是编译指令，提供 http 头部信息；
* 设置了`charset`属性，告诉文档使用哪种字符编码；
* 设置了`itemprop`属性，`meta`提供用户定义的元数据；


### name
* `<meta name="author" content="xxfaff@fdf.com" />`
* `<meta name="description" content="some introduction...." />`
* `<meta name="keywords" content="key1, key2, key3,...." />`
* `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`
* `<meta name="robots" content="all" />`
> 其他值： `none`  `index`  `follow`
> `none`: 搜索引擎忽略此网页
> `index`: 搜索引擎索引此网页
> `follow`: 搜索引擎通过此网页索引更多的网页
* `<meta name="renderer" content="ie-comp" />`
> 指定双核浏览器的渲染方式
> 其他值： `webkit` `ie-stand`


### http-equiv
* `<meta http-equiv="x-dns-prefetch-control" />`
> 使网页中的a标签自动启用DNS提前解析
* `<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />`
* `<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1" />`