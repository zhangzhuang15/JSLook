var p = [[1, [2, 3]], "Mike", true];

// 遍历到 p[0]时，[1, [2, 3]],
// item 依次等于 1, [2,3]，而返回的值
// 就会直接添加到新数组 m 中了，于是在
// p 中是 [1, [2,3]]，在 m 中被展开
// 为 1, [2, 3]；
var m = p.flatMap( item => item);

console.log("p: ", p, "\tm: ", m);