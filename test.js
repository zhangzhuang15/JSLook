// Aa804902


const a = [null, null]

const set = (i) => {
    a[i] = (hello) => { console.log("hello")};
};

set(0);
set(1);

console.log("a[0] === a[1]: ", a[0] === a[1])
console.log("a[0] == a[1]: ", a[0] == a[1]);