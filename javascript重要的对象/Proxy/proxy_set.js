function handlerOfSet(target, property, value, receiver) {
    console.log("target: ", target);
    console.log("property: ", property);
    console.log("value: ", value);
    console.log("receiver: ", receiver);
    console.log("receiver === target : ", receiver === target);
}

var dog = {
    name: "Nancy",
    age: 4,
    food: "rice leftover"
};

var proxy = new Proxy(dog, 
                      {
                          set: handlerOfSet     // handlerOfSet的 target 指的就是 dog
                      }
);

dog["height"] = 34;  // 不会触发 handlerOfSet
dog["age"] = 5;      // 不会触发 handlerOfSet

proxy["food"] = "cabbage";  // 触发 handlerOfSet


// 使用proxy触发 handlerOfSet  --->  修改 dog