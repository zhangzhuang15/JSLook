import { take, of } from 'rxjs';

function run() {
    of(2, 4, 7, 11, 3, 5)
      .pipe(
        take(4)
      )
      .subscribe(console.log)

}

run()