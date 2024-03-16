namespace demo1 {
    class Man {
        // age 默认是 public
        age: number 
    
        constructor() {
            this.age = 10
        }
    }
    
    const m = new Man();
    m.age
}
