import * as di from 'udic';

const logger = di.service('logger')<{
  info: (msg: string) => void;
}>();
const createId = di.service('createId')<() => string>();

interface User {
  readonly name: string;
  readonly id: string;
  readonly credits: number;
}

// Functions that requires dependencies to run
const createUser = di.use(
  [createId, logger],
  (createId, logger) =>
    (name: string): User => {
      const id = createId();
      logger.info(`User created: id="${id}", name="${name}"`);
      return { name, id, credits: 0 };
    },
);

const giveUserCredits = di.use(
  [logger],
  (logger) => (user: User, credits: number) => {
    // @ts-ignore
    user.credits += credits;
    logger.info(
      `User credits: id="${user.id}", increased-credits=${credits}, current-credits=${user.credits}`,
    );
  },
);

// Main program
const main = di.use(
  [createUser, giveUserCredits],
  (createUser, giveUserCredits) => {
    const user = createUser('reve');
    giveUserCredits(user, 10);
  },
);

main({
  logger: {
    info: (msg) => console.info('[INFO]', msg),
  },
  createId: () => '' + Math.round(Math.random() * 1e6),
});
