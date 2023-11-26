import { interval } from "rxjs"

function run() {
    const ms = 1_000;

    // every 1000ms, generate a data self-increased since 0, 
    // until `unsubscribe` is invoked;
    //
    // when you call `interval`, no data is generated;
    // when you call `subscribe`, data will be generated but not now;
    const subscription = 
      interval(ms)
        .subscribe(item => {
            if (item > 10) {
                subscription.unsubscribe();
                return;
            }
            console.log(item)
        })

    console.log("start...")
}

run()