import { Micro, Context } from 'effect';

class Random extends Context.Tag('Random')<Random, Micro.Micro<number>>() {}

const program = Micro.gen(function* () {
  const random = yield* Micro.service(Random);
  console.log('Random number:', yield* random);
});

Micro.runSync(Micro.provideService(program, Random, Micro.sync(Math.random)));
