import { equal } from "node:assert"
import { add } from "../add"

describe("test add function", () => {
    it("add(2, 3) === 5", () => {
        const v = 10;
        equal(add(2, 3), 5)
    })
});