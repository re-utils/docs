---
title: Sleep
description: Synchronous and asynchronous sleep functions.
---
Synchronous and asynchronous sleep functions.
```ts
import { sleep, sleepSync } from 'ciorent';

const logTime = (...args: any[]) => {
  console.log('[' + performance.now().toFixed(1) + 'ms]', ...args);
};

logTime('Start');

// Non-blocking
await sleep(500);
logTime('After about 0.5s');

// This blocks the event loop
// On the browser this only works in workers and blocks the worker thread
sleepSync(500);
logTime('After another 0.5s');
```
