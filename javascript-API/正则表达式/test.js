const reg = /[0-9]{4}-[0-9]{0,2}-[0-9]{0,2}/

const tokens = ["1998-1-1", "1998--", "1998-12-0", 
                "1998-0-12", "1998-0-123", "1998-123-01"]

let maxLength = 0

tokens.forEach( token => {
    maxLength = maxLength < token.length? token.length: maxLength
})

for(let token of tokens) {
    let result = `${token}`.padEnd(maxLength, ' ')
    result = reg.test(token)? result + `   ✅ matched`: result + `   ❌ not matched`
    console.log(result)
}


// test(string)
// string 符合正则表达式要求，返回 true; 否则返回 false。