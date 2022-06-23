const obj = {
    a: {
        a: 1
    }
}

const obj_ = {
    a: {
        b: 2
    }
}

console.log(Object.assign(obj, obj_))



// Object.assign 走的是 浅拷贝