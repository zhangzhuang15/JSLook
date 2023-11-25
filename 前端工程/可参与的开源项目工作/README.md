[toc]

## vscode-nginx-conf
[仓库](https://github.com/ahmadalli/vscode-nginx-conf)

work:
- 增加 hint 中的用例提示

## vscode-mac-dictionary
[仓库](https://github.com/kohkimakimoto/vscode-mac-dictionary)

work:
- 无需跳转到 Dictionary App, 直接在vscode界面完成功能


## 框架思考 
vue 和 react 都引入了 runtime，用户代码都是跑在 runtime，而 jquery 仅仅作为 API 的简化，没有引入 runtime， 但是需要开发人员去搜索dom节点，维护起来不方便。

我的想法是，舍弃 runtime，去除 jquery 的API交互成本，这里给出一个组件的雏形：
```html 
<template>
    <div>
        <div #header class="header"></div>
        <button #button>add item</button>
        <div #total></div>
        <div #content class="content">
            <ul #list>
                <li>hello</li>
                <li>peter</li>
            </ul>
        </div>
        <Menu #menu />
    </div>
</template>
<script>
    import Menu from "./menu.js";

    export default (id, controls, lifes, props) => {
        const { header, content, list, button, total } = controls;
        const { title } = props;

        button.on("click", () => {
            header.value = 'new item';
            header.className.push("valid");
            list.push('new item');
        });

        // alike watch in vue
        list.onChange((listOpts) => {
            total.value = listOpts.length;
        });

        const { mounted } = lifes;
        mounted(() => {
            fetch("http://localhost:8777/hello");
        });

        return function cleanup() {
            // 处理 setTimeout setInterval 
            // 这种东西
        }
    };
</script>
<style>
    .header {}
    .content {}
    .header .valid {}
</style>
```
```txt 
编译后，会生成一个产生dom块的函数，dom块里标记好的节点会在生成的时候，
提取出来，注入给导出的函数，完成函数里定义好的绑定操作。

必须要让使用者处理变量之间的关系，尽量少的语法糖，让使用者掌控一切。

这套思路，在处理嵌套模式，存在复杂度问题，可以单独优化。
```