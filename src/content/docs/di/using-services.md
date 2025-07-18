---
title: Using services
description: Create and use udic services.
---

To create a service, you need to provide:
- An unique identifier for injection.
- A type describing possible operations.

```ts
import * as di from 'udic';

// Example service
const createUUID = di.service('createUUID')<
  // Type of the UUID generator
  () => string
>;
```

A service will be optional if the service type includes `undefined`:
```ts
// An optional service
const createUUID = di.service('createUUID')<
  (() => string) | undefined
>;
```

To access the service, use `di.derive` to create a compute based on the service value:
```ts
import * as di from 'udic';

const createUUID = di.service('createUUID')<() => string>;

const printUUID = di.use(
  [createUUID],
  (createUUID) => {
    // Log the generated UUID
    console.log('Generated UUID:', createUUID());
  }
);

// Run the compute by providing required services implementation.
printUUID({
  createUUID: () => 'abcd'
});
```

The output of the compute above will be:
```txt showLineNumbers=false
Generated UUID: abcd
```

## Nesting computes
A compute can be used within another compute.
```ts
import * as di from 'udic';

const number = di.service('number')<number>;

// Calculate a number based on randNumber
const computedNumber = di.use(
  [number],
  (number) => number + 1
);

const string = di.service('string')<number>;

const computedValue = di.use(
  // Capture the compute value
  [computedNumber, string],
  (computedNumber, string) => string + (computedNumber * 2)
);

console.log(
  'Computed value:',
  computedValue({
    number: 0,
    string: 'Result:'
  })
);
```

Example output:
```txt showLineNumbers=false
Result: 2
```
