var p = "jump";

var m = p.padStart(8, "X");

console.log("p: ", p, "\tm: ", m);

m = p.padStart(8, "XYYZKIIY");

console.log("p: ", p, "\tm: ", m);

// padEnd 用法一样，只不过在最后补充字符