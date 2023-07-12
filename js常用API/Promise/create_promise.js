var promise = new Promise(
                            resolve => {
                                console.log("create promise");
                                setTimeout( 
                                    () => {
                                        resolve("hello world")
                                    }
                                    , 3000
                                )
                            }
);

promise.then( message => console.log("promise is resolved: ", message))

console.log("promise is pending");