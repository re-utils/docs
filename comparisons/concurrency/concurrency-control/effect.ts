import { Effect } from 'effect';

const tasks = new Array<Effect.Effect<void>>(100).fill(Effect.sleep(5));
Effect.runPromise(Effect.all(tasks, { concurrency: 2 }));
