import { test } from "vitest"
import { add } from "@/function"

test("test builtin context", ({ expect, skip, task }) => {
    console.log("task name: ", task.name)
    console.log("task mode: ", task.mode)

    expect(add(1, 2)).toBe(3)

    skip()

    console.log("add(1, 4) -> 5")

    expect(add(1, 4)).toBe(5)

    console.log("end")

})