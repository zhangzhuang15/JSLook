var map = new Map();

map.set("name", "Loo");

map.set("age", 5);

var dog = Object.fromEntries(map);

console.log(dog);