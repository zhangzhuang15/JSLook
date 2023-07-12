const obj = {
    name: 'Jack',
    age: 19,
    animal: 'Tiger',
    sex: 'boy'
};


const objJSON = JSON.stringify(obj, ['sex', 'animal']);

console.log(objJSON);