var p = ["Jack", 1, false, { age: 14} ];

// keys返回一个迭代器，迭代器返回的值是p中每个元素的索引号
for(let m of p.keys()) {
    console.log("index: ", m)
}