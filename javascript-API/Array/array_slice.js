var p = [22, { name: "jack"}, false, 0.34];

// 切片 p[0:3)
var m = p.slice(0, 3);

console.log("p: ", p, "\tm: ", m);


// 基本类型的数据，m采取深拷贝；对象类型的数据，m使用浅拷贝
m[0] = "Nancy";
m[1].name = "Nancy";

console.log("p: ", p, "\tm: ", m);


// 这不会影响到p
m.push("Mercy");

console.log("p: ", p, "\tm: ", m);
