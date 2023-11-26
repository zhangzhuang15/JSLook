import { range } from "rxjs";

function run() {
    range(5, 3)
     .subscribe(x => console.log(x))
}

run()