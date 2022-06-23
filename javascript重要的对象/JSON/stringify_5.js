const obj = [
    {
        name: 'Jack',
        age: 19,
        animal: 'Tiger',
        sex: 'boy'
    },
    {
        name: 'Bike',
        age: 15,
        animal: 'Cat',
        sex: 'boy'
    }];


const objJSON = JSON.stringify(obj, ['name', 'age'], 2);

console.log(objJSON);