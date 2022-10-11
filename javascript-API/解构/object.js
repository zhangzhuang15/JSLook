let name = 'Jack';

// 这里的 [name] 有点爽
function getAge({[name]: age }) {
    console.log('age: ', age);
}

const Age = {
    'Jack': 15,
    'Peter': 24,
};

getAge(Age);

name = 'Peter';

getAge(Age);