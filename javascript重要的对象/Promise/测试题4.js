new Promise(resolve => {
    console.log(1)
    resolve(2)
    console.log(3)
}).then( data => { console.log(data)})