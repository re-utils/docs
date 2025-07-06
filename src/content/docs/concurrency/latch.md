---
title: Latch
description: A primitive that allows one task to wait until another task completes an operation before continuing execution.
---
A primitive that allows one task to wait until another task completes an operation before continuing execution.

In this example, `fetch` only runs after `startFetch` is opened.
```ts {8, 13, 22} twoslash
import { latch, sleep } from 'ciorent';

const logTime = (...args: any[]) => {
  console.log('[' + performance.now().toFixed(1) + 'ms]', ...args);
};

// Create a latch in closed state
const startFetch = latch.init();

// Run an asynchronous task
(async () => {
  // Wait until the latch is opened
  await latch.wait(startFetch);

  logTime('Fetch started');
  await fetch('http://example.com');
  logTime('Fetch done');
})();

// Open the latch after 500ms
await sleep(500);
latch.open(startFetch);
```

With latch, the output will be:
```
[533.5ms] Fetch started
[969.9ms] Fetch done
```

Without latch, the fetch call runs concurrently with `sleep`:
```
[30.9ms] Fetch started
[494.7ms] Fetch done
```
