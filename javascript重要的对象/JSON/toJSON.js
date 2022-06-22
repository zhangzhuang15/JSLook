const obj = {
    name: 'Jack',
    age: 19,
    animal: 'Tiger',
    sex: 'boy'
};

obj.__proto__.toJSON = () => { return 'name age animal sex' };

const objJSON = JSON.stringify(obj);

console.log(objJSON);