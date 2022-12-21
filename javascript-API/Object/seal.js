const xiao_ming = {
    name: 'xiao ming',
    age: 17
};

Object.seal(xiao_ming);

// 1. cannot delete
delete xiao_ming['age'];
console.log('age: ', xiao_ming.age);

// 2. cannot add
xiao_ming['friend'] = 'peter';
console.log('friend: ', xiao_ming.friend);

// 3. can change value if it's writable
xiao_ming.age = 19;
console.log('age: ', xiao_ming.age);