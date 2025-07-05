---
title: API
description: udic library API.
---

Import:
```ts
import * as di from 'udic';
```

#### `di.service()`
- Parameters:
  + `<T>` - Service identifier type.
  + `name: T` - Service identifier.
- Returns `<K>() => Service<T, K> & K`

Create a service.

Example usage:
```ts
// di.Service<'db', DB> & 'db'
const db = di.service('db')<DB>();
```

#### `di.derive()`
- Parameters:
  + `<const T extends di.Dependency[]>` - Compute dependency list type.
  + `<const R>` - Compute result type.
  + `deps: T` - Compute dependency list.
  + `f: (...args: { [K in keyof T] : di.InferResult<T[K]> }) => R` - The function to compute the result from provided dependencies.
- Returns `Compute<InferDependency<T[number]>, R>` - A function that requires the implementations of the provided dependencies to execute.

Example usage:
```ts
// services.ts
import { DatabaseSync } from 'node:sqlite';

export const db = di.service('db')<DatabaseSync>();

// routes.ts
import { db } from './services.ts';
import { router, handle } from '@mapl/web';

const routes = di.derive(
  [db],
  (db) => {
    const getPosts = db.prepare('SELECT * FROM posts');

    // Return a sub-router
    return router.init([], [
      handle.get('/posts/all', () => getPosts.all(), { type: 'json' })
    ]);
  }
);

export default routes;

// main.ts
import { compile } from '@mapl/web';
import routes from './routes.ts';

// Serve the app
export default {
  fetch: compile(
    routes({
      db: new DatabaseSync(':memory:')
    })
  )
};
```
