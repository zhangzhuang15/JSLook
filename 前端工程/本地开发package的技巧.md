[toc]

## 如何连接本地库
当你本地开发好一个本地库，你想本地连接它试试效果，觉得差不多了，再发布到npm registry。

做法很简单，假设你有这样的目录结构:
```txt
project
   |----- package-A  
   |----- package-B 
```
<br>

`package-A`你开发好了，想在`package-B`中引入看看效果，你只需要在 `package-B`的 `package.json` 中这样写：
```json 
{
    "dependencies": {
        "package-A-Name": "file:../package-A"
    }
}
```
> 特别要注意，`file` 和 `../package-A`之间**不能有空格！**

<br>

之后，在`package-B`中执行`npm install` 即可。
> 如果你不执行npm install, 光修改package.json是不行的
