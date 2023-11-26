import { from } from "rxjs"

const iterator = {
    value: 0,
    next() {
        if (iterator.value < 7) return { done: false, value: iterator.value++ }
        
        const v = iterator.value
        iterator.value = 0;
        return { done: true, value: v }
    },
    [Symbol.iterator]: () => {
        return iterator
    }
};

const asyncIterator = {
    value: 0,
    async next() {
        if (asyncIterator.value < 9) 
          return Promise
                    .resolve()
                    .then(_ => ({ done: false, value: asyncIterator.value++ }))

        const v = asyncIterator.value
        asyncIterator.value = 0;
        return Promise.resolve().then(_ => ({ done: true, value: v }));
    },
    [Symbol.asyncIterator]: () => {
        return asyncIterator;
    }
}

function run() {
    from([1, 4, 5])
      .subscribe(console.log)

    console.log()

    from(new Set([1, 4, 4, 2, 8]))
      .subscribe(console.log)

    console.log()

    from(new Map([['hello', 'peter'], ['good', 'jack']]))
      .subscribe(console.log)

    console.log()

    from(iterator)
      .subscribe(console.log)

    console.log()

    from(asyncIterator)
      .subscribe(console.log)
}

run()