(function(){
    interface P {
        name: string
        age: number
        height: number
    }

    // T = Partial<P>
    // 类型T中的键都来自于 类型 P，而且这些键都被转化为 可选的。
    // T = {
    //    name?: string
    //    age?: number
    //    height?: number    
    // }
    const m: Partial<P> = {}
})()