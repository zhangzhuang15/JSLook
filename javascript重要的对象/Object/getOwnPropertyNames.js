var dog = { name: "charlie", age: 3, sex: 'boy' };

const names = Object.getOwnPropertyNames(dog);

names.forEach(name => console.log("property name: ", name));