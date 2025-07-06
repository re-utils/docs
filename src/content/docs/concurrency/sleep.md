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

// Non-blocking
logTime('Start async sleep');
await sleep(500);
logTime('End');

// This blocks the event loop, prevents other asynchronous task from running
// On the browser this only works in workers and blocks the worker thread
logTime('Start sync sleep');
sleepSync(500);
logTime('End');
```

Example output:
```txt showLineNumbers=false
[20.0ms] Start async sleep
[520.5ms] End
[520.6ms] Start sync sleep
[1020.8ms] End
```
