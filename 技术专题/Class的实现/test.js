const Person = require("./Person");

try{
    var p = Person();
}catch(error){
    console.error("没有使用new Person()");
    console.error(error);
}

var q = new Person("Jack", 23);
console.log("q.getName():", q.getName());
console.log("Person.isPerson(q):", Person.isPerson(q));