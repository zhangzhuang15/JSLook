function handlerOfDeleteProperty(target, property) {
    console.log("target: ", target);
    console.log("property: ", property);
    delete target[property];
}

var dog = {
    name: "Nancy",
    age: 4,
    food: "rice leftover"
};

var proxy = new Proxy(dog, 
                      {
                          deleteProperty: handlerOfDeleteProperty
                      }
);

delete proxy["name"];