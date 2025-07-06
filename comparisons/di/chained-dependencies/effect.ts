import { Effect, Context, Layer } from 'effect';

class Config extends Context.Tag('Config')<
  Config,
  Effect.Effect<{
    logLevel: string;
    connection: string;
  }>
>() {}

class Logger extends Context.Tag('Logger')<
  Logger,
  (message: string) => Effect.Effect<void>
>() {}

class Database extends Context.Tag('Database')<
  Database,
  { readonly query: (sql: string) => Effect.Effect<{ result: string }> }
>() {}

const ConfigLive = Layer.succeed(
  Config,
  Effect.succeed({
    logLevel: 'INFO',
    connection: 'mysql://username:password@hostname:port/database_name',
  }),
);

const LoggerLive = Layer.effect(
  Logger,
  Effect.gen(function* () {
    const config = yield* Config;

    return (message) =>
      Effect.gen(function* () {
        const { logLevel } = yield* config;
        console.log(`[${logLevel}] ${message}`);
      });
  }),
);

const DatabaseLive = Layer.effect(
  Database,
  Effect.gen(function* () {
    const config = yield* Config;
    const { connection } = yield* config;

    const log = yield* Logger;

    return {
      query: (sql: string) =>
        Effect.gen(function* () {
          yield* log('Executing query: ' + sql);
          return { result: 'Results from ' + connection };
        }),
    };
  }),
);

const AppConfigLive = Layer.merge(ConfigLive, LoggerLive);

const MainLive = DatabaseLive.pipe(
  Layer.provide(AppConfigLive),
  Layer.provide(ConfigLive),
);

const program = Effect.gen(function* () {
  const database = yield* Database;
  console.log(yield* database.query('SELECT * FROM users'));
});

Effect.runSync(Effect.provide(program, MainLive));
