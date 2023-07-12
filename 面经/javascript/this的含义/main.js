Mike = 23; // 没有用 var 定义的变量，将作为 global对象的属性
global.Peter = 10;


// 普通函数的this默认指向 global
function tellMike() {
    console.log("Mike: ", this.Mike);
}

// 但是在一个对象的上下文里，tellMike中的 this 指向 teacher
var teacher = {
    Mike: 32,
    Peter: 1,
    tellMike: tellMike,
    tellPeter: () => {
        console.log("Peter: ", this.Peter);
    }
}

// 普通函数的this，必须在执行的时候，根据上下文才能判断

tellMike(); // 23
teacher.tellMike(); // 32


// 箭头函数的this，是在箭头函数被定义的时候就确定下来的，详情见 箭头函数 一节
teacher.tellPeter(); // undefined


// 也可以指定 this
tellMike.call({ Mike: "yahoo"}) ; // "yahoo"
teacher.tellMike.bind({ Mike: "gagaga"})(); //"gagaga"
teacher.tellPeter.apply({Peter: 100}, []); // undefined          箭头函数无法修改this