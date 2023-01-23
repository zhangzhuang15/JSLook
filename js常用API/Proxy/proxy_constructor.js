function handlerOfConstruct(target, argArray, newTarget) {
    console.log("target: ", target);
    console.log("argArray: ", argArray);
    console.log("newTarget: ", newTarget);
    console.log("target === newTarget : ", target === newTarget);
    return new target(...argArray);
}

class Dog {
    constructor(name, age, food) {
        this.name = name;
        this.age = age;
        this.food = food;
    }

    tell() {
        console.log("name: ", this.name);
    }
}

var ProxyDog = new Proxy(Dog,
                          {
                              construct: handlerOfConstruct
                          }
);

var dog = new ProxyDog("Mike", 3, "banana");
dog.tell();