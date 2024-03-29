function* Gen() {
    console.log("1");

    yield "Hello world";

    console.log("2");

    yield "right";

    // 结尾是 return 时，返回的 result = { done: true, value: 10 }
    // 结尾是 yield 时， 返回的 result = { done: false, value: 10 }
    return 10;
}

// nothing to do
const g = Gen();

// log 1, stopped after running first `yield`
const first_yield_value = g.next();
console.log("first yield value: ", first_yield_value);

const second_yield_value = g.next();
console.log("second yield value: ", second_yield_value);

// although we call `return` instead of `yield`, result is same.
const third_yield_value = g.next();
console.log("third yield value: ", third_yield_value);
