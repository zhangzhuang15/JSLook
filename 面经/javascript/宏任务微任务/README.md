# Something about Node EventLoop

## intro from official website
### frame 
```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

### Phase
every phase has its own callbacks queue and micro queue;

#### timers 
when you call `setTimeout` `setInterval`, and the callbacks will
be put into the callbacks queue of this phase.

#### pending callbacks 
it's related with some system operations.

e.g. there is an `ECONNREFUSED` error, a callback will be invoked
to deal with this error, and this callback is put into the callbacks
queue of this phase.
> when you connect to server, but server is not running, you'll get `ECONNREFUSED` in nodejs.

#### idle prepare 
it's internal of Node source code.

#### poll 
really important.

The poll phase has two main functions:
- **Calculating how long it should block and poll for I/O, then**
- **Processing events in the poll queue.**

it's related with the system call about `poll` `epoll` `kqueue`,
and its queue is managed by operation system.
> `poll` `epoll` `kqueue` 的API提供了设置timeout选项，因此poll阶段会阻塞一段有限时间

when you intend to read a file, there will be a read event registered into operation system, then if this file is ready,
callback about reading a file will be inserted into the queue,
and be executed.

remember that:
- when `poll queue` is empty:
  - `check queue` not empty, leave `poll phase`, come to `check phase`
  - `check queue` is empty, wait for `poll` until it breaks the limit of waiting time.
- when `poll queue` is not empty:
  - execute the callbacks synchronously until queue is exhausted or the system-dependent hard limit is reached.

#### check 
when you call `setImmediate`, its callback will be put into `check queue`.

#### close callbacks
execute the `close` callback in its queue, e.g. `socket.destroy()` `socket.on('close', () => {})`

### `process.nextTick`
when you call this API, its callback will be put into `next tick queue`, this is a separated queue, it's not related with the phase.

when current operation of javascript stack goes to completetion, `next tick queue` will be fully drained.

if you put a callback into `next tick` queue in a macro task, when macro task is finished, before invoke any micro tasks, this callback will be invoked! It's  same when you do in a micro task.

### `process.nextTick` vs `setImmediate`
in general, `process.nextTick` runs more immediately than `setImmediate`

### `process.nextTick` vs `Promise.resolve().then`
it's not sure which one runs before the other one.


## eventLoop in source code 
src/api/embed_helpers.cc:
```cpp 
Maybe<int> SpinEventLoop(Environment* env) {
  CHECK_NOT_NULL(env);
  MultiIsolatePlatform* platform = GetMultiIsolatePlatform(env);
  CHECK_NOT_NULL(platform);

  Isolate* isolate = env->isolate();
  HandleScope handle_scope(isolate);
  Context::Scope context_scope(env->context());
  SealHandleScope seal(isolate);

  if (env->is_stopping()) return Nothing<int>();

  env->set_trace_sync_io(env->options()->trace_sync_io);
  {
    bool more;
    env->performance_state()->Mark(
        node::performance::NODE_PERFORMANCE_MILESTONE_LOOP_START);
    do {
      if (env->is_stopping()) break;

      // jump into loop
      uv_run(env->event_loop(), UV_RUN_DEFAULT);

      if (env->is_stopping()) break;

      platform->DrainTasks(isolate);

      more = uv_loop_alive(env->event_loop());
      if (more && !env->is_stopping()) continue;

      if (EmitProcessBeforeExit(env).IsNothing())
        break;

      // Emit `beforeExit` if the loop became alive either after emitting
      // event, or after running some callbacks.
      more = uv_loop_alive(env->event_loop());
    } while (more == true && !env->is_stopping());
    env->performance_state()->Mark(
        node::performance::NODE_PERFORMANCE_MILESTONE_LOOP_EXIT);
  }
  if (env->is_stopping()) return Nothing<int>();

  env->set_trace_sync_io(false);
  env->PrintInfoForSnapshotIfDebug();
  env->VerifyNoStrongBaseObjects();
  return EmitProcessExit(env);
}
```

## run entry .js file  in source code
src/api/environment.cc
```cpp 
MaybeLocal<Value> LoadEnvironment(
    Environment* env,
    StartExecutionCallback cb) {
  // prepare libuv for dropping into event loop in future
  env->InitializeLibuv();
  env->InitializeDiagnostics();

  // execute entry .js file here
  return StartExecution(env, cb);
}

