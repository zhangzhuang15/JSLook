namespace demo3 {
    class Man {
        protected age: number 

        constructor() {
            this.age = 10
        }
    }

    const m = new Man()

    // protected 属性无法访问, 但经过tsc编译后的js可以执行
    m.age;
}