import { Micro, Context } from 'effect';

class Logger extends Context.Tag('Logger')<
  Logger,
  {
    info: (msg: string) => Micro.Micro<void>;
  }
>() {}
class CreateID extends Context.Tag('CreateID')<
  CreateID,
  Micro.Micro<string>
>() {}

interface User {
  readonly name: string;
  readonly id: string;
  readonly credits: number;
}

// Functions that requires dependencies to run
const createUser = (name: string) =>
  Micro.gen(function* () {
    const logger = yield* Micro.service(Logger);
    const createId = yield* Micro.service(CreateID);

    const id = yield* createId;
    yield* logger.info(`User created: id="${id}", name="${name}"`);

    return { name, id, credits: 0 } as User;
  });

const giveUserCredits = (user: User, credits: number) =>
  Micro.gen(function* () {
    const logger = yield* Micro.service(Logger);

    // @ts-ignore
    user.credits += credits;
    yield* logger.info(
      `User credits: id="${user.id}", increased-credits=${credits}, current-credits=${user.credits}`,
    );
  });

// Main program
const main = Micro.gen(function* () {
  const user = yield* createUser('reve');
  yield* giveUserCredits(user, 10);
});

Micro.runSync(
  main.pipe(
    Micro.provideService(Logger, {
      info: (msg) =>
        Micro.sync(() => {
          console.info('[INFO]', msg);
        }),
    }),
    Micro.provideService(
      CreateID,
      Micro.sync(() => '' + Math.round(Math.random() * 1e6)),
    ),
  ),
);
