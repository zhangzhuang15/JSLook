const reg = /[0-9]*(?<Name>[a-z]+)/

const result = reg.exec("0cc0a")

console.log(result) 

// [ 
//    "0cc", 
//    "cc", 
//    index: 0, 
//    input: "0cc0a", 
//    groups: [Object: null prototype] { Name: 'cc' }
// ]

console.log(result.groups.Name) // cc

console.log(result[0]) // 0cc

console.log(result[1]) // cc
 
console.log(result.index) // 0

console.log(result.input) // 0cc0a

console.log(typeof result) // object


// 输出结果解析:
//
// "0cc" 匹配正则表达式的字符串
// “cc”  匹配正则表达式()部分的字符串. 正则表达式中只有一个()，所以只有一个"cc", 如果
//       有额外的（）, 那么将不止一个"cc"
//
// index: 0  发生匹配的索引号，也就“0cc”字符串在原字符串“0cc0a”的索引号
//
// input：“0cc0a” 原字符串
//
// groups 组对象
//        在正则表达式中有 (?<Name>) 这样的写法，那么匹配的字符串就会有一个组名Name,
//        (?<Name>) 就是有名捕捉。