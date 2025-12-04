---
title: Yield
description: Yield control in an expensive operation, allowing other tasks to run.
---

A primitive to yield control in an expensive operation, allowing other tasks to run.
```ts {15}
import { nextTick, sleep } from 'ciorent';

const logTime = (...args: any[]) => {
  console.log('[' + performance.now().toFixed(1) + 'ms]', ...args);
};

const expensiveTask = async () => {
  logTime('Task', 0, 'started');

  let x = 0;

  // Simulate expensive operation
  for (let i = 0, l = (Math.random() + 15) * 1e6; i < l; i++) {
    // Yield occasionally for the main thread to run other tasks
    if (i % 1e5 === 0) await nextTick;
    x += Math.random() * 32 + i * Math.round(Math.random() * 16);
  }

  logTime('Task', 0, 'done:', x);
};

// Short async task
const asyncTask = async (id: number) => {
  logTime('Task', id, 'started');
  await sleep(20);
  logTime('Task', id, 'done');
}

expensiveTask();
for (let i = 1; i <= 3; i++)
  asyncTask(i);
```

With yield, other asynchronous tasks can be executed without getting blocked:
```txt showLineNumbers=false
[45.1ms] Task 0 started
[45.6ms] Task 1 started
[45.8ms] Task 2 started
[45.8ms] Task 3 started
[1343.6ms] Task 0 done: 957682061201454.9
[1352.7ms] Task 1 done
[1352.9ms] Task 2 done
[1353.0ms] Task 3 done
```

Without yield, other asynchronous tasks have to wait for the expensive task to finish before starting execution.
```txt showLineNumbers=false
[49.1ms] Task 0 started
[1154.6ms] Task 0 done: 950725777197346.9
[1156.0ms] Task 1 started
[1156.3ms] Task 2 started
[1156.5ms] Task 3 started
[1181.6ms] Task 1 done
[1181.8ms] Task 2 done
[1181.9ms] Task 3 done
```