```

## some concept in V8
### Platform
### Isolate
### Isolate::Scope
### HandleScope
### Local
### Context
### Context::Scope


## nextTick Promise.resolve().then setTimeout 到底发生了什么？
从工作第一年面试接触nodejs eventLoop，这个问题就困扰着我。持续3年左右，我会看博客、stackoverflow、微信技术公众号、稀土掘金文章，试图解决这个困惑。很遗憾，看过的文章说的太过笼统，没有深入到黑盒。

2023.10.08，我逼迫自己调试node源码，解决这个问题。我非常兴奋，请允许我使用中文写下此文。

如何调试node源码？
1. 下载node的源代码仓库
2. 按照仓库中的`BUILDING.md`，通过源码构建node
3. 编写一个简单的测试文件，比如 `test.js`, 使用lldb开始调试：
```sh 
$ lldb ./node test.js
```
这可以让你知道，node这个二进制程序开始运行后，依次都做了什么。但这种方式无法实现在 `test.js` 打断点调试。

但这不要紧。我从中得到了一条非常有用的信息：node会执行 `test.js` 里的代码，执行完毕后，进入到事件循环。事件循环就是 c/c++ 中的循环语句，只不过在循环里调用:
`uv_run(env->event_loop(),UV_RUN_DEFAULT)`

nodejs官方文档里说的 `timers` `pending` `idle & prepare` `poll` `check` `close` 阶段，都在 `uv_run` 函数里。

但是这些信息不足以理解 `process.nextTick` 这样的调用，所以要对test.js 打断点调试，并且配置 launch.json `skipFiles: []`.

这里给出一个test.js参考：
```js 
console.log('ok');

process.nextTick(() => console.log('A'));

Promise.resolve().then(_ => console.log('B'));
```

经过在vscode断点调试，可以发现`node test.js`的执行过程：


```js
// lib/internal/main/run_main_module.js
'use strict';

const {
  prepareMainThreadExecution
} = require('internal/bootstrap/pre_execution');

// 在这个函数内部，定义了
// require('internal/modules/cjs/loader').Module.runMain
prepareMainThreadExecution(true);

markBootstrapComplete();

require('internal/modules/cjs/loader').Module.runMain(process.argv[1]);
```

```js 
// lib/internal/bootstrap/pre_execution.js
function initializeCJSLoader() {
  const CJSLoader = require('internal/modules/cjs/loader');
  CJSLoader.Module._initPaths();
  // TODO(joyeecheung): deprecate this in favor of a proper hook?
  CJSLoader.Module.runMain =
    require('internal/modules/run_main').executeUserEntryPoint;
}
```

```js 
// lib/internal/modules/run_main.js 
// 上边的 runMain 其实就是这个函数
function executeUserEntryPoint(main = process.argv[1]) {
  const resolvedMain = resolveMainPath(main);
  const useESMLoader = shouldUseESMLoader(resolvedMain);
  if (useESMLoader) {
    runMainESM(resolvedMain || main);
  } else {
    // 会执行这里，main == 'test.js'
    Module._load(main, null, true);
  }
}
```

```js 
// lib/internal/modules/cjs/loader.js

Module._load = function(request, parent, isMain) {
  // ...
  module.load(fileName);

  // ...
}

Module.prototype.load = function(fileName) {
  // ...

  Module._extensions[extension](this, filename);

  // ...
}

Module._extensions['.js'] = function(module, filename) {
  // ...

  module._compile(content, filename);
  
  // ...
}

