function getOneKBToken() {
    let token = ""
    const ten_byte_token ="aaaaaaaaaa"

    for(let i = 0; i < 1024; i++) {
        token += ten_byte_token
    }

    return token
}

// 返回值单位： KB
// 众所周知，localstorage的容量是5M，这个函数刚好可以验证一下
function getLocalStorageCap() {
    const token = getOneKBToken()
    return new Promise(resolve => {
        let result = token
        localStorage.clear()
    
        const timer = setInterval( _ => {
            try {
                localStorage.setItem('token', result)
            } catch(e) {
                clearInterval(timer)
                localStorage.clear()
                resolve(result.length/1024)  // 除以 1024 转化为 KB
            }
            result += token
        }, 0)
    })
}

// 返回值单位: KB
function getLocalStorageCurrentSize() {
    let result = 0

    for(let key in localStorage) {
        if(Object.prototype.hasOwnProperty.call(localStorage, key)) {
            result += localStorage.getItem(key).length
        }
    }

    return result / 1024
}


async function test(callback) {
    const cap = await getLocalStorageCap()
    
    const token = getOneKBToken()
    localStorage.setItem("token", token + token + token)

    const currentsize = getLocalStorageCurrentSize()

    callback(`localstorage cap is ${cap}KB, now its size is ${currentsize}KB`)
    localStorage.clear()
}