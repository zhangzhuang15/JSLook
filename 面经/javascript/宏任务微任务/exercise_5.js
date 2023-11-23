setTimeout(() => {
    setImmediate(() => {
        console.log('immediate');
    });

    Promise.resolve().then(_ => console.log('promise'));

    process.nextTick(() => {
        console.log('nextTick');
    })
}, 0);