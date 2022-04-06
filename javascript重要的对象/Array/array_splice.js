var p = [1, 4, 5, 888];

// splice 用于删除
var m = p.splice(1, 2);

console.log("p: ", p, "\tm: ", m);


// splice 用于添加
m = p.splice(0, 0, 4, 5);

console.log("p: ", p, "\tm: ", m);
