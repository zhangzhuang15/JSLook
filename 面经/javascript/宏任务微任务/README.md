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

#### idle prepare 
it's internal of Node source code.

#### poll 
really important.

The poll phase has two main functions:
- **Calculating how long it should block and poll for I/O, then**
- **Processing events in the poll queue.**

it's related with the system call about `poll` `epoll` `kqueue`,
and its queue is managed by operation system.

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