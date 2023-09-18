Promise.resolve()
       .then(() => {
          console.log(1);
          return Promise.resolve(2);
       })
       .then(res => console.log(res));

Promise.resolve()
       .then(() => console.log(3))
       .then(() => console.log(4))
       .then(() => console.log(5))