import { equal } from "node:assert"
import { add } from "../add"

describe("test add function", () => {
    it("add(2, 4) === 6", () => {
        equal(add(2, 4), 6)
    })
})