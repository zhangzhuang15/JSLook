async function async1() {
    console.log(1);
    await async2();
    console.log(2);
  }

async function async2() {
    console.log(3);
  }
  
console.log(4);
  
setTimeout(function() {
      console.log(5);
      new Promise(function(resolve) {
            console.log(6);
            resolve();
        }).then(function() {
            console.log(7);
    });
  }, 0);  

setTimeout(function() {
    console.log(8);
    new Promise(function(resolve) {
          console.log(9);
          resolve();
      }).then(function() {
          console.log(10);
  });
}, 0);  
  
async1();
  
console.log(11);

  // 说下浏览器和nodejs环境中各会输出什么呢？


  // Googlel浏览器端
  // 4
  // 1
  // 3
  // 11
  // 2
  // 5
  // 6
  // 7
  // 8
  // 9
  // 10


  // nodejs
  // 4
  // 1
  // 3
  // 11
  // 2
  // 5
  // 6
  // 7
  // 8
  // 9
  // 10



  // 分析：
  // 首先，本js文件作为第一个宏任务执行
  // 执行 console.log(4) ， 打印出 4
  // 遇到两个setTimeout，加入宏任务队列，
  //
  // 执行 async1 函数
  // async1 函数等效于
  //  function async1() {
  //       console.log(1)
  //       Promise.resolve(async2()).then( () => { console.log(2) })    
  //  }
  // 打印1
  // 执行async2函数打印 3
  // 打印2的代码加入微任务队列中
  // 之后执行 console.log(11) 打印11
  // 
  // 当前宏任务执行完毕，取出微任务执行
  // 此时打印出 2
  //
  // 取下一个宏任务执行， 就是第一个setTimeout
  // 先输出5，再输出6，
  // 输出7的代码放入微任务队列
  // 宏任务执行完毕后，取出微任务执行，输出7
  //
  // 类似顺序执行第二个setTimeout
  // 于是输出 8 9 10