Module.prototype._compile = function(content, filename) {
  // ...

  // test.js 的内容在这一步被执行！
  result = ReflectApply(compiledWrapper, thisValue,
                          [exports, require, module, filename, dirname]);
  
  // ...
}
```
  
test.js 执行完毕后，就会来到 `processTicksAndRejections`

```js 
// lib/internal/process/task_queues.js
function processTicksAndRejections() {
  let tock;
  do {

    // 执行 nextTick 的时候，回调就会被加入到
    // queue 中；
    // tock 就是 queue 的每一个 nextTick callback 函数
    while (tock = queue.shift()) {
      const asyncId = tock[async_id_symbol];
      emitBefore(asyncId, tock[trigger_async_id_symbol], tock);

      try {
        const callback = tock.callback;
        if (tock.args === undefined) {
          callback();
        } else {
          const args = tock.args;
          switch (args.length) {
            case 1: callback(args[0]); break;
            case 2: callback(args[0], args[1]); break;
            case 3: callback(args[0], args[1], args[2]); break;
            case 4: callback(args[0], args[1], args[2], args[3]); break;
            default: callback(...args);
          }
        }
      } finally {
        if (destroyHooksExist())
          emitDestroy(asyncId);
      }

      emitAfter(asyncId);
    }

    // 上述循环结束，queue清空，然后执行
    // 微任务，也就是 Promise.resolve().then()的回调函数
    //
    // 该queue在js端实现
    //
    // 这解释了，为什么 nextTick 比 Promise.resolve().then() 率先执行
    //
    // 如果在微任务中执行了 nextTick，本来清空的queue又
    // 拥有数据了，queue.isEmpty() 为 false，导致再次
    // 陷入下一轮循环，而不是开始下一轮事件循环
    //
    // runMicrotasks的实现是在 cpp 端， cpp端利用
    // v8 将 runMicrotasks 和 一个 cpp函数做了绑定，
    // 当 v8 执行 runMicrotasks 时，就会调用那个cpp
    // 函数
    runMicrotasks();
  } while (!queue.isEmpty() || processPromiseRejections());
  setHasTickScheduled(false);
  setHasRejectionToWarn(false);
}
```
之后，就会进入到 nodejs 的事件循环。

nodejs非常难以理解，其实就在于 cpp 和 javascript 之间的互操作。javascript端定义的数据、函数，cpp可以访问到；cpp端定义的函数，javascript也可以调用。有了这层基础，在入口文件执行完毕后，cpp实现的事件循环依旧可以去执行javascript的代码。

<br>

  
### 问题：
#### setTimeout回调中，如果使用了 process.nextTick，那么回调执行完毕，process.nextTick注册的函数就会先执行，这是为什么呢？
```js 
// lib/timers.js
function setTimeout(callback, after, arg1, arg2, arg3) {
  // ...

  const timeout = new Timeout(callback, after, args, false, true);
  insert(timeout, timeout._idleTimeout);
  return timeout;
}
```
```js 
// lib/internal/timers

// 新生成的timeout就是参数item，最终会加入到
// timerListQueue, 这个数据结构是在js端实现的；
function insert(item, msecs, start = getLibuvNow()) {
  msecs = MathTrunc(msecs);
  item._idleStart = start;

  let list = timerListMap[msecs];
  if (list === undefined) {
    debug('no %d list was found in insert, creating a new one', msecs);
    const expiry = start + msecs;
    timerListMap[msecs] = list = new TimersList(expiry, msecs);
    timerListQueue.insert(list);

    if (nextExpiry > expiry) {
      // cpp 端实现
      scheduleTimer(msecs);
      nextExpiry = expiry;
    }
  }

  L.append(list, item);
}

// 当事件循环来到 timers phase, 这个函数
// 就会被 cpp 端调用！
function processTimers(now) {
    debug('process timer lists %d', now);
    nextExpiry = Infinity;

    let list;
    let ranAtLeastOneList = false;
    while (list = timerListQueue.peek()) {
      if (list.expiry > now) {
        nextExpiry = list.expiry;
        return refCount > 0 ? nextExpiry : -nextExpiry;
      }
      if (ranAtLeastOneList)
        runNextTicks();
      else
        // 设置为 true 后，执行下一个timeout之前
        // 会先执行上边的 runNextTicks 函数，这个
        // 函数内部调用了 processTicksAndRejections,
        // 这样就会先去清空 nextTick 注册的函数了 
        ranAtLeastOneList = true;
      // 唤醒 timeout 回调
      listOnTimeout(list, now);
    }
    return 0;
}

