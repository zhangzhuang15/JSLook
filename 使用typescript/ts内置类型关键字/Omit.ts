interface People {
    name: string
    age: number
    height: number
    country: string
}

(function(){
    // T = Omit<People, 'age' | 'country'>
    // 类型T的键全部位于 People中，但是不包括 ‘age’ 和 'country'
    const m: Omit<People, 'age' | 'country'> = {
        name: 'lucy',
        height: 171,
        age: 24
    }
})()

// 在 age 处报错了