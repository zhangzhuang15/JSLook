class M {
    constructor(limit) {
        this.limit = limit
    }

    [Symbol.iterator]() {
        let i = 1;
        const limit = this.limit
        return {
            next() {
                if (i < limit) {
                    return { value: i++, done: i > limit };
                }
                return { value: undefined, done: true };
            }
        };
    }
}

const m = new M(5);

const t = [...m];

console.log(t);