import { of } from "rxjs"

function run() {
    // when you call `subscribe`, data is generated at once;
    of(10, 300, 'ok')
      .subscribe(item => console.log(item))

    console.log("start...")
}

run()