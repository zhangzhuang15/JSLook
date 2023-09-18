import { assertType, test, expectTypeOf } from "vitest"
import { add } from "@/function"


test("test add function type", () => {
    expectTypeOf(add(1, 3)).toEqualTypeOf<number>()

    expectTypeOf(add).toEqualTypeOf<(a: number, b: number) => number>()

    expectTypeOf(add(1, 2)).toMatchTypeOf<number | string>()

    expectTypeOf(add).returns.toBeNumber()

    expectTypeOf(add).parameters.toEqualTypeOf<[number, number]>()
})