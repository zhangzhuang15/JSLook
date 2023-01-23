var dog = { name: "Pike"};

console.log(Object.isExtensible(dog));

Object.preventExtensions(dog); // 禁止使用 defineProperty defineProperties方法添加属性

console.log(Object.isExtensible(dog));

dog['age'] = 3;  // OK

console.log("dog: ", dog);

Object.defineProperty(dog, 'color', { value: 'blue' }); // Error！