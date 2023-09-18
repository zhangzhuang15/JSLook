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

console.log("end: ", g.next())


const k = {
    [Symbol.iterator]: () => {
        return {
            count: 1,
            next() { 
                if (this.count === 3) return this.throw(Error("Help"));
                return { value: this.count, done: this.count++ === 4 } 
            },
            return(v) { console.log("finish", v); return { value: 1000, done: true } },
            throw(reason) { console.log("reason: ", reason); return { done: true } }
        }
    },
};

const [k1] = k;
console.log(k1)