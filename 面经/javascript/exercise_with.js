const s = 'my name is ${name}, I am ${age} years old';
const obj = {
    name: 'Jack',
    age: 19
};

// TODO: 写一个函数，将 s 中的 {} 变量解析为 obj 的属性值

String.prototype.render = function(obj) {
    with(obj) {
        return eval('`' + this + '`');
    }
}

String.prototype.render2 = function(obj) {
    eval(`var { ${Object.keys(obj).join(',')} } = obj;`);
    // NOTE: '`' + this + '`' 等效于 `my name is ${name}, I am ${age} years old`
    return eval('`' + this + '`');
}


console.log(s.render(obj));

console.log(s.render2(obj));