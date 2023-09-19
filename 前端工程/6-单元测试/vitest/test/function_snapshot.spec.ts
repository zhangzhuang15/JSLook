import { expect, test } from "vitest"
import { add } from "@/function"

test("add 1 and 2 should be 3", () => {
    expect(add(1, 2)).toMatchSnapshot()
})

test("add 2 and 3 should be 5", () => {
    expect(add(2, 3)).toMatchInlineSnapshot('5')
})