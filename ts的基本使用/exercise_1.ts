const man = { 
    name: 'Jack', 
    age: 18 , 
    like: { 
        football: true 
    }
}

function print(m: any) {
    console.log(m?.like?.football)
    console.log(m?.likes?.football)   // value?.key   => value等于null 或者 undefined时，返回 undefined， 否则返回 value.key

    console.log(m?.likes ?? 'okey')   // left-value ?? right-value 
                                      //          => left-value 等于 null 或者 undefined 时，返回 right-value, 否则返回 left-value

    console.log(m!.like!.baseball)    // value!.key   => 告诉编译器 value 肯定不会等于 null 或者 undefined
}

print(man)