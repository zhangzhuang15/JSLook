function handlerOfHas(target, property) {
    console.log("target: ", target);
    console.log("property: ", property);
    return property in target;
}


var dog = {
    name: "Nancy",
    age: 4,
    food: "rice leftover"
};

var proxy = new Proxy(dog,
                      {
                          has: handlerOfHas
                      }
);
console.log("name in dog : ", "name" in dog);
console.log("age in proxy: ", "age" in proxy); // 触发 handlerOfHas

// 可见 dog不具备响应式特征；
// proxy 具备响应式特征；