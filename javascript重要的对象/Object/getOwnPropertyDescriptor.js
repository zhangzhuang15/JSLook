var dog = { name: "Nicle", age: 2, color: "white" };

const descriptor = Object.getOwnPropertyDescriptor(dog, 'age');
console.log("descriptor: ", descriptor);


console.log();


const descriptors = Object.getOwnPropertyDescriptors(dog);
Object.entries(descriptors).forEach(
    entry => {
        console.log(entry[0], ": ", entry[1]);
    }
);