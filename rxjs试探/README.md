## 介绍
rxjs 是数据处理的一个库，可以从以下的角度理解它：
- 数据从哪里来
- 数据要做哪些预处理
- 怎么拿到最终的数据

`数据从哪里来`， 对应的就是 `Observable` 概念，这种对象负责生产数据。创建`Observable`对象的方法，请见`data-generator`文件夹；

`数据要做哪些预处理`, 对应的是 `OperatorFunction` 概念，这种对象负责数据预处理，请见 `operator` 文件夹；

`怎么拿到最终的数据`，对应的就是 `subscribe` 概念，在上述两个文件夹里，均有体现。在调用 `subscribe` 方法前，数据是没有流动的，不做任何计算处理，当该方法被调用后，数据发生流动，可能是立即流动，也可能是异步流动，这取决于 `Observable` 背后的调度器是同步的还是异步的。

## Observable 
提供 `subscribe` 实现的就是 Observable;

`subscribe`的结果是，Observable 生成一个 Subscription，并返回；

在创建 Observable 对象的时候，Observable 只关心 subscriber 使用 next error complete 方法 
消费数据，并不关心 subscriber 的 next error complete 究竟是怎么消费数据的；

## Subscription 
提供 `unsubscribe` `add` `remove` 实现的就是 Subscription

`unsubscribe`的语义就是，一旦调用，就取消了 Subscriber(或者Observer)与Observable的订阅关系，
Observable再产生新的数据，不会被 Subscriber（或者Observer）消费；

`add` 就是添加一些回调函数，当 `unsubscribe`执行后，这些回调就会按照添加时的先后顺序依次执行；

`remove` 就是将 `add`添加的那个回调删除，这样 `unsubscribe`执行后，这个回调就不会执行；


## Observer 
Observer是订阅 Observable 的对象，当 Observable 对象产出数据的时候，Observer 消费这些数据；

Observer 消费数据有3种形式，对应其三种方法：
- next
- error
- complete

这也是 Observer 接口定义的三个方法；

当 Observable 有新数据产生时，next 方法会消费这个数据；
当 Observable 产生数据的过程中，碰到错误时，error 方法会消费这个错误；
当 Observable 不再产生新数据时，complete 方法就会消费这种情况；

这种感觉类比 `try {} catch {} finally {}`， `Promise.resolve().then().catch().finally()`

## Subscriber
提供 `next` `error` `complete` `unsubscribe` `add` `remove` 实现的就是 Subscriber；

Subscriber 是 Subscription；
Subscriber 是 Observer;

## Subject
Subject是支持注册多个 subscriber 的 Observable。它重写了 _subscribe 方法，
在该方法中，将subscriber注册到列表中；

Subject同时也是一个 Subcriber，当它调用 next 方法消费数据时，会直接遍历注册在列
的 subscriber，将数据传给它们；

因为这个特点，Subject 不作为数据产出方，而是数据的中转站，因此在创建 Subject 的时候，
你不能往构造函数里传入任何参数，这一点和 Observable 很不同！


## 调度 
什么时候发生调度的呢？调度是在哪里定义的呢？

发生调度的时机是 触发Observable的subscribe；

调度的定义是在创建 Observable 对象时，通过构造函数参数输入的，该参数定义了
subscriber是如何调用 next error complete 方法消费数据的，自然可以在其中
加入调度；

## 链式反应
如果使用了 pipe 方法，会形成一条 Observable 单向链表，Observable.source 作为
链表的指针，每个算子被定义在 Observable.opetator 上边。当触发subscribe方法时，
会沿着链表依次触发算子，上一个 Observable 的算子被触发后，算子本身就会继续触发 
subscribe方法，继续让下一个 Observable 的算子触发，来到链表末尾节点的Observable
对象时，它是没有 operator，它触发subscribe方法时，调用的就是 new Observable(arg)
的 arg 函数，该函数拿到的数据，就已经是一系列算子处理过的数据了。

Observable 触发 subscribe 时，只会有三种反应：
- 如果它有 operator，就会执行 operator；
- 如果它有 source, 就会触发 Observable.source.subscribe，也就链表
  中，下一个Observable节点的 subscribe；
- 否则，会执行你在定义 Observable 时，通过构造函数传入的函数；


## 谁创建了subscriber
因为subscriber内部，需要一些状态变量管理，比如 closed 记录unsubscribe是否已经调用了，
一般情况下，无需使用者创建 subscriber；

使用者只要关心，在定义 Observable 的时候，subscriber 应该做哪些事情，具体做法无需关心，
这是库作者的工作，不是使用者的工作；

在调用 subscribe 方法时，你传入了一个函数，或者一个对象 `{ next, error, complete }`，
你只是给出 subscriber 的接口实现，subscribe 函数内部，会根据你送入的参数，生成一个新的
subscriber 对象，如果你送入的是一个 subscriber 对象，它会直接使用，不会创建一个新的；


## 数据流走向
```ts 

const original = new Observable((subscriber) => {
    for (const item of [1, 3, 4, 6]) {
        subscriber.next(item);
    }

    subscriber.complete();
});

const subscriberOp2 = {
    next: (v) => {
       const value = someTransformFromOp2(v);
       console.log("hello", value);
    }
}

const subscriberOp1 = {
    next: (v) => {
        const value = someTransformFromOp1(v);
        subscriberOp2.next(v);
    }
}

// 模拟：original.pipe(op1(), op2()).subscribe((v) => console.log("hello", v))
original.subscribe(subscriberOp1);
```

```ts 
function createSubscriber(nextFn) {
    return Subscriber.create(nextFn)
}

function op1(source: Observable) {
    const source$ = new Observable();
    source$.source = source;
    source$.operator = (source, subscriber) => {
        source.subscribe(
            source,
            createSubscriber(v => subscriber.next(v + 1))
        )
    };

    return source$;
}

function op2(source: Observable) {
    const source$ = new Observable();
    source$.source = source;
    source$.operator = (source, subscriber) => {
        subscribe(
            source,
            createSubscriber(v => subscriber.next(v * 2))
        )
    };

    return source$;
}

function subscribe(original, subscriber) {
    if (original.operator) {
        const { operator, source } = original;
        operator(source, subscriber);
    } else {
        original.subscribe(subscriber);
    }

    return subscriber;
}

const original = new Observable(subscriber => {
    subscriber.next(9);
})

const pipedSource = [op1, op2].reduce((state, next) => next(state), original);

/**
 * 经过 reduce 处理后：
 * 
 *    original
 *       |
 *     source1
 *       |
 *     source2 (pipedSource)
 * 
 *  pipedSource 触发 subscribe 时，
 *  相当于调用 pipedSource.operator,
 *  又相当于调用 source1.operator, 
 *  最后相当于 original.subscribe，
 *       
 *  关键在于 subscriber 发生了层层封装
 *  传到 original 的 subscribe 时，
 *  subscriber其实是：
 * 
 *  createSubscriber(v => {
 *     const s = createSubscriber(v => {
 *        const ss = createSubscriber(v => console.log(v));
 *        ss.next(v * 2);
 *     }
 *     
 *     s.next(v + 1)
 *  })
 * 
 *  精髓就在于 subscriber 的嵌套定义，pipedSource一执行 subscribe，
 *  首先完成 pipedSource -> source1 -> original 的 subscriber 的
 *  嵌套定义，之后将嵌套好的 subscriber 传入 original，消费数据，在
 *  消费过程中，数据流向是 original -> source1 -> pipedSource
 */

subscribe(pipedSource, createSubscriber(v => console.log(v)))
```