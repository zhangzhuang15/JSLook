var dog = { name: "Pipi" };

Object.defineProperty(dog, 'color', { value: 'red'} );

console.log(dog.hasOwnProperty('name'));

console.log(dog.hasOwnProperty('color'));

console.log()

for(let key in dog) {
    console.log(key)
}

console.log()

for(let key in dog) {
    // NOTE: in操作符可以访问到对象继承下来的属性名，
    // 用 hasOwnProperty过滤掉
    if (dog.hasOwnProperty(key)) {
        console.log(key)
    }
}