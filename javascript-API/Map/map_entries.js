var m = new Map();

m.set("name", "jack");
m.set("age", "23");
m.set("height", "178");

for(let entry of m.entries()) {
    console.log(entry[0], ":", entry[1]);
}