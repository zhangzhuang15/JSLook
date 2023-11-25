async function reject() {
    await Promise.reject('reject');
}

async function errorInThen() {
    await Promise.resolve().then(_ => { throw new Error("wrong")});
}

async function errorBeforeAwait() {
    throw new Error("error");
    await Promise.resolve();
}

async function errorAfterAwait() {
    await Promise.resolve();
    throw new Error("oh");
}

reject().catch(err => console.log("reject(): ", err));
errorInThen().catch(err => console.log("errorInThen(): ", err.message));
errorAfterAwait().catch(err => console.log("errorAfterAwait(): ", err.message));

// cannot catch error
// errorBeforeAwait().catch(err => console.log("errorBeforeAwait(): ", err));