function listOnTimeout(list, now) {
    const msecs = list.msecs;

    debug('timeout callback %d', msecs);

    let ranAtLeastOneTimer = false;
    let timer;
    while (timer = L.peek(list)) {
      const diff = now - timer._idleStart;

      if (diff < msecs) {
        list.expiry = MathMax(timer._idleStart + msecs, now + 1);
        list.id = timerListId++;
        timerListQueue.percolateDown(1);
        debug('%d list wait because diff is %d', msecs, diff);
        return;
      }

      if (ranAtLeastOneTimer)
        runNextTicks();
      else
        ranAtLeastOneTimer = true;

      L.remove(timer);

      const asyncId = timer[async_id_symbol];

      if (!timer._onTimeout) {
        if (!timer._destroyed) {
          timer._destroyed = true;

          if (timer[kRefed])
            refCount--;

          if (destroyHooksExist())
            emitDestroy(asyncId);
        }
        continue;
      }

      emitBefore(asyncId, timer[trigger_async_id_symbol], timer);

      let start;
      if (timer._repeat)
        start = getLibuvNow();

      // 重点！！！！！！！
      // 重点！！！！！！！
      // 重点！！！！！！！
      // 重点！！！！！！！
      // 重点！！！！！！！
      try {
        // 在这里 timeout 注册的回调被调用
        const args = timer._timerArgs;
        if (args === undefined)
          // 回调函数无参数版本
          timer._onTimeout();
        else
          // 带参数版本
          ReflectApply(timer._onTimeout, timer, args);
      } finally {
        if (timer._repeat && timer._idleTimeout !== -1) {
          timer._idleTimeout = timer._repeat;
          insert(timer, timer._idleTimeout, start);
        } else if (!timer._idleNext && !timer._idlePrev && !timer._destroyed) {
          timer._destroyed = true;

          if (timer[kRefed])
            refCount--;

          if (destroyHooksExist())
            emitDestroy(asyncId);
        }
      }

      emitAfter(asyncId);
    }
    // ....
}
```

setImmediate的处理也是类似的，底层也调用了`runNextTicks`

<br>


#### setTimeout 和 setImmediate 的回调队列是同一个么？
不是。他们被存储的队列是在js端定义的，在`lib/internal/timers.js`可以看到。

setImmediate的队列名叫做`immediateQueue`;

setTimout的队列比较麻烦，回调存储在 `TimersList` 数据结构中(linkedlist)，而该数据结构存储在 `timerListQueue`;

当cpp端触发，最终调用js端定义的`processTimers` 函数时，setTimeout定义的回调函数就会被执行；

当cpp端触发，最终调用js端定义的`processImmediate` 函数时，setImmediate定义的回调函数就会被执行；

<br>

#### setTimeout 和 setInterval 用了同一个队列么？
是的。每个 interval 本质上是 repreat属性值为 true 的 `Timeout`,
在 `processTimers` 中，如果是 interval， 执行完毕后，会被重新加入到队列。

<br>

#### test.js 执行完毕后，为什么会来到 `processTicksAndRejections`，而不是进入事件循环？

执行test.js的cpp代码：
```cpp
// src/node_main_instance.cc

int NodeMainInstance::Run(const EnvSerializeInfo* env_info) {
  Locker locker(isolate_);
  Isolate::Scope isolate_scope(isolate_);
  HandleScope handle_scope(isolate_);

  int exit_code = 0;
  DeleteFnPtr<Environment, FreeEnvironment> env =
      CreateMainEnvironment(&exit_code, env_info);

  CHECK_NOT_NULL(env);
  {
    Context::Scope context_scope(env->context());

    if (exit_code == 0) {

      // 在这里，执行了 test.js 
      LoadEnvironment(env.get(), StartExecutionCallback{});

      // 这里进入事件循环
      exit_code = SpinEventLoop(env.get()).FromMaybe(1);
    }
    ResetStdio();
  }

  // ...

  return exit_code;
}
```
经过检查，事件循环`SpinEventLoop`函数里面，没有找到负责跳转到`processTicksAndRejections`的代码。因此，原因多半在`LoadEnvironment`。

```cpp 
// src/api/environment.cc

MaybeLocal<Value> LoadEnvironment(
    Environment* env,
    StartExecutionCallback cb) {
  env->InitializeLibuv();
  env->InitializeDiagnostics();

  return StartExecution(env, cb);
}
```

```cpp 
// src/node.cc

