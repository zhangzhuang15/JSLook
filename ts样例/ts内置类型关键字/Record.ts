(function(){
    // Record<string, number> 表示 键为 string 类型，值是 number类型的对象。
    // age 的值不是 number，因此报错
    const m: Record<string, number> = {
        name: 23
        age: '12'
    }
})()