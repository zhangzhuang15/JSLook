var m = new Map();

m.set("name", "jack");
m.set("age", "23");
m.set("height", "178");

for(let value of m.values()) {
    console.log("value: ", value);
}