MaybeLocal<Value> StartExecution(Environment* env, StartExecutionCallback cb) {
  InternalCallbackScope callback_scope(
      env,
      Object::New(env->isolate()),
      { 1, 0 },
      InternalCallbackScope::kSkipAsyncHooks);

  if (cb != nullptr) {
    EscapableHandleScope scope(env->isolate());

    if (StartExecution(env, "internal/bootstrap/environment").IsEmpty())
      return {};

    StartExecutionCallbackInfo info = {
      env->process_object(),
      env->native_module_require(),
    };

    return scope.EscapeMaybe(cb(info));
  }

  if (env->worker_context() != nullptr) {
    return StartExecution(env, "internal/main/worker_thread");
  }

  std::string first_argv;
  if (env->argv().size() > 1) {
    first_argv = env->argv()[1];
  }

  if (first_argv == "inspect") {
    return StartExecution(env, "internal/main/inspect");
  }

  if (per_process::cli_options->print_help) {
    return StartExecution(env, "internal/main/print_help");
  }


  if (env->options()->prof_process) {
    return StartExecution(env, "internal/main/prof_process");
  }

  // -e/--eval without -i/--interactive
  if (env->options()->has_eval_string && !env->options()->force_repl) {
    return StartExecution(env, "internal/main/eval_string");
  }

  if (env->options()->syntax_check_only) {
    return StartExecution(env, "internal/main/check_syntax");
  }

  if (!first_argv.empty() && first_argv != "-") {
    // js 端断点调试的经验告诉我们，cpp端肯定执行了这里，
    // 否则 js 端断点调试的时候，不可能会在 internal/main/run_main_module.js 停下
    return StartExecution(env, "internal/main/run_main_module");
  }

  if (env->options()->force_repl || uv_guess_handle(STDIN_FILENO) == UV_TTY) {
    return StartExecution(env, "internal/main/repl");
  }

  return StartExecution(env, "internal/main/eval_stdin");
}
```
`StartExecution`执行了入口脚本，进而跳转到 test.js 执行，但是该函数执行完毕后，直接`return`了，似乎也没有显示，在执行完test.js脚本之后， cpp 端做了什么，导致在开始事件循环之前，先去执行 `processTicksAndRejections`.

不过，cpp端想要调用js端定义的代码，需要使用`env`才能办到，因此怀疑`InternalCallbackScope callback_scope`可能存在问题。

```cpp 
// src/api/callback.cc

InternalCallbackScope::~InternalCallbackScope() {
  Close();
  env_->PopAsyncCallbackScope();
}

void InternalCallbackScope::Close() {
  // ....

  TickInfo* tick_info = env_->tick_info();

  // ....

  HandleScope handle_scope(isolate);
  Local<Object> process = env_->process_object();

  if (!env_->can_call_into_js()) return;

  // 突破口就在这里！
  // tick_callback，正好是对应 nextTick 概念的，
  // 猜测 tick_callback 就是 processTicksAndRejections
  Local<Function> tick_callback = env_->tick_callback_function();

  // The tick is triggered before JS land calls SetTickCallback
  // to initializes the tick callback during bootstrap.
  CHECK(!tick_callback.IsEmpty());

  if (tick_callback->Call(context, process, 0, nullptr).IsEmpty()) {
    failed_ = true;
  }
  perform_stopping_check();
}
```
只需验证`tick_callback 就是 processTicksAndRejections`, 根据源代码注释，发现js端似乎提供了 `SetTickCallback`函数，因此在js端代码里搜索，发现：
```js 
// lib/internal/process/task_queues.js

const {
  // For easy access to the nextTick state in the C++ land,
  // and to avoid unnecessary calls into JS land.
  tickInfo,
  // Used to run V8's micro task queue.
  runMicrotasks,
  setTickCallback,
  enqueueMicrotask
} = internalBinding('task_queue');

