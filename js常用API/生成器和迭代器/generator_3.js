
function* world() {
    console.log("welcome to earth");

    yield "world";

    console.log("bye-bye")
}


function* hello() {
    yield "hello"

    console.log("nice to see you");

    yield* world()

    console.log("see you again");
}


const g = hello();

// stopped after running `yield "hello"`
const t = g.next();
console.log("t: ", t)

// continue to run, log "nice to see you",
// then jump into world function,
// stopped after running `yield "world"`
const v = g.next();
console.log("v: ", v);

// continue to run, log "bye-bye",
// then come back to the context of hello function,
// log "see you again";
g.next();