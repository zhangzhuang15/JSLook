/// <reference path="../node_modules/vitest/importMeta.d.ts" />

// To get type hints of `import.meta.vitest`, add the special comment above.
// We don't try to modify `types` of tsconfig.json to do the same thing,
// because we will lose the auto-imported type under @types, e.g. we lose
// the type hints of `@types/node`.

// `import.meta` only has 2 attributes, url and resolve. `vitest` is
// supported by vite in compiling time. `import.meta.vitest` will be
// replaced of other valid codes, such as a valid javascript Object.
// In other words, `import.meta.vitest` is only valid in type declaration,
// not in runtime stage.


export function add(a: number, b: number): number {
    return a + b;
}

export function greater(a: number, b: number): number {
    return a > b ? 1 : (a === b ? 0 : -1)
}

// 类似于Rust方式，在源码内嵌入测试代码, Great!
if (import.meta.vitest) {
    const { test, expect } = import.meta.vitest
    
    test("test add method in source way like Rust", () => {
        expect(add(1,2)).toBe(3)
    })
}