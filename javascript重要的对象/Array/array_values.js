var p = ["Kite", 3, false];

// values方法返回一个迭代器，迭代器返回的值是 p 中的每个元素
for(let value of p.values()) {
    console.log("value: ", value);
}