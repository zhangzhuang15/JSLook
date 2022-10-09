var p = "00-fdaf-f00";

var message = p.match(/[0-9]{2}(?:.*?)/);

console.log(message);

// 如果match方法中传入的不是正则表达式，则会隐式调用 new RegExp(str) 转化为 正则表达式
// message[0] 匹配正则表达式的字符串
// message[1: message.length] 正则表达式中()捕捉到的字符串
// message["index"] 匹配的字符串的索引号
// message["input"] 模版字符串
// message["groups"] 模板字符串如果有 （） ，将显示分组信息

// RegExp.prototype.exec的执行结果在结构上和 这里的 match 一样


var iterators = p.matchAll(/[0-9]/g);

for(let item of iterators) {
    console.log(item); // 每个 item 和 message 拥有相同的数据结构
}