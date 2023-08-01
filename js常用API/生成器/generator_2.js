function* Gen() {
    const data = yield 10;
    console.log("data: ", data);

    yield 100;
}

const g = Gen();

// stopped after running `yield 10`,
// at this moment, we don't assign any value to variable data
const t = g.next();

console.log("t: ", t);

// assign "hello world" to variable data, continue to run,
// stopped after running `yield 100`
const m = g.next("hello world");

console.log("m: ", m)

