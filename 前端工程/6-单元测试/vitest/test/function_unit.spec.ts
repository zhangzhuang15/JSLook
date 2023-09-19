/**
 * unit test case
 */

import { test, expect, describe, afterEach, afterAll, beforeEach, beforeAll } from "vitest"
import { add, greater } from "@/function"

afterEach(() => { console.log("this test is end") })
afterAll(() => { console.log("all tests are end") })
beforeAll(() => { console.log("start to run tests") })


test("test add method in function.ts", () => {
    expect(add(1, 2)).toBe(3)
})


describe("only cases", () => {
    beforeEach(() => console.log("this test in only case is ready"))
    afterEach(() => console.log("this test in only case is end"))

    test.only("test only add method in function.ts", () => {
        console.log("test only")
        console.log("__dirname: ", __dirname)
        expect(add(1, 2)).toBe(3)
    })
    
    test.only("test only greater method < branch in function.ts", () => {
        expect(greater(1 , 2)).toBe(-1)
    })

    test.only("test only greater method > branch in function.ts", () => {
        expect(greater(2, 1)).toBe(1)
    })

    test.only("test only greater method === branch in function.ts", () => {
        expect(greater(2,2)).toBe(0)
    })
})

describe("no only case", () => {
    afterEach(() => console.log("this test in no only case is end"))
    describe("extend case", () => {
        const ageTest = test.extend({ peter: 13, jack: 24 })
        ageTest("compare the age between Peter and Jack", ({ peter, jack }) => {
            expect(greater(peter, jack)).toBeLessThan(0)
        })
    })

    describe("each case", () => {
        test.each([
            { a: 1, b: 4, expected: 5 },
            { a: 3, b: 1, expected: 4 },
        ])(`add($a, $b) -> $expected`, ({a, b, expected}) => {
            expect(add(a, b)).toBe(expected)
        })
    })
})


test.todo("test greater method in function.ts")



