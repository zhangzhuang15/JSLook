
const iterator = {
    i: 0,
    next() {
        if (this.i < 5) {
            return { value: this.i++, done: false }
        }

        const value = this.i 
        this.i = 0
        return { value: value, done: true }
    },
    [Symbol.iterator]() {
        return this
    }
}


// 读不到 5 
for (const item of iterator) {
    console.log(item)
}