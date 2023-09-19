import { bench, expect } from "vitest"

bench.todo("invoke 100 times add function")

bench("sort 50-length Array whose item is 3-element tuple", () => {
    const data = new Array(50).fill(0).map(_ => {
        const a = Math.floor(Math.random() * 100)
        const b = Math.floor(Math.random() * 100)
        const expected = a + b
        return [a, b, expected]
    })

    data.sort((itemA, itemB) => itemA[0] - itemB[0] )
})