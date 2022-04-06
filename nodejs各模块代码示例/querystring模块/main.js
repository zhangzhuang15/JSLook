const querystring = require("querystring");

// 模拟 http请求中 query部分的字符串
// http://[hostname]:[port][path]?[query]#[fragment]
const queryParams = { name: "jack", sport: "tennis", computer: "dell"};

// 将对象转换为符合query格式的字符串
const params = querystring.stringify(queryParams)
console.log(params); // name=jack&sport=tennis&computer=dell

// 将query字符串转换为类Oject对象
const url = "name=zhangsan&age=25&computer=apple";
const query = querystring.parse(url);
console.log(query); // { name: "zhangsan", age: "25", computer: "apple" }