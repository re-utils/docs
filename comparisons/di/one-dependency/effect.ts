import { Effect, Context } from 'effect';

class Random extends Context.Tag('Random')<Random, Effect.Effect<number>>() {}

const program = Effect.gen(function* () {
  const random = yield* Random;
  console.log('Random number:', yield* random);
});

Effect.runSync(
  Effect.provideService(program, Random, Effect.sync(Math.random)),
);
