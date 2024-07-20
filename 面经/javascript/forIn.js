const a = { name: 'jack', age: 10 };

const b = Object.create(null)
b.hello = 'hello world';
b.say = () => {
  console.log('hello world');
};

for (const key in a) {
    console.log(key, a[key])
}

console.log()

for (const key in b) {
    console.log(key, b[key])
}

console.log()

const c = Object.create(b);
c.name = 'peter';
c.hello = 'hello';
for (const key in c) {
    console.log(key, c[key])
}
