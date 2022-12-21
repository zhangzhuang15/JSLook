const m = {
    // this special method return an iterator!
    [Symbol.iterator]: () => {
        let i = 0
        return {
            next: () => {
                if (i < 5) {
                    return { value: i++, done: i > 5}
                }
                return { value: undefined, done: true }
            }
        };
    }
}

for(const t of m) {
    console.log(t);
}