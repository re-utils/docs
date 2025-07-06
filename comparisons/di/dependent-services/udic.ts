import * as di from 'udic';

// Services
const config = di.service('config')<{
  logLevel: string;
  connection: string;
}>();
const log = di.service('log')<(msg: string) => void>();
const db = di.service('db')<{
  query: (sql: string) => { result: string };
}>();

const main = di.derive([db], (db) => {
  console.log(db.query('SELECT * FROM users'));
});

// Implement service that depends on other services
const logImpl = di.impl(
  log,
  di.derive([config], ({ logLevel }) => (msg) => {
    console.log(`[${logLevel}] ${msg}`);
  }),
);
const dbImpl = di.impl(
  db,
  di.derive([config, log], ({ connection }, log) => ({
    query(sql) {
      log('Executing query: ' + sql);
      return { result: 'Results from ' + connection };
    },
  })),
);

// Provide dependencies for the impl
const logDeps = di.merge([logImpl], {
  config: {
    logLevel: 'INFO',
    connection: 'mysql://username:password@hostname:port/database_name',
  },
});
const dbDeps = di.merge([dbImpl], logDeps);

// Run main
main(dbDeps);
