const obj = {
    name: 'Jack',
    age: 19,
    animal: 'Tiger',
    sex: 'boy'
};


const objJSON = JSON.stringify(obj, null, '***');

console.log(objJSON);