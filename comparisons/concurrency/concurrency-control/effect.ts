import { Effect } from 'effect';

Effect.runPromise(
  Effect.all(new Array<Effect.Effect<void>>(100).fill(Effect.sleep(5)), {
    concurrency: 2,
  }),
);
