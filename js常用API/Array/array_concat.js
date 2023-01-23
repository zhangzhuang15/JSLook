var p = [1, 4, 6];
var q = ["jack", "julie"];

// concat不会修改 p 和 q
var m = p.concat(q, [false, true]);

console.log("p: ", p, "\tm: ", m);