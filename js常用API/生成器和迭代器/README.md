# iterable protocol
如果一个object想被 `for...of` 访问，那么object必须满足 iterable protocol:
* object必须实现一个名字叫做 Symbol.iterator 的方法
* 这个方法没有入参
* 这个方法的返回值必须是一个iterator(迭代器)

iterator：
* 是一个js对象
* 包含一个next方法，入参个数为0或者1个
* next方法返回值必须满足 iteratorResult interface
    ```ts 
    interface IteratorResult {
        value: any;
        done: boolean;
    }
    ```
* next返回的 done 为 true时，则迭代结束


# 如何定义 iterator 
## 根据 iterator 定义
```js 
const iterator = {
    count: 0,
    next() {
        return { value: count, done: count === 10 };
    }
};

const m = {
    [Symbol.iterator]() {
        return iterator;
    }
}

for (const v of m) console.log(v);
```

## 通过生成器
```js 

function* Gen() {
    yield "hello";
    console.log("world");
    yield 10;
}

// Gen 就是一个生成器
// 生成器的执行结果，就是返回一个iterator对象

const m = {
    [Symbol.iterator]: Gen,
};

for (const v of m) console.log(v);

// hello
// 10
```

# iterator的另外两个方法
iterator至少需要有一个 next 方法，还有两个可选的方法 return 和 throw.

return方法：
* 入参是0个或者1个，返回值符合 IteratorResult interface 
* 一旦调用该方法后，无论迭代到哪一步，都会终止
* 可以显式调用该方法，也可以隐式调用
  ```js 
  const iterator = {
    count: 1,
    next() {
        return { value: this.count, done: this.count++ === 3 }
    },
    return() {
        console.log("hello world");
        return { done: true };
    }
  }

  // 这将隐式调用return
  const [k] = iterator;

  // 不会隐式调用return
  const [m, n] = iterator;
  ```

throw方法：
* 入参是0个或者1个，返回值符合 IteratorResult interface 
* 一旦调用该方法后，无论迭代到哪一步，都会终止
* 暂时没有发现隐式调用的场景
  ```js 
  const iterator = {
    count: 1,
    next() {
        if (this.count === 2) return this.throw(Error("Not"));
        return { value: this.count, done: this.count++ === 3 }
    },
    return() {
        console.log("hello world");
        return { done: true };
    },
    throw(reason) {
        console.log("error: ", reason);
        return { done: true };
    }
  }
  ```