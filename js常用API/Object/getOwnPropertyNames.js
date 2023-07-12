var dog = { name: "charlie", age: 3, sex: 'boy' };

Object.defineProperty(dog, 'birth', {
    enumerable: false,
    value: 'China',
})

// NOTE: 非索引的属性名也能获取到

const names = Object.getOwnPropertyNames(dog);

names.forEach(name => console.log("property name: ", name));