module.exports = {
  setupTaskQueue() {
    // Sets the per-isolate promise rejection callback
    listenForRejections();
    // Sets the callback to be run in every tick.
    setTickCallback(processTicksAndRejections);
    return {
      nextTick,
      runNextTicks
    };
  },
  queueMicrotask
};
```

从代码中可以知道，`setTickCallback`在cpp端实现，js端一旦调用了`setupTaskQueue`函数，`processTicksAndRejections`函数就会传给cpp端，那么我们只需要搞清楚这几个问题即可：
1. cpp端实现的`setTickCallback` 做了什么，和 `env->tick_callback_function()`有没有联系；
2. `setupTaskQueue`函数，有没有被调用，是js端调用，还是cpp端调用的；

搜索cpp源码，找到：
```cpp 
// src/node_task_queue.cc

static void Initialize(Local<Object> target,
                       Local<Value> unused,
                       Local<Context> context,
                       void* priv) {

  // ....

  env->SetMethod(target, "enqueueMicrotask", EnqueueMicrotask);

  // 这里将cpp定义的函数 SetTickCallback 和 js端
  // 的 setTickCallback做了绑定
  env->SetMethod(target, "setTickCallback", SetTickCallback);
  env->SetMethod(target, "runMicrotasks", RunMicrotasks);
  target->Set(env->context(),
              FIXED_ONE_BYTE_STRING(isolate, "tickInfo"),
              env->tick_info()->fields().GetJSArray()).Check();
  
  // ....
}

static void SetTickCallback(const FunctionCallbackInfo<Value>& args) {
  Environment* env = Environment::GetCurrent(args);
  CHECK(args[0]->IsFunction());

  // 通过函数名其实就已经可以知道，env->tick_callback_function()
  // 得到的就是下面设置的 Function 类型的数据
  env->set_tick_callback_function(args[0].As<Function>());
}
```
至此，问题1解决了。

在js代码里搜索`setupTaskQueue`, 发现：
```js 
// lib/internal/bootstrap/node.js

const {
  setupTaskQueue,
  queueMicrotask
} = require('internal/process/task_queues');
```
在该文件中，打断点调试，发现程序并没能停在此处。

只好在cpp端寻找线索。上文提到，`env`是关键变量，找到创建`env`的代码可能会找到一些线索：
```cpp 
// src/node.cc

int Start(int argc, char** argv) {
  InitializationResult result = InitializeOncePerProcess(argc, argv);
  if (result.early_return) {
    return result.exit_code;
  }

  {
    Isolate::CreateParams params;
    const std::vector<size_t>* indexes = nullptr;
    const EnvSerializeInfo* env_info = nullptr;
    bool force_no_snapshot =
        per_process::cli_options->per_isolate->no_node_snapshot;
    if (!force_no_snapshot) {
      v8::StartupData* blob = NodeMainInstance::GetEmbeddedSnapshotBlob();
      if (blob != nullptr) {
        params.snapshot_blob = blob;
        indexes = NodeMainInstance::GetIsolateDataIndexes();

        // env 的信息来自于 env_info, 因此可以在此处打断点，
        // 用 lldb 调试；
        //
        // 令人吃惊的是， 跳入到 GetEnvSerializeInfo 函数后，
        // lldb 标识该函数位于 node_snapshot.cc 文件，但是
        // 源代码并没有该文件。利用lldb提供的 list 命令，查看
        // 到了 node_snapshot.cc 的一些内容，用该内容作为关键
        // 词搜索，看看源代码里有没有匹配的文件，结果发现了
        // snapshot_builder.cc
        env_info = NodeMainInstance::GetEnvSerializeInfo();
      }
    }
    uv_loop_configure(uv_default_loop(), UV_METRICS_IDLE_TIME);

    NodeMainInstance main_instance(&params,
                                   uv_default_loop(),
                                   per_process::v8_platform.Platform(),
                                   result.args,
                                   result.exec_args,
                                   indexes);
    result.exit_code = main_instance.Run(env_info);
  }

  TearDownOncePerProcess();
  return result.exit_code;
}
```

```cpp 
// tools/snapshot/snapshot_builder.cc

