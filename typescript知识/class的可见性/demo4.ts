namespace demo4 {
    class Man {
        // 默认是 public，但是 #variable 视为
        // 真正的 private
        #age: number 

        constructor() {
            this.#age = 10
        }
    }

    const m = new Man()

    // 无法访问，tsc编译后的js无法执行
    m.#age
}