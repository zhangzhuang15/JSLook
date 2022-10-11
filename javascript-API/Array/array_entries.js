var p = ["Money", false, "234", 127.01];

// entries返回 key-value 的迭代器，迭代器返回的是一个类二元数组，
// 数组[0]是key，数组[1]的value。
for(let entry of p.entries()) {
    console.log("key: ", entry[0], "\tvalue: ", entry[1]);
}