std::string SnapshotBuilder::Generate(
    const std::vector<std::string> args,
    const std::vector<std::string> exec_args) {
  Isolate* isolate = Isolate::Allocate();
  isolate->SetCaptureStackTraceForUncaughtExceptions(
    true,
    10,
    v8::StackTrace::StackTraceOptions::kDetailed);
  per_process::v8_platform.Platform()->RegisterIsolate(isolate,
                                                       uv_default_loop());
  std::unique_ptr<NodeMainInstance> main_instance;
  std::string result;

  {
    std::vector<size_t> isolate_data_indexes;
    EnvSerializeInfo env_info;

    const std::vector<intptr_t>& external_references =
        NodeMainInstance::CollectExternalReferences();
    SnapshotCreator creator(isolate, external_references.data());
    Environment* env;
    {
      main_instance =
          NodeMainInstance::Create(isolate,
                                   uv_default_loop(),
                                   per_process::v8_platform.Platform(),
                                   args,
                                   exec_args);

      HandleScope scope(isolate);
      creator.SetDefaultContext(Context::New(isolate));
      isolate_data_indexes = main_instance->isolate_data()->Serialize(&creator);

      // Run the per-context scripts
      Local<Context> context;
      {
        TryCatch bootstrapCatch(isolate);
        context = NewContext(isolate);
        if (bootstrapCatch.HasCaught()) {
          PrintCaughtException(isolate, context, bootstrapCatch);
          abort();
        }
      }
      Context::Scope context_scope(context);

      // Create the environment
      env = new Environment(main_instance->isolate_data(),
                            context,
                            args,
                            exec_args,
                            nullptr,
                            node::EnvironmentFlags::kDefaultFlags,
                            {});
      // Run scripts in lib/internal/bootstrap/
      {
        TryCatch bootstrapCatch(isolate);
        v8::MaybeLocal<Value> result = env->RunBootstrapping();
        if (bootstrapCatch.HasCaught()) {
          PrintCaughtException(isolate, context, bootstrapCatch);
        }
        result.ToLocalChecked();
      }

      if (per_process::enabled_debug_list.enabled(DebugCategory::MKSNAPSHOT)) {
        env->PrintAllBaseObjects();
        printf("Environment = %p\n", env);
      }

      // 上边的内容其实就是创建了一个v8执行环境，然后按照上面的
      // 代码执行一遍，执行的过程中，一些模块就会被加载到env上，
      // 这就包括我们关心的 tick_callback_function(), 而
      // 在 env->RunBootstrapping 中，执行了BootstrapNode
      // 函数，这个函数的作用就是执行 lib/internal/bootstrap/node.js
      //
      // 上文也列举了 lib/internal/bootstrap/node.js 的代码，
      // 它执行了 setupTaskQueue() 函数，从而调用了 setTickCallback函数，这样 processTicksAndRejections 
      // 就被注册到 env 了， env只要使用 env->tick_callback_function() 就可以拿到了
      //
      // 此时env实际与要具体执行的js脚本无关的，可以复用，
      // 于是在这里，对 env 做序列化，随着gcc编译node_snapshot.cc
      // env序列化后的数据作为静态数据打包进node二进制程序中， 
      // 这样，当node执行一个脚本的时候，不需要执行lib/internal/bootstrap/node.js得到env，而是直接反序列化已有的数据，得到 env 的结果。也只有手动编译debug版本的node，才能记录下 node_snapshot.cc 相关的source map.
      //
      // 这也解释了，为什么调试js代码的时候，并没有在lib/internal/bootstrap/node.js停下。
      env_info = env->Serialize(&creator);
      // Serialize the context
      size_t index = creator.AddContext(
          context, {SerializeNodeContextInternalFields, env});
      CHECK_EQ(index, NodeMainInstance::kNodeContextIndex);
    }

    // Must be out of HandleScope
    StartupData blob =
        creator.CreateBlob(SnapshotCreator::FunctionCodeHandling::kClear);
    CHECK(blob.CanBeRehashed());
    // Must be done while the snapshot creator isolate is entered i.e. the
    // creator is still alive.
    FreeEnvironment(env);
    main_instance->Dispose();

    // node_snapshot.cc 的内容，就是 FormatBlob函数的返回结果，
    // 也就是说 node_snapshot.cc 是在编译 node 的时候，动态生成
    // 的。
    result = FormatBlob(&blob, isolate_data_indexes, env_info);
    delete[] blob.data;
  }

  per_process::v8_platform.Platform()->UnregisterIsolate(isolate);
  return result;
}

```