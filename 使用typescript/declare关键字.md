被 declare 声明的类型，无需使用 `import type` 引入，全局直接使用

```typescript
// demo.d.ts
declare namespace A {
    const s = "hello";
}
```
- 在其它`.ts`文件中，无需使用 `import type { A } from 'demo.d'` 引入；
- s 直接从 namespace A 对外暴露，在其它文件，直接使用 A.s 就可以使用；
    > 如果不使用`declare`，必须要用 `export` 暴露 s
    ```typescript
    export namespace A {
        export const s = "hello";
    }
    ```