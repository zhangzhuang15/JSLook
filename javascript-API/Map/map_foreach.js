var m = new Map();

m.set("orange", 5);
m.set("potato", 8);
m.set("hot pot", 10);

m.forEach((value, key) => {
    console.log(key, ":", value);
})