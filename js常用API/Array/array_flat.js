// p 的深度是1，“ok”和false位于深度0的一层，1、2位于深度1的一层,
// 3位于深度为2的一层。
var p = [[1,2,[3]], "ok", false];


var m = p.flat(0);

console.log("p: ", p, "\tm: ", m);

// p[0]将会被展开为 1， 2， 3
var n = p.flat(1);

console.log("p: ", p, "\tn: ", n);


var t = p.flat(2);

console.log("p: ", p, "\tt: ", t); 