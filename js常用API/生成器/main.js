
function* gen(){
   const args = arguments;
   for(let item of args){
       if(typeof item !== 'number'){
           throw TypeError("参数必须是number类型");
       }
   }
   let init, final, step;
   [init, final, step] = args;
   init = init == null ? 0: init;
   final = final == null ? 5: final;
   step = step == null ? 1: step;
   if(init > final && step > 0 || init < final && step < 0) {
          throw RangeError('参数有问题');
   }
   for(var i = init; i <= final; i+=step) { yield i; }
   let x = yield i;
   yield x;
}


function* gen2(){
    let m = yield;
    console.log("m: ", m);
    yield 255;
    yield;
    yield* gen();  // use gen to generate the following values
}

const generator = gen2();
generator.next();
/** 打印 5 和 255 */
console.log("generate value: ", generator.next(5));
// 打印 undefined
console.log("generate value: ", generator.next());
/** 进入到gen中，打印0 */
console.log("generate value: ", generator.next());
console.log("generate value: ", generator.next());
console.log("generate value: ", generator.next());
console.log("generate value: ", generator.next());
console.log("generate value: ", generator.next());

/** 打印 5 */
console.log("generate value: ", generator.next());

/** 打印6
 *  此时执行到了 gen函数中 let x = yield i 且 i = 6
 *  可见传入的 10并没有赋值到 i
 *  也就是说  yield i语句此时是向外抛出数据，不接受输入的数据
 */
console.log("generate value: ", generator.next(10));

/** 打印 12
 *  此时 let x = yield i 中的 yield i语句接受输入的数据12，
 *  向下继续执行，在 yield x处抛出数据12后停止
 */
console.log("generate value: ", generator.next(12));

/** 打印 undefined
 *  从yield x处继续执行，此时函数已经结束，于是整个迭代结束
 */
console.log("generate value: ", generator.next(10));


/**
 *  generator.next() return an Object
 *     {
 *       value    生成的数据
 *       done: boolean  生成器是否完成（也就是没有新的数据产生了，如果继续调用，得到的value是undefined）     
 *     }
 * 
 *  如果只想获取其中的value，请使用 generator.next().value
 */