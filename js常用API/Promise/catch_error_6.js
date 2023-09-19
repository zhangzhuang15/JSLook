async function oh() {
    throw Error("Oh");
}

async function what() {
    return Promise.reject("what");
}

async function error() {
    try {
        throw Error("shit");
    } finally {}
}

oh().catch(err => console.log("error"))

what().catch(err => console.log("what")).then(err => console.log("else"))

error().catch(err => console.log("shit"))

Promise.resolve().then(() => console.log(1)).then(() => console.log(2)).then(() => console.log(3)).then(() => console.log(4));