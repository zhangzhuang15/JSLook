const obj = {
    name: 'Jack',
    age: 19,
    animal: 'Tiger',
    sex: 'boy'
};

// FIXME: 貌似在node环境中，不支持stringify第二个参数为函数？
const objJSON = JSON.stringify(obj,function(key, value) { if (key=== 'name') return value; return null; });

console.log(objJSON);