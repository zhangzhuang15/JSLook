var p = "34";

console.log(parseInt(p, 10)); // 按照 10进制 解析 34
console.log(parseInt(p, 16)); // 按照 16进制 解析 34，就是 3*16 + 4 = 52
console.log(parseInt(p, 8)); // 按照 8 进制解析 34， 就是 3*8 + 4 = 28
console.log(parseInt(p, 2)); // 按照 2 进制解析 34， 解析不了，返回 NaN