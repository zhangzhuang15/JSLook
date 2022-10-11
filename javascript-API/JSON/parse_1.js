const obj = {
    name: 'Jack',
    age: 19,
    animal: 'Tiger',
    sex: 'boy'
};


const objJSON = JSON.stringify(obj);


const reviveJSON = JSON.parse(objJSON, (key, value) => { 
    if (key === 'sex') return; 
    return value; 
});

console.log(reviveJSON);