var dog = { name: "Pipi" };

Object.defineProperty(dog, 'color', { value: 'red'} );

console.log(dog.hasOwnProperty('name'));

console.log(dog.hasOwnProperty('color'));