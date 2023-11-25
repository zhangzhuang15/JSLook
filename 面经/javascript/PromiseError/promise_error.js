function errorBeforeResolve() {
    new Promise(resolve => {
        throw new Error('beforeResolve');
        resolve();
    }).catch(err => console.log("errorBeforeResolve: ", err.message));
}

function errorInResolve() {
    new Promise(resolve => {
        resolve((() => { throw new Error('inResolve') })())
    })
    .catch(err => console.log('errorInResolve: ', err.message))
}

function errorAfterResolve() {
    new Promise(resolve => {
        resolve();
        throw new Error('afterResolve');
    }).catch(err => console.log("errorAfterResolve: ", err));
}

function errorInThen() {
    Promise
      .resolve()
      .then(_ => { throw new Error('inThen')})
      .catch(err => console.log('errorInThen: ', err.message))
}

function errorInCatch() {
    Promise
      .reject()
      .catch(err => {
        throw new Error('inCatch')
      })
      .catch(err => {
        console.log('errorInCatch: ', err.message)
      })
}

function errorBeforeReject() {
    new Promise((resolve,reject) => {
        throw new Error('beforeReject');
        reject('');
    })
    .catch(err => { console.log("errorBeforeReject: ", err.message)})
}

function errorInReject() {
    new Promise((resolve, reject) => {
        reject((() => { throw new Error('inReject')})());
    })
    .catch(err => { console.log("errorInReject: ", err.message)})
}

function errorAfterReject() {
    new Promise((resolve, reject) => {
        reject('');
        throw new Error('afterReject')
    })
    .catch(err => console.log("errorAfterReject: ", err.message))
}


errorBeforeResolve();

errorInResolve();

// error is ignored
errorAfterResolve();

errorInThen();

errorInCatch();

errorBeforeReject();

errorInReject();

// error is ignored
errorAfterReject();


// throw error in thennable callback, catchable callback,
// promise constructor call, error will be catched in 
// .catch call