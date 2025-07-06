---
title: Semaphore
description: A primitive used to control access to a common resource by multiple task.
---

A primitive used to control access to a common resource by multiple task.

In this example, 5 tasks are spawned but only 2 can run concurrently.
```ts {9, 14, 21}
import { semaphore, sleep } from 'ciorent';

const logTime = (...args: any[]) => {
  console.log('[' + performance.now().toFixed(1) + 'ms]', ...args);
};

// Creates a semaphore with 2 permits
// Each permit allows a task to access resource or to perform an operation concurrently
const sem = semaphore.init(2);

// Example task
const runTask = async (id: number) => {
  // Acquire a permit or wait until a permit is available
  await semaphore.acquire(sem);

  logTime(id, 'started');
  await sleep(1000);
  logTime(id, 'done');

  // Release the permit
  semaphore.release(sem);
}

// Try to run 5 tasks concurrently
for (let i = 1; i <= 5; i++)
  runTask(i);
```

With semaphore the output will be:
```txt showLineNumbers=false
[19.2ms] 1 started
[19.4ms] 2 started
[1020.0ms] 1 done
[1020.5ms] 3 started
[1020.6ms] 2 done
[1020.6ms] 4 started
[2022.0ms] 3 done
[2022.2ms] 5 started
[2022.3ms] 4 done
[3023.2ms] 5 done
```

Without semaphore, all 5 tasks will start without waiting:
```txt showLineNumbers=false
[18.2ms] 1 started
[18.3ms] 2 started
[18.3ms] 3 started
[18.4ms] 4 started
[18.4ms] 5 started
[1019.2ms] 1 done
[1019.4ms] 2 done
[1019.6ms] 3 done
[1019.6ms] 4 done
[1019.6ms] 5 done
```

It is recommended to wrap `semaphore.release` in a `finally` block to release the permit when an error is thrown.
```ts
const runTask = async (...) => {
  await semaphore.acquire(sem);

  try {
    // Code that can throw errors...
  } finally {
    semaphore.release(sem);
  }
}
```

Semaphores can also act like an async queue:
```ts
import { semaphore, sleep } from 'ciorent';

const logTime = (...args: any[]) => {
  console.log('[' + performance.now().toFixed(1) + 'ms]', ...args);
};

// Creates a semaphore with 2 permits
const sem = semaphore.init(2);

// Try to run 5 tasks concurrently
for (let i = 1; i <= 5; i++)
  semaphore.queue(sem, async () => {
    logTime(i, 'started');
    await sleep(1000);
    logTime(i, 'done');
  });
```

`semaphore.queue` is usually faster as it avoids allocating a `Promise` to wait until a permit is available.
