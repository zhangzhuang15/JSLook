namespace demo2 {
    class Man {
        private age: number 
    
        constructor() {
            this.age = 10
        }
    }
    
    const m = new Man();

    // private 无法访问，但经过tsc编译后的js可以执行
    m.age;
}
