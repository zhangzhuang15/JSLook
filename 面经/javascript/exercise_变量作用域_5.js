var name = "World";

(function(){
    if (typeof name === "undefined") {
        var name = "Jack"
        console.log("GoodBye ", name)
    } else {
        console.log("Hello ", name)
    }
})()

// 第 5 行存在变量提升， var name 将加入到第 4 行代码之前