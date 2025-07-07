import { Effect, Context, Layer, pipe } from 'effect';

class Config extends Context.Tag('Config')<
  Config,
  {
    logLevel: string;
    connection: string;
  }
>() {}

class Logger extends Context.Tag('Logger')<
  Logger,
  (message: string) => Effect.Effect<void>
>() {}

class Database extends Context.Tag('Database')<
  Database,
  { readonly query: (sql: string) => Effect.Effect<{ result: string }> }
>() {}

const program = Effect.gen(function* () {
  const database = yield* Database;
  const log = yield* Logger;

  const data = yield* database.query('SELECT * FROM users');
  yield* log(data.result);
});

const ConfigLive = Layer.succeed(
  Config,
  {
    logLevel: 'INFO',
    connection: 'mysql://username:password@hostname:port/database_name',
  },
);

const LoggerLive = Layer.effect(
  Logger,
  Effect.gen(function* () {
    const config = yield* Config;

    return (message) =>
      Effect.gen(function* () {
        console.log(`[${config.logLevel}] ${message}`);
      });
  }),
);

const DatabaseLive = Layer.effect(
  Database,
  Effect.gen(function* () {
    const config = yield* Config;
    const log = yield* Logger;

    return {
      query: (sql: string) =>
        Effect.gen(function* () {
          yield* log('Executing query: ' + sql);
          return { result: 'Results from ' + config.connection };
        }),
    };
  }),
);

Effect.runSync(
  program.pipe(
    Effect.provide(DatabaseLive),
    Effect.provide(LoggerLive),
    Effect.provide(ConfigLive)
  )
);
