Promise.resolve()
    .then(
        (res) => { throw Error("Ok")}, 
        (error) => console.log("Catch Error")
    )    
    // catch error here
    // if you don't catch the error, runtime won't be dead
    .catch(error => console.log("still catch the error"))

Promise.resolve().then(res => res).then(() => console.log("bye bye"))