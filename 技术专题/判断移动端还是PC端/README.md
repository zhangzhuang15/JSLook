```javascript
function isPc() {
    const userAgent = navigator.userAgent
    let isPC = true

    const data = ['Android', 'iPhone', 'SymbianOS', 
                  'Windows Phone', 'iPad', 'iPod']

    for(let flag of data) {
        if(userAgent.indexOf(flag) > 0) {
            isPC=false
            break
        }
    }
    
    return isPC
}
```