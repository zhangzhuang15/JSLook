function handlerOfGet(target, property, receiver) {
    console.log("target: ", target);
    console.log("property: ", property);
    console.log("recevier: ", receiver);
    console.log("target === dog : ", target === dog);
    console.log("receiver === target : ", receiver === target);
    return target[property];
}



var dog = {
    name: "Nancy",
    age: 4,
    food: "rice leftover"
};

var proxy = new Proxy(dog, 
                      {
                          get: handlerOfGet
                      }
);

console.log("name: ", proxy["name"]); // 触发 handlerOfGet
console.log("age: ", dog["age"]); // 不会触发 handlerOfGet