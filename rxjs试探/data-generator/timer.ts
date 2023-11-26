import { timer } from "rxjs";

function run() {
    const ms = 2_000;
    // act like setTimeout
    const t = timer(ms)
    t.subscribe(item => console.log(item, 3))
}

run()