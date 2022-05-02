function fn() {
    console.log(this)
}

var arr = [fn]

arr[0]()


// arr[0]() 等效于 arr.fn()