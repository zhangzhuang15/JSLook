

const iframeContextName = "demo";
const iframe = document.getElementById("demo");
iframe.contentWindow.name = iframeContextName;

const message = document.getElementById("message");
const button = document.getElementById("btn");
const button2 = document.getElementById("btn2");
        
button.addEventListener("click", () => {
    iframe.contentWindow.postMessage("hello");
});

button2.addEventListener("click", () => {
    // 这个方法，可以不修改 <iframe> 的 src 属性，将内容更新
    window.open("/demo.html", iframeContextName);
});

window.addEventListener("message", (ev) => {
    const data = ev.data;
    message.innerHTML = data;
});

// <iframe> 的 src 必须满足 same-origin 才有效
iframe.contentWindow.addEventListener("load", () => {
    const wind = iframe.contentWindow;
    wind.postMessage("iframe load: ");
});

// iframe 同源限制
//
// 在 iframe load之前，使用 iframe.contentWindow，就相当于
// 访问 window；放在 setTimout 之中，就可以演示在 iframe load
// 之后执行操作，结果就是，iframe 和 页面非同源，导致访问 cookie
// 读写 localStorage 发生安全错误(SecurityError)
setTimeout(() => {

    console.log("cookie: ", iframe.contentWindow.document.cookie);

    iframe.contentWindow.localStorage.setItem('jack', 4)
    console.log("local storage: ", iframe.contentWindow.localStorage.getItem('jack'))

}, 3_000);

