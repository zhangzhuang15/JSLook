interface P {
    name: string
    age?: number
    height?: number
}

(function(){
    // T = Required<P>
    // 类型T的所有键来自于于类型P，且这些键都被转化为必存在的键。
    // P 中 age 和 height 是可选的，但是 Required<P> 中age和height
    // 是必须存在的，所以在 m 报错了。
    const m: Required<P> = {
        name: 'Jack'
    }
})()
