(function(){
    interface P {
        name: string | null
        age: number
    }

    type NonNullableOfP<T> = {
        [k in keyof T]: NonNullable<T[k]>
    }

    // NonNullable<T>, 如果 T 是 undefined 或者 null, 返回 never 类型，否则返回 T
    // name 类型是 string | null， 经 NonNullable处理，只留下 string 类型。
    const p: NonNullableOfP<P> = {
        name: null,
        age: 10
    }
})()