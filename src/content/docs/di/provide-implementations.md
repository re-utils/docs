---
title: Provide implementations
description: Provide implementations for udic computes.
---

In this example, we can choose to log the number to the console or file.
```ts
import { appendFileSync } from 'node:fs';
import * as di from 'udic';

const randNumber = di.service('randNumber')<() => number>();
const logNumber = di.service('logNumber')<(n: number) => void>();

// Run the compute by providing a
// random number generator implementation
const run = (
  // A compute with dependency 'randNumber' that returns a number
  compute: di.Compute<
    di.InferDependency<typeof randNumber>,
    number
  >
) => compute({
  randNumber: () => 0
});

// Generate a random number and log the
// value using the provided logger
const computeNumber = di.derive(
  [randNumber, logNumber],
  (randNumber, logNumber) => {
    const result = randNumber();
    logNumber(result);
    return result;
  }
);

run(
  // Log generated number to console
  di.inject(computeNumber, {
    logNumber: (n) => {
      console.log('Result:', n);
    }
  })
);

run(
  // Log generated number to a file
  di.inject(computeNumber, {
    logNumber: (n) => {
      appendFileSync('./debug.log', `Result: ${n}`);
    }
  })
);
```

Example output (both `debug.log` & console):
```
Result: 0
```

## Compute caching
Compute results are cached within the same dependencies map.

In this example, `generateNumber` computed result get cached:
```ts
import { derive } from 'udic';

const generateNumber = derive([], () => Math.random());

const processNumber1 = derive([generateNumber], (number) => number * 2);
const processNumber2 = derive([generateNumber], (number) => number * 2);

const validateGeneratedNumber = derive(
  [processNumber1, processNumber2],
  (number1, number2) => number1 === number2
);

console.log(validateGeneratedNumber({})); // true
```

`inject()` creates a child context, so that `inject()` with different dependencies don't use each other cached result.
```ts
import * as di from 'udic';

const id = di.service('id')<string>();
const label = di.service('label')<string>();

const generatedString = di.derive(
  [id],
  (id) => id + ' - ' + Math.random()
);
const result = di.derive(
  [label, generatedString],
  (label, generatedString) => label + ': ' + generatedString
);

const printString = di.derive(
  [
    // Will generate different numbers
    di.inject(result, { id: 'a' }),
    di.inject(result, { id: 'b' })
  ],
  (string1, string2) => {
    console.log(string1);
    console.log(string2);
  }
);

printString({
  label: 'Result'
});
```

Example output:
```
Result: a - 0.12060530798403102
Result: b - 0.6586330037115373
```

It is recommended that your compute is side-effect free to avoid these issues.
