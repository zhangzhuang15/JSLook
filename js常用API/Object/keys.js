var dog = { name: "charlie", age: 3, sex: 'boy' };

Object.defineProperty(dog, 'birth', {
    enumerable: false,
    value: 'China',
})

// NOTE: 非遍历属性名无法获取到

const names = Object.keys(dog);

names.forEach(name => console.log("property name: ", name));