import { expect, test, vi, describe, afterEach } from "vitest"
import { add } from "@/function"

const isMock = true

const fn = {
    add
}

describe("mock case", () => {
    afterEach(() => {
        vi.restoreAllMocks()
        vi.clearAllMocks()
    })

    // 1
    test("test if we call add function 2 times", () => {
        const spy = vi.spyOn(fn, "add")

        expect(spy.getMockName()).toBe("add")

        fn.add(1, 2)
        expect(spy).toHaveBeenCalledOnce()

        fn.add(1, 3)
        expect(spy).toHaveBeenCalledTimes(2)
    })

    // 2
    test.runIf(!isMock)("test if we call add funtion 1 time", () => {
        const mockFn = vi.fn().mockImplementation(add)

        expect(mockFn(1, 2)).toBe(3)

        expect(mockFn).toHaveBeenCalledOnce()
    })

    // 3
    test("test mock global value", () => {
        const mockFn = vi.fn(() => ({
            hello: () => "hello"
        }))

        vi.stubGlobal("mFn", mockFn)

        expect(global.mFn().hello()).toBe("hello")
    })

    // 4
    test("test mock module", () => {
        // vitest 会通过编译的手法，将 vi.mock 提升到
        // 文件开头
        vi.mock("@/function", () => ({
            add: (a, b) => "add"
        }))

        expect(add(1, 2)).toBe("add")
    })
})
