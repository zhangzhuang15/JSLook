(function(){
    interface P {
        name: string
    }

    // T = ReadOnly<P> 
    // 类型T中所有的键来自于类型P，且这些键都被转化为只读键。
    // name是只读的，m.name 的修改肯定会报错。
    const m: Readonly<P> = {
        name: 'jack'
    }

    m.name = 'Potter'
})()