var p = [1, 2, 3, 4, 6, "jack"];

// 从 p[1] 开始拷贝 p[5:6) 的内容
var m = p.copyWithin(1, 5, 6);

console.log("p: ", p, "\tm: ", m);