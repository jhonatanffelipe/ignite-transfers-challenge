export default [
  {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '123456',
    database: 'fin_api',
    migrations: ['./src/database/migrations/*.ts'],
    entities: ['./src/modules/*/entities/*.ts'],
    cli: {
      migrationsDir: './src/database/migrations',
    },
  },
  {
    name: 'seed',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '123456',
    database: 'fin_api',
    migrationsTableName: 'seeds',
    migrations: ['./src/database/seeds/*.ts'],
    entities: ['./src/modules/*/entities/*.ts'],
    cli: {
      migrationsDir: './src/database/seeds',
    },
  },
];
