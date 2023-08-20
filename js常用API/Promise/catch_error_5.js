// you can catch error
new Promise((resolve, reject) => { throw Error("error")})
    .then((res) => res)
    .catch(error => console.log("catch error"))


// you still can catch the error    
new Promise((resolve, reject) => {
    const errorFn = () => { throw Error("error") };

    resolve(errorFn());
})
.catch(error => console.log("still catch